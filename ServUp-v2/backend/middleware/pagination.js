/**
 * Pagination Middleware
 * Validates and sanitizes pagination query parameters
 */

const { query, validationResult } = require('express-validator');
const { PAGINATION } = require('../utils/constants');
const { sendValidationError } = require('../utils/responseHandler');

// Validation rules for pagination
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: PAGINATION.MAX_LIMIT })
    .withMessage(`Limit must be between 1 and ${PAGINATION.MAX_LIMIT}`)
    .toInt()
];

// Middleware to validate and apply pagination
const validatePagination = [
  ...paginationValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array().map(err => ({
        field: err.path,
        message: err.msg
      })));
    }
    
    // Set defaults if not provided
    req.query.page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
    req.query.limit = Math.min(
      parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );
    req.query.offset = (req.query.page - 1) * req.query.limit;
    
    next();
  }
];

// Helper function to format pagination response
const formatPaginationResponse = (count, page, limit) => {
  return {
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(count / limit),
    hasNextPage: page * limit < count,
    hasPreviousPage: page > 1
  };
};

module.exports = {
  validatePagination,
  formatPaginationResponse,
  paginationValidation
};

