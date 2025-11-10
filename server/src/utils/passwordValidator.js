/**
 * Password Strength Validator
 * Comprehensive password validation utilities
 */

// Common weak passwords to block
const COMMON_PASSWORDS = [
  'password', '12345678', 'qwerty', 'abc123', '111111', '123123',
  'password123', 'admin', 'letmein', 'welcome', 'monkey', 'dragon',
  'master', 'sunshine', 'princess', 'football', 'iloveyou', '123456789'
];

// Compromised password patterns
const WEAK_PATTERNS = [
  /^(.)\1+$/, // All same characters (e.g., "aaaaaaa")
  /^(12|23|34|45|56|67|78|89)+$/, // Sequential numbers
  /^(abc|bcd|cde|def|efg)+/i, // Sequential letters
];

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} Strength analysis
 */
export const checkPasswordStrength = (password) => {
  const result = {
    score: 0,
    strength: 'weak',
    feedback: [],
    isValid: false,
  };

  // Length check
  if (password.length < 8) {
    result.feedback.push('Password must be at least 8 characters long');
    return result;
  }
  if (password.length >= 8) result.score += 1;
  if (password.length >= 12) result.score += 1;
  if (password.length >= 16) result.score += 1;

  // Character variety checks
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#]/.test(password);

  if (hasLowercase) result.score += 1;
  if (hasUppercase) result.score += 1;
  if (hasNumber) result.score += 1;
  if (hasSpecialChar) result.score += 1;

  // Check for common passwords
  if (COMMON_PASSWORDS.some(weak => password.toLowerCase().includes(weak))) {
    result.feedback.push('Password contains common words');
    result.score = Math.max(0, result.score - 2);
  }

  // Check for weak patterns
  if (WEAK_PATTERNS.some(pattern => pattern.test(password))) {
    result.feedback.push('Password contains predictable patterns');
    result.score = Math.max(0, result.score - 2);
  }

  // Determine strength
  if (result.score >= 7) {
    result.strength = 'strong';
    result.isValid = true;
  } else if (result.score >= 5) {
    result.strength = 'medium';
    result.isValid = true;
  } else {
    result.strength = 'weak';
    result.isValid = false;
  }

  // Generate feedback
  if (!hasLowercase) result.feedback.push('Add lowercase letters');
  if (!hasUppercase) result.feedback.push('Add uppercase letters');
  if (!hasNumber) result.feedback.push('Add numbers');
  if (!hasSpecialChar) result.feedback.push('Add special characters (@$!%*?&#)');

  return result;
};

/**
 * Validate password meets minimum requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const errors = [];

  // Length
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (password && password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // Character requirements
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[@$!%*?&#]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&#)');
  }

  // Check common passwords
  if (COMMON_PASSWORDS.some(weak => password.toLowerCase().includes(weak))) {
    errors.push('Password is too common or contains common words');
  }

  // Check weak patterns
  if (WEAK_PATTERNS.some(pattern => pattern.test(password))) {
    errors.push('Password contains predictable patterns');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate password strength suggestions
 * @param {string} password - Password to analyze
 * @returns {Array} Array of suggestions
 */
export const getPasswordSuggestions = (password) => {
  const suggestions = [];

  if (password.length < 12) {
    suggestions.push('Use at least 12 characters for better security');
  }

  if (!/[a-z]/.test(password)) {
    suggestions.push('Include lowercase letters (a-z)');
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Include uppercase letters (A-Z)');
  }
  if (!/\d/.test(password)) {
    suggestions.push('Include numbers (0-9)');
  }
  if (!/[@$!%*?&#]/.test(password)) {
    suggestions.push('Include special characters (@$!%*?&#)');
  }

  // Variety check
  const uniqueChars = new Set(password).size;
  if (uniqueChars < password.length * 0.5) {
    suggestions.push('Use more variety of characters');
  }

  if (suggestions.length === 0) {
    suggestions.push('Password strength is good!');
  }

  return suggestions;
};

export default {
  checkPasswordStrength,
  validatePassword,
  getPasswordSuggestions,
};
