/**
 * Client-Side Validation Utilities
 * Real-time validation for forms
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  const errors = [];
  
  if (!email || email.trim() === '') {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  // Email length
  if (email.length > 100) {
    errors.push('Email is too long (max 100 characters)');
  }

  // Block disposable email domains
  const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com'];
  const domain = email.split('@')[1];
  if (domain && disposableDomains.includes(domain.toLowerCase())) {
    errors.push('Disposable email addresses are not allowed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength score
 */
export const validatePassword = (password) => {
  const errors = [];
  let score = 0;
  let strength = 'weak';

  if (!password || password.trim() === '') {
    errors.push('Password is required');
    return { isValid: false, errors, score: 0, strength: 'weak' };
  }

  // Length requirements
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  if (password.length > 128) {
    errors.push('Password is too long (max 128 characters)');
  }

  // Character variety
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#]/.test(password);

  if (!hasLowercase) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!hasNumber) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character (@$!%*?&#)');
  } else {
    score += 1;
  }

  // Check for common passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123'];
  if (commonPasswords.some(weak => password.toLowerCase().includes(weak))) {
    errors.push('Password is too common');
    score = Math.max(0, score - 2);
  }

  // Additional length bonus
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Determine strength
  if (score >= 6) {
    strength = 'strong';
  } else if (score >= 4) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }

  return {
    isValid: errors.length === 0,
    errors,
    score,
    strength,
  };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
export const validateName = (name) => {
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
    return { isValid: false, errors };
  }

  // Length
  if (name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (name.length > 50) {
    errors.push('Name is too long (max 50 characters)');
  }

  // Only letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    errors.push('Name can only contain letters, spaces, hyphens and apostrophes');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate OTP code
 * @param {string} otp - OTP to validate
 * @returns {Object} Validation result
 */
export const validateOTP = (otp) => {
  const errors = [];

  if (!otp || otp.trim() === '') {
    errors.push('OTP is required');
    return { isValid: false, errors };
  }

  // Must be exactly 6 digits
  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    errors.push('OTP must be exactly 6 digits');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number (optional)
 * @param {string} phone - Phone to validate
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  const errors = [];

  if (!phone || phone.trim() === '') {
    // Phone is optional, so empty is valid
    return { isValid: true, errors };
  }

  // Rwanda phone format: +250 XXX XXX XXX or 07XX XXX XXX
  const phoneRegex = /^(\+250|0)(7[0-9]{8})$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    errors.push('Please enter a valid Rwandan phone number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get password strength color
 * @param {string} strength - Strength level
 * @returns {string} Color class
 */
export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'strong':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'weak':
    default:
      return 'text-red-600';
  }
};

/**
 * Get password strength bar width
 * @param {number} score - Password score
 * @returns {string} Width percentage
 */
export const getPasswordStrengthWidth = (score) => {
  const percentage = (score / 7) * 100;
  return `${Math.min(percentage, 100)}%`;
};

/**
 * Real-time form validation
 * @param {Object} formData - Form data to validate
 * @param {Array} fields - Fields to validate
 * @returns {Object} Validation results
 */
export const validateForm = (formData, fields) => {
  const errors = {};
  let isValid = true;

  fields.forEach((field) => {
    let result;

    switch (field) {
      case 'name':
        result = validateName(formData.name);
        break;
      case 'email':
        result = validateEmail(formData.email);
        break;
      case 'password':
        result = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        if (formData.password !== formData.confirmPassword) {
          result = {
            isValid: false,
            errors: ['Passwords do not match'],
          };
        } else {
          result = { isValid: true, errors: [] };
        }
        break;
      case 'otp':
        result = validateOTP(formData.otp);
        break;
      case 'phone':
        result = validatePhone(formData.phone);
        break;
      default:
        result = { isValid: true, errors: [] };
    }

    if (!result.isValid) {
      errors[field] = result.errors;
      isValid = false;
    }
  });

  return {
    isValid,
    errors,
  };
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validateOTP,
  validatePhone,
  validateForm,
  getPasswordStrengthColor,
  getPasswordStrengthWidth,
};
