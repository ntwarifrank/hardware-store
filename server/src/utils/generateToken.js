import jwt from 'jsonwebtoken';

/**
 * Generate JWT access token
 * @param {string} userId - User ID
 * @param {string} role - User role (admin, user, etc.)
 * @returns {string} JWT token
 */
export const generateAccessToken = (userId, role = 'user') => {
  // Admin tokens expire in 15 minutes for security
  const expiresIn = role === 'admin' 
    ? process.env.JWT_ADMIN_EXPIRE || '15m'
    : process.env.JWT_ACCESS_EXPIRE || '7d';

  return jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn }
  );
};

/**
 * Generate JWT refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * Generate both access and refresh tokens
 * @param {string} userId - User ID
 * @param {string} role - User role (admin, user, etc.)
 * @returns {Object} Object containing both tokens
 */
export const generateTokens = (userId, role = 'user') => {
  return {
    accessToken: generateAccessToken(userId, role),
    refreshToken: generateRefreshToken(userId),
  };
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
