const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating a user
 */
const createUserValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['admin', 'responsable_stocks', 'responsable_employes', 'employe'])
    .withMessage('Invalid role'),

  body('employee_id')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      // Allow null, undefined, or empty string
      if (value === null || value === undefined || value === '') {
        return true;
      }
      // If provided, must be a valid integer
      if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
        throw new Error('Employee ID must be a valid positive integer');
      }
      return true;
    }),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
];

/**
 * Validation rules for updating a user
 */
const updateUserValidator = [
  param('id')
    .isInt()
    .withMessage('User ID must be a valid integer'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(['admin', 'responsable_stocks', 'responsable_employes', 'employe'])
    .withMessage('Invalid role'),

  body('employee_id')
    .optional({ nullable: true })
    .custom((value) => {
      if (value !== null && !Number.isInteger(Number(value))) {
        throw new Error('Employee ID must be a valid integer or null');
      }
      return true;
    }),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
];

/**
 * Validation rules for getting a user by ID
 */
const getUserByIdValidator = [
  param('id')
    .isInt()
    .withMessage('User ID must be a valid integer')
];

/**
 * Validation rules for deleting a user
 */
const deleteUserValidator = [
  param('id')
    .isInt()
    .withMessage('User ID must be a valid integer')
];

/**
 * Validation rules for user query parameters
 */
const userQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Limit must be between 1 and 1000'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query must not exceed 100 characters'),

  query('role')
    .optional()
    .isIn(['admin', 'responsable_stocks', 'responsable_employes', 'user'])
    .withMessage('Invalid role'),

  query('is_active')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('is_active must be true or false')
];

/**
 * Validation rules for toggling user status
 */
const toggleUserStatusValidator = [
  param('id')
    .isInt()
    .withMessage('User ID must be a valid integer')
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  getUserByIdValidator,
  deleteUserValidator,
  userQueryValidator,
  toggleUserStatusValidator
};


