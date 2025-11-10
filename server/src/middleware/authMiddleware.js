import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/handleAsync.js';
import { AppError } from './errorMiddleware.js';
import User from '../models/User.js';
import { AUTH_MESSAGES } from '../utils/authMessages.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    throw new AppError(AUTH_MESSAGES.TOKEN.MISSING, 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      throw new AppError(AUTH_MESSAGES.TOKEN.INVALID, 401);
    }

    // Check if user is blocked
    if (req.user.isBlocked) {
      throw new AppError(AUTH_MESSAGES.ACCOUNT.BLOCKED, 403);
    }

    next();
  } catch (error) {
    // Handle JWT-specific errors
    if (error.name === 'TokenExpiredError') {
      throw new AppError(AUTH_MESSAGES.TOKEN.EXPIRED, 401);
    } else if (error.name === 'JsonWebTokenError') {
      throw new AppError(AUTH_MESSAGES.TOKEN.INVALID, 401);
    }
    throw new AppError(AUTH_MESSAGES.TOKEN.INVALID, 401);
  }
});

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        AUTH_MESSAGES.AUTHORIZATION.NOT_AUTHORIZED,
        403
      );
    }
    next();
  };
};

/**
 * Check if user is admin
 */
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AppError(AUTH_MESSAGES.TOKEN.MISSING, 401);
  }

  if (req.user.role !== 'admin') {
    throw new AppError(AUTH_MESSAGES.AUTHORIZATION.ADMIN_ONLY, 403);
  }

  next();
});

/**
 * Optional authentication - doesn't throw error if no token
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      // Token invalid, but we don't throw error
      req.user = null;
    }
  }

  next();
});
