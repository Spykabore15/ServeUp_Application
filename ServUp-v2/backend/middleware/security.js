/**
 * Security Middleware
 * Adds security headers and protections
 */

const helmet = require('helmet');

// Configure helmet with appropriate security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  crossOriginEmbedderPolicy: false, // Disable if causing issues with API
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Request ID middleware for tracing
const { v4: uuidv4 } = require('uuid');
const requestIdMiddleware = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

module.exports = {
  securityHeaders,
  requestIdMiddleware
};

