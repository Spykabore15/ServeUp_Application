/**
 * Rate Limiting Middleware
 * Protects against brute force attacks and DDoS
 */

const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../utils/constants');

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH_WINDOW_MS, // 15 minutes
  max: RATE_LIMIT.AUTH_MAX_REQUESTS, // 5 requests per window
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: Math.ceil(RATE_LIMIT.AUTH_WINDOW_MS / 1000 / 60) + ' minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT.AUTH_WINDOW_MS / 1000 / 60) + ' minutes'
    });
  }
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.GENERAL_WINDOW_MS, // 15 minutes
  max: RATE_LIMIT.GENERAL_MAX_REQUESTS, // 100 requests per window
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  authLimiter,
  apiLimiter
};

