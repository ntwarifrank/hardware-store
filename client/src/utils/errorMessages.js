/**
 * User-Friendly Error Messages
 * Converts technical/API errors to friendly messages for users
 */

/**
 * Get user-friendly error message
 * @param {string|object} error - Error from API or technical message
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyError = (error) => {
  // If it's already a user-friendly message from backend, use it
  if (typeof error === 'string') {
    // Check if it's already a friendly message (contains common words)
    const friendlyPatterns = [
      'please', 'verify', 'check', 'try again', 'contact', 
      'invalid', 'incorrect', 'not found', 'already exists',
      'expired', 'suspended', 'blocked'
    ];
    
    const lowerError = error.toLowerCase();
    const isFriendly = friendlyPatterns.some(pattern => lowerError.includes(pattern));
    
    if (isFriendly) {
      return error;
    }
  }

  // Extract error message from different formats
  let errorMessage = '';
  
  if (typeof error === 'object' && error !== null) {
    errorMessage = error.message || error.error || error.data?.message || '';
  } else {
    errorMessage = String(error || '');
  }

  const lowerMsg = errorMessage.toLowerCase();

  // Map technical errors to user-friendly messages
  const errorMap = {
    // Network/Connection errors
    'network error': 'Cannot connect. Check your internet.',
    'network request failed': 'No internet connection. Please check your WiFi.',
    'timeout': 'Taking too long. Please try again.',
    'enotfound': 'Cannot connect. Check your internet.',
    
    // Status code errors
    'status code 400': 'Something is wrong. Please check what you typed.',
    'status code 401': 'Wrong email or password. Please try again.',
    'status code 403': 'You cannot access this right now.',
    'status code 404': 'Cannot find your account. Check your email.',
    'status code 409': 'This email is already used. Try logging in.',
    'status code 429': 'Please wait a moment, then try again.',
    'status code 500': 'Something went wrong. Please try again.',
    'status code 503': 'Service is busy. Try again in a minute.',
    
    // Authentication errors
    'invalid credentials': 'Wrong email or password.',
    'invalid email or password': 'Wrong email or password. Try again.',
    'invalid password': 'Wrong password. Try again.',
    'wrong password': 'Wrong password. Try again.',
    'user not found': 'No account with this email. Check your email.',
    'no user found': 'No account with this email. Want to sign up?',
    'account not found': 'Cannot find this account. Check your email.',
    'email not found': 'No account with this email.',
    
    // Registration errors
    'user already exists': 'This email is already used. Try logging in.',
    'email already exists': 'This email is already used. Login instead.',
    'already exists': 'Already have an account with this email.',
    
    // Email verification
    'email not verified': 'Please check your email first.',
    'not verified': 'Check your email for verification code.',
    'verification failed': 'Wrong code. Get a new one.',
    'invalid verification code': 'Wrong code. Try again.',
    'invalid otp': 'Wrong code. Check and try again.',
    'otp expired': 'Code expired. Get a new one.',
    'expired verification': 'Code expired. Request new code.',
    'code expired': 'Code expired. Get new code.',
    
    // Account status
    'account blocked': 'Your account is blocked. Call support.',
    'account suspended': 'Account suspended. Call support.',
    'account disabled': 'Account disabled. Call support.',
    'blocked': 'Account blocked. Call support.',
    
    // Password errors
    'weak password': 'Password too weak. Use letters, numbers, and symbols.',
    'password too short': 'Password too short. Use at least 8 characters.',
    'password mismatch': 'Passwords do not match. Try again.',
    'passwords do not match': 'Passwords are different.',
    'current password incorrect': 'Current password is wrong.',
    
    // Token/Session errors
    'token expired': 'Please login again.',
    'session expired': 'Please login again.',
    'invalid token': 'Please login again.',
    'unauthorized': 'Please login first.',
    'not authorized': 'Please login first.',
    
    // Validation errors
    'invalid email': 'Email is wrong. Check it.',
    'invalid format': 'Wrong format. Check what you typed.',
    'required field': 'Fill in all fields.',
    'missing field': 'Some fields are empty. Fill them.',
    'validation failed': 'Check what you typed.',
    
    // Terms acceptance
    'accept terms': 'Please accept Terms and Conditions.',
    'terms required': 'Accept Terms and Conditions first.',
    'terms not accepted': 'Please check the Terms box.',
    
    // Rate limiting - Simple messages
    'too many': 'Please wait a moment, then try again.',
    'wait': 'Please wait a moment.',
    'slow down': 'Slow down. Try again in a minute.',
  };

  // Check for matching error pattern
  for (const [key, message] of Object.entries(errorMap)) {
    if (lowerMsg.includes(key)) {
      return message;
    }
  }

  // If no match found, return a generic friendly message
  if (lowerMsg.includes('login') || lowerMsg.includes('signin')) {
    return 'Cannot login. Check your email and password.';
  }
  
  if (lowerMsg.includes('register') || lowerMsg.includes('signup')) {
    return 'Cannot register. Check what you typed.';
  }

  // Generic fallback
  return 'Something went wrong. Please try again.';
};

/**
 * Get friendly message for specific login errors
 */
export const getLoginError = (error) => {
  return getUserFriendlyError(error);
};

/**
 * Get friendly message for specific registration errors
 */
export const getRegisterError = (error) => {
  return getUserFriendlyError(error);
};

/**
 * Check if error is about email verification
 */
export const isEmailVerificationError = (error) => {
  if (!error) return false;
  const msg = String(error).toLowerCase();
  return msg.includes('verify') || msg.includes('verification') || msg.includes('otp');
};

/**
 * Check if error is about blocked account
 */
export const isAccountBlockedError = (error) => {
  if (!error) return false;
  const msg = String(error).toLowerCase();
  return msg.includes('blocked') || msg.includes('suspended') || msg.includes('disabled');
};

export default {
  getUserFriendlyError,
  getLoginError,
  getRegisterError,
  isEmailVerificationError,
  isAccountBlockedError,
};
