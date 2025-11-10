import crypto from 'crypto';

/**
 * Generate a 6-digit OTP code
 * @returns {string} 6-digit OTP code
 */
export const generateOTP = () => {
  // Generate random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a secure random token for temp user ID
 * @returns {string} Random token
 */
export const generateTempUserId = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash OTP code for storage
 * @param {string} code - OTP code to hash
 * @returns {string} Hashed code
 */
export const hashOTP = (code) => {
  return crypto.createHash('sha256').update(code).digest('hex');
};

/**
 * Verify OTP code
 * @param {string} enteredCode - Code entered by user
 * @param {string} storedHashedCode - Hashed code stored in database
 * @returns {boolean} True if codes match
 */
export const verifyOTP = (enteredCode, storedHashedCode) => {
  const hashedEnteredCode = hashOTP(enteredCode);
  return hashedEnteredCode === storedHashedCode;
};

/**
 * Get OTP expiry time (10 minutes from now)
 * @returns {Date} Expiry date
 */
export const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};
