/**
 * Authentication Error Messages
 * User-friendly messages for different authentication scenarios
 */

export const AUTH_MESSAGES = {
  // Login messages
  LOGIN: {
    SUCCESS: 'Login successful! Welcome back.',
    INVALID_CREDENTIALS: 'Wrong email or password. Try again.',
    USER_NOT_FOUND: 'No account with this email. Check your email.',
    WRONG_PASSWORD: 'Wrong password. Try again.',
    ACCOUNT_BLOCKED: 'Account blocked. Call support.',
    EMAIL_NOT_VERIFIED: 'Check your email first.',
    TOO_MANY_ATTEMPTS: 'Please wait a moment, then try again.',
  },

  // Registration messages
  REGISTER: {
    SUCCESS: 'Check your email for verification code.',
    EMAIL_EXISTS: 'This email is already used. Login instead.',
    WEAK_PASSWORD: 'Password too weak. Use letters, numbers, and symbols.',
    INVALID_EMAIL: 'Email is wrong. Check it.',
    INVALID_NAME: 'Name is too short. Use at least 2 letters.',
    SENDING_OTP: 'Code sent to your email. Check inbox.',
  },

  // OTP/Verification messages
  OTP: {
    INVALID: 'Wrong code. Try again.',
    EXPIRED: 'Code expired. Get a new one.',
    ALREADY_VERIFIED: 'Email already verified. Login now.',
    RESENT: 'New code sent to your email.',
    VERIFIED: 'Email verified! You can login now.',
    NOT_FOUND: 'Session expired. Register again.',
  },

  // Token messages
  TOKEN: {
    MISSING: 'Please login first.',
    INVALID: 'Please login again.',
    EXPIRED: 'Please login again.',
    REFRESH_EXPIRED: 'Please login again.',
    REFRESH_INVALID: 'Please login again.',
    REFRESH_SUCCESS: 'Session refreshed.',
  },

  // Password reset messages
  PASSWORD_RESET: {
    EMAIL_SENT: 'Check your email for reset link.',
    INVALID_TOKEN: 'Reset link expired. Request new one.',
    TOKEN_EXPIRED: 'Link expired. Request new one.',
    SUCCESS: 'Password changed! Login now.',
    USER_NOT_FOUND: 'No account with this email.',
    SAME_PASSWORD: 'Use different password.',
  },

  // Password change messages
  PASSWORD_CHANGE: {
    SUCCESS: 'Password changed!',
    WRONG_CURRENT: 'Current password is wrong.',
    SAME_AS_OLD: 'Use different password.',
    WEAK_PASSWORD: 'Password too weak. Use letters, numbers, and symbols.',
  },

  // Logout messages
  LOGOUT: {
    SUCCESS: 'Logged out. See you!',
    ERROR: 'Cannot logout. Try again.',
  },

  // Authorization messages
  AUTHORIZATION: {
    NOT_AUTHORIZED: 'You cannot do this.',
    ADMIN_ONLY: 'Only admin can do this.',
    OWNER_ONLY: 'You can only access your own items.',
    ROLE_REQUIRED: (role) => `Need ${role} permission.`,
  },

  // Account status messages
  ACCOUNT: {
    BLOCKED: 'Account blocked. Call support.',
    DELETED: 'Account deleted.',
    INACTIVE: 'Account inactive. Call support.',
  },

  // Validation messages
  VALIDATION: {
    MISSING_FIELDS: 'Fill in all fields.',
    INVALID_INPUT: 'Check what you typed.',
    EMAIL_REQUIRED: 'Email is required.',
    PASSWORD_REQUIRED: 'Password is required.',
    NAME_REQUIRED: 'Name is required.',
  },
};

/**
 * Get user-friendly error message based on error type
 * @param {string} errorType - Type of error
 * @param {Object} details - Additional error details
 * @returns {string} - User-friendly error message
 */
export const getAuthErrorMessage = (errorType, details = {}) => {
  const errorMap = {
    // JWT errors
    'JsonWebTokenError': AUTH_MESSAGES.TOKEN.INVALID,
    'TokenExpiredError': AUTH_MESSAGES.TOKEN.EXPIRED,
    'NotBeforeError': AUTH_MESSAGES.TOKEN.INVALID,
    
    // Mongoose/Database errors
    'ValidationError': AUTH_MESSAGES.VALIDATION.INVALID_INPUT,
    'CastError': AUTH_MESSAGES.VALIDATION.INVALID_INPUT,
    
    // Custom error types
    'EMAIL_EXISTS': AUTH_MESSAGES.REGISTER.EMAIL_EXISTS,
    'USER_NOT_FOUND': AUTH_MESSAGES.LOGIN.USER_NOT_FOUND,
    'INVALID_CREDENTIALS': AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS,
    'ACCOUNT_BLOCKED': AUTH_MESSAGES.LOGIN.ACCOUNT_BLOCKED,
    'EMAIL_NOT_VERIFIED': AUTH_MESSAGES.LOGIN.EMAIL_NOT_VERIFIED,
    'OTP_INVALID': AUTH_MESSAGES.OTP.INVALID,
    'OTP_EXPIRED': AUTH_MESSAGES.OTP.EXPIRED,
  };

  return errorMap[errorType] || 'An error occurred. Please try again.';
};

/**
 * Format validation errors for frontend
 * @param {Object} validationError - Mongoose validation error
 * @returns {Object} - Formatted validation errors
 */
export const formatValidationErrors = (validationError) => {
  const errors = {};
  
  if (validationError.errors) {
    Object.keys(validationError.errors).forEach((field) => {
      errors[field] = validationError.errors[field].message;
    });
  }
  
  return {
    message: AUTH_MESSAGES.VALIDATION.INVALID_INPUT,
    errors,
  };
};

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} - Validation result
 */
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isStrong = 
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar;

  return {
    valid: isStrong,
    message: isStrong 
      ? 'Strong password' 
      : AUTH_MESSAGES.REGISTER.WEAK_PASSWORD,
    details: {
      length: password.length >= minLength,
      uppercase: hasUpperCase,
      lowercase: hasLowerCase,
      numbers: hasNumbers,
      specialChar: hasSpecialChar,
    },
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default AUTH_MESSAGES;
