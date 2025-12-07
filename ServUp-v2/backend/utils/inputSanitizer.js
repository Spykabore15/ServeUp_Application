/**
 * Input Sanitization Utilities
 * Prevents XSS and injection attacks
 */

const xss = require('xss');

// Configure XSS filter
const xssOptions = {
  whiteList: {}, // Empty whitelist means all tags are removed
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
  allowList: {}
};

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  return xss(input, xssOptions);
};

/**
 * Sanitize object recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Sanitize request body middleware
 */
const sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  next();
};

module.exports = {
  sanitizeString,
  sanitizeObject,
  sanitizeRequestBody
};

