/**
 * Payment Utility Functions
 * Common helper functions for payment processing
 */

/**
 * Validate Rwanda phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const validateRwandaPhoneNumber = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Rwanda phone numbers: 078, 073, 072 followed by 7 digits
  const rwandaPattern = /^(\+?250|0)?7[238]\d{7}$/;
  return rwandaPattern.test(cleaned);
};

/**
 * Format Rwanda phone number to international format
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number (250XXXXXXXXX)
 */
export const formatRwandaPhoneNumber = (phone) => {
  if (!phone) return '';
  
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('+250')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith('250')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  return `250${cleaned}`;
};

/**
 * Mask phone number for secure logging
 * @param {string} phone - Phone number
 * @returns {string} - Masked phone number
 */
export const maskPhoneNumber = (phone) => {
  if (!phone || phone.length < 8) return '***';
  return phone.substring(0, 6) + 'XXX' + phone.substring(phone.length - 2);
};

/**
 * Generate unique transaction ID
 * @param {string} orderId - Order ID
 * @param {string} provider - Payment provider (mtn/airtel)
 * @returns {string} - Unique transaction ID
 */
export const generateTransactionId = (orderId, provider = 'payment') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BLDMRT-${provider.toUpperCase()}-${timestamp}-${orderId}-${random}`;
};

/**
 * Calculate exponential backoff delay
 * @param {number} retryCount - Current retry attempt
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {number} - Delay in milliseconds
 */
export const calculateBackoffDelay = (retryCount, baseDelay = 1000) => {
  return Math.min(Math.pow(2, retryCount) * baseDelay, 30000); // Max 30 seconds
};

/**
 * Check if error is retryable
 * @param {Error} error - Error object
 * @returns {boolean} - True if error is retryable
 */
export const isRetryableError = (error) => {
  // Network errors
  if (!error.response) return true;
  
  // Server errors (5xx)
  if (error.response.status >= 500) return true;
  
  // Rate limiting (429)
  if (error.response.status === 429) return true;
  
  // Gateway timeout (504)
  if (error.response.status === 504) return true;
  
  return false;
};

/**
 * Validate payment amount
 * @param {number} amount - Amount to validate
 * @param {number} minAmount - Minimum allowed amount
 * @param {number} maxAmount - Maximum allowed amount
 * @returns {Object} - Validation result
 */
export const validatePaymentAmount = (amount, minAmount = 100, maxAmount = 10000000) => {
  if (!amount || isNaN(amount)) {
    return { valid: false, error: 'Invalid amount' };
  }
  
  if (amount < minAmount) {
    return { valid: false, error: `Amount must be at least ${minAmount} RWF` };
  }
  
  if (amount > maxAmount) {
    return { valid: false, error: `Amount cannot exceed ${maxAmount} RWF` };
  }
  
  return { valid: true };
};

/**
 * Map payment status to standard format
 * @param {string} status - Provider-specific status
 * @param {string} provider - Payment provider
 * @returns {string} - Standard status (PENDING, COMPLETED, FAILED)
 */
export const mapPaymentStatus = (status, provider) => {
  const statusMap = {
    mtn: {
      'PENDING': 'PENDING',
      'SUCCESSFUL': 'COMPLETED',
      'FAILED': 'FAILED',
    },
    airtel: {
      'TP': 'PENDING', // Transaction Pending
      'TS': 'COMPLETED', // Transaction Successful
      'TF': 'FAILED', // Transaction Failed
      'TIP': 'PENDING', // Transaction In Progress
    }
  };
  
  return statusMap[provider]?.[status] || status;
};

/**
 * Check if payment has expired
 * @param {Date} createdAt - Payment creation time
 * @param {number} timeoutMinutes - Timeout in minutes
 * @returns {boolean} - True if expired
 */
export const isPaymentExpired = (createdAt, timeoutMinutes = 3) => {
  const expiryTime = new Date(createdAt).getTime() + (timeoutMinutes * 60 * 1000);
  return Date.now() > expiryTime;
};

/**
 * Sanitize error message for user display
 * @param {string} errorMessage - Raw error message
 * @returns {string} - User-friendly error message
 */
export const sanitizeErrorMessage = (errorMessage) => {
  const errorMap = {
    'insufficient funds': 'Insufficient funds in your mobile money account',
    'invalid msisdn': 'Invalid phone number',
    'timeout': 'Payment request timed out. Please try again.',
    'not authorized': 'Payment authorization failed',
    'transaction not found': 'Transaction not found',
    'duplicate transaction': 'Duplicate payment request detected',
  };
  
  const lowerMessage = errorMessage.toLowerCase();
  
  for (const [key, value] of Object.entries(errorMap)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }
  
  return 'Payment processing failed. Please try again or contact support.';
};

/**
 * Get provider-specific error details
 * @param {Object} error - Error object
 * @returns {Object} - Structured error details
 */
export const getPaymentErrorDetails = (error) => {
  return {
    message: error.response?.data?.message || error.message || 'Unknown error',
    code: error.response?.data?.code || error.code,
    statusCode: error.response?.status,
    timestamp: new Date().toISOString(),
    retryable: isRetryableError(error),
  };
};

/**
 * Calculate payment timeout
 * @param {number} timeoutMinutes - Timeout in minutes
 * @returns {Object} - Timeout details
 */
export const calculatePaymentTimeout = (timeoutMinutes = 3) => {
  const now = Date.now();
  const expiresAt = now + (timeoutMinutes * 60 * 1000);
  
  return {
    expiresAt,
    expiresIn: timeoutMinutes * 60, // in seconds
    maxPollingAttempts: Math.floor((timeoutMinutes * 60) / 5), // Check every 5 seconds
  };
};

export default {
  validateRwandaPhoneNumber,
  formatRwandaPhoneNumber,
  maskPhoneNumber,
  generateTransactionId,
  calculateBackoffDelay,
  isRetryableError,
  validatePaymentAmount,
  mapPaymentStatus,
  isPaymentExpired,
  sanitizeErrorMessage,
  getPaymentErrorDetails,
  calculatePaymentTimeout,
};
