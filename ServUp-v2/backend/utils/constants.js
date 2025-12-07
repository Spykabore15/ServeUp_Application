/**
 * Application Constants
 * Centralized constants to avoid magic numbers and strings throughout the codebase
 */

// Password requirements
const PASSWORD = {
  MIN_LENGTH: 12,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true
};

// Bcrypt configuration
const BCRYPT = {
  SALT_ROUNDS: 10
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// User roles
const ROLES = {
  ADMIN: 'admin',
  STOCK_MANAGER: 'responsable_stocks',
  EMPLOYEE_MANAGER: 'responsable_employes',
  EMPLOYEE: 'employe'
};

// Rate limiting
const RATE_LIMIT = {
  AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  AUTH_MAX_REQUESTS: 5, // 5 requests per window
  GENERAL_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  GENERAL_MAX_REQUESTS: 100 // 100 requests per window
};

// JWT token expiration
const JWT = {
  ACCESS_TOKEN_EXPIRES_IN: '15m', // Shorter access token
  REFRESH_TOKEN_EXPIRES_IN: '7d' // Longer refresh token (future use)
};

// Database pool configuration
const DB_POOL = {
  DEVELOPMENT: {
    max: 5,
    min: 2,
    acquire: 30000,
    idle: 10000
  },
  PRODUCTION: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000,
    evict: 1000
  }
};

// Response messages
const MESSAGES = {
  ERROR: {
    UNAUTHORIZED: 'Unauthorized. Please login.',
    FORBIDDEN: 'Access denied. Insufficient permissions.',
    NOT_FOUND: 'Resource not found.',
    VALIDATION_FAILED: 'Validation failed.',
    INTERNAL_ERROR: 'An internal error occurred. Please try again later.',
    INVALID_CREDENTIALS: 'Invalid credentials.',
    TOKEN_EXPIRED: 'Token expired. Please login again.',
    TOKEN_INVALID: 'Invalid token. Please login again.'
  },
  SUCCESS: {
    CREATED: 'Resource created successfully.',
    UPDATED: 'Resource updated successfully.',
    DELETED: 'Resource deleted successfully.',
    LOGIN: 'Login successful.',
    LOGOUT: 'Logout successful.',
    REGISTERED: 'Registration successful.'
  }
};

module.exports = {
  PASSWORD,
  BCRYPT,
  PAGINATION,
  ROLES,
  RATE_LIMIT,
  JWT,
  DB_POOL,
  MESSAGES
};

