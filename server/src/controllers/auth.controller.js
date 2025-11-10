import crypto from 'crypto';
import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import User from '../models/User.js';
import { generateTokens, verifyToken } from '../utils/generateToken.js';
import { sendWelcomeEmail, sendPasswordResetEmail, sendOTPEmail } from '../utils/sendEmail.js';
import { generateOTP, generateTempUserId, hashOTP, verifyOTP, getOTPExpiry } from '../utils/otpUtils.js';
// import { recordFailedAttempt, recordSuccessAttempt, isCaptchaRequired } from '../utils/suspiciousActivityTracker.js';
import logger from '../utils/logger.js';
import { AUTH_MESSAGES, validatePasswordStrength, validateEmail } from '../utils/authMessages.js';

/**
 * @desc    Register new user - Step 1: Send OTP
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, acceptedTerms } = req.body;

  // Validate input
  if (!email || !password || !name) {
    throw new AppError(AUTH_MESSAGES.VALIDATION.MISSING_FIELDS, 400);
  }

  if (!validateEmail(email)) {
    throw new AppError(AUTH_MESSAGES.REGISTER.INVALID_EMAIL, 400);
  }

  if (name.trim().length < 2) {
    throw new AppError(AUTH_MESSAGES.REGISTER.INVALID_NAME, 400);
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    throw new AppError(passwordValidation.message, 400);
  }

  // Validate terms acceptance (optional but recommended)
  if (acceptedTerms !== undefined && !acceptedTerms) {
    throw new AppError('You must accept the terms and conditions to register', 400);
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError(AUTH_MESSAGES.REGISTER.EMAIL_EXISTS, 409);
  }

  // Generate OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);
  const tempUserId = generateTempUserId();

  // Create pending user (not fully registered yet)
  const user = await User.create({
    name,
    email,
    password,
    isEmailVerified: false,
    twoFactorCode: hashedOTP,
    twoFactorExpire: getOTPExpiry(),
    tempUserId,
    acceptedTerms: acceptedTerms || false,
    termsAcceptedAt: acceptedTerms ? new Date() : undefined,
    termsVersion: '1.0',
  });

  // Send OTP email (don't wait for it)
  sendOTPEmail(user.email, user.name, otp).catch((err) => {
    logger.error(`Failed to send OTP email: ${err.message}`);
  });

  res.status(201).json({
    success: true,
    message: AUTH_MESSAGES.REGISTER.SUCCESS,
    data: {
      tempUserId,
      email: user.email,
    },
  });
});

/**
 * @desc    Verify OTP and complete registration - Step 2
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTPCode = asyncHandler(async (req, res) => {
  const { tempUserId, otp } = req.body;

  // Find user by tempUserId
  const user = await User.findOne({
    tempUserId,
    twoFactorExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(AUTH_MESSAGES.OTP.EXPIRED, 400);
  }

  // Verify OTP
  const isOTPValid = verifyOTP(otp, user.twoFactorCode);
  if (!isOTPValid) {
    throw new AppError(AUTH_MESSAGES.OTP.INVALID, 400);
  }

  // Update user - mark as verified
  user.isEmailVerified = true;
  user.twoFactorCode = undefined;
  user.twoFactorExpire = undefined;
  user.tempUserId = undefined;
  await user.save();

  // Generate tokens with role-based expiration
  const { accessToken, refreshToken } = generateTokens(user._id, user.role);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  // Send welcome email (don't wait for it)
  sendWelcomeEmail(user.email, user.name).catch((err) => {
    logger.error(`Failed to send welcome email: ${err.message}`);
  });

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: AUTH_MESSAGES.OTP.VERIFIED,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    },
  });
});

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
export const resendOTP = asyncHandler(async (req, res) => {
  const { tempUserId } = req.body;

  // Find user by tempUserId
  const user = await User.findOne({ tempUserId });

  if (!user) {
    throw new AppError(AUTH_MESSAGES.OTP.NOT_FOUND, 400);
  }

  // Generate new OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);

  // Update user
  user.twoFactorCode = hashedOTP;
  user.twoFactorExpire = getOTPExpiry();
  await user.save();

  // Send OTP email (don't wait for it)
  sendOTPEmail(user.email, user.name, otp).catch((err) => {
    logger.error(`Failed to send OTP email: ${err.message}`);
  });

  res.status(200).json({
    success: true,
    message: AUTH_MESSAGES.OTP.RESENT,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent') || 'Unknown';

  // Validate input
  if (!email || !password) {
    throw new AppError(AUTH_MESSAGES.VALIDATION.MISSING_FIELDS, 400);
  }

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    logger.warn(`Failed login attempt for non-existent user: ${email} from IP: ${ip}`);
    throw new AppError(AUTH_MESSAGES.LOGIN.USER_NOT_FOUND, 401);
  }

  // Check if user is blocked
  if (user.isBlocked) {
    logger.warn(`Blocked user attempted login: ${email} from IP: ${ip}`);
    throw new AppError(AUTH_MESSAGES.LOGIN.ACCOUNT_BLOCKED, 403);
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    logger.warn(`Unverified user attempted login: ${email} from IP: ${ip}`);
    throw new AppError(AUTH_MESSAGES.LOGIN.EMAIL_NOT_VERIFIED, 403);
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    logger.warn(`Failed login attempt for ${email} from IP: ${ip}`);
    throw new AppError(AUTH_MESSAGES.LOGIN.WRONG_PASSWORD, 401);
  }

  // Security: Update last login info
  user.lastLogin = new Date();
  user.lastLoginIP = ip;
  user.loginHistory = user.loginHistory || [];
  user.loginHistory.unshift({
    ip,
    userAgent,
    timestamp: new Date(),
    success: true
  });
  // Keep only last 10 login records
  if (user.loginHistory.length > 10) {
    user.loginHistory = user.loginHistory.slice(0, 10);
  }

  // Generate tokens with role-based expiration
  const { accessToken, refreshToken } = generateTokens(user._id, user.role);

  logger.info(`Successful login for ${email} from IP: ${ip}`);

  // Save refresh token to user with metadata
  user.refreshToken = refreshToken;
  user.refreshTokenIssuedAt = new Date();
  await user.save();

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: AUTH_MESSAGES.LOGIN.SUCCESS,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    },
  });
});

/**
 * @desc    Logout user (Enhanced Security)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.user._id;

  try {
    // Security: Clear ALL authentication tokens and session data
    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
      refreshTokenIssuedAt: null,
      lastLogout: new Date(),
      lastLogoutIP: ip
    });

    logger.info(`User ${req.user.email} logged out from IP: ${ip}`);

    // Clear refresh token cookie with all security options
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.LOGOUT.SUCCESS,
      data: {
        loggedOut: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(`Logout error for user ${userId}: ${error.message}`);
    throw error;
  }
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(AUTH_MESSAGES.TOKEN.MISSING, 401);
  }

  // Verify refresh token
  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Get user
  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError(AUTH_MESSAGES.TOKEN.REFRESH_INVALID, 401);
  }

  // Generate new access token with role-based expiration
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.role);

  // Update refresh token
  user.refreshToken = newRefreshToken;
  await user.save();

  // Set new refresh token in cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    data: {
      accessToken,
    },
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(AUTH_MESSAGES.PASSWORD_RESET.USER_NOT_FOUND, 404);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // Send reset email
  try {
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.PASSWORD_RESET.EMAIL_SENT,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    throw new AppError('Failed to send password reset email. Please try again later.', 500);
  }
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Hash token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(AUTH_MESSAGES.PASSWORD_RESET.INVALID_TOKEN, 400);
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: AUTH_MESSAGES.PASSWORD_RESET.SUCCESS,
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    throw new AppError(AUTH_MESSAGES.PASSWORD_CHANGE.WRONG_CURRENT, 401);
  }

  // Validate new password strength
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.valid) {
    throw new AppError(passwordValidation.message, 400);
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: AUTH_MESSAGES.PASSWORD_CHANGE.SUCCESS,
  });
});
