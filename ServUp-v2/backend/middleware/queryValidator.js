/**
 * Query Parameter Validation Middleware
 * Validates common query parameters across endpoints
 */

const { query, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/responseHandler');

/**
 * Validate common query parameters
 */
const validateCommonQueries = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
  
  query('sort')
    .optional()
    .isIn(['asc', 'desc', 'ASC', 'DESC'])
    .withMessage('Sort must be either "asc" or "desc"'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array().map(err => ({
        field: err.path,
        message: err.msg
      })));
    }
    
    next();
  }
];

/**
 * Validate ID parameter
 */
const validateId = [
  (req, res, next) => {
    const id = req.params.id;
    
    if (!id || isNaN(parseInt(id)) || parseInt(id) < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid ID parameter'
      });
    }
    
    req.params.id = parseInt(id);
    next();
  }
];

/**
 * Validate date range queries
 */
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (req.query.startDate && value && new Date(value) < new Date(req.query.startDate)) {
        throw new Error('endDate must be after startDate');
      }
      return true;
    }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array().map(err => ({
        field: err.path,
        message: err.msg
      })));
    }
    
    next();
  }
];

module.exports = {
  validateCommonQueries,
  validateId,
  validateDateRange
};

