import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200, // Increased to 200 requests
  message: 'Please wait a moment before trying again.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Please wait a moment before trying again.'
    });
  }
});

// Strict rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Allow 50 attempts per 15 minutes (more reasonable)
  message: {
    success: false,
    message: 'Please wait a few minutes before trying again.',
    error: 'Please wait a few minutes before trying again.'
  },
  skipSuccessfulRequests: true, // Only count failed requests
  skipFailedRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
  // Custom handler for rate limit errors
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Please wait a moment before trying again.'
    });
  }
});

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Allow 5 password reset requests per hour
  message: 'Please wait before requesting another password reset.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Please wait an hour before requesting another password reset.'
    });
  }
});

// Rate limiter for creating resources
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Allow 20 create requests per minute
  message: 'Please slow down a bit.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Please slow down and try again in a moment.'
    });
  }
});

export default apiLimiter;
