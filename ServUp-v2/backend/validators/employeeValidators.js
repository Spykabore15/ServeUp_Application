const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating an employee
 */
const createEmployeeValidator = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Phone number must contain only numbers and valid characters'),

  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),

  body('hire_date')
    .notEmpty()
    .withMessage('Hire date is required')
    .isISO8601()
    .withMessage('Hire date must be a valid date'),

  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'on_leave'])
    .withMessage('Status must be one of: active, inactive, on_leave'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),

  body('emergency_contact')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Emergency contact must not exceed 255 characters')
];

/**
 * Validation rules for updating an employee
 */
const updateEmployeeValidator = [
  param('id')
    .isInt()
    .withMessage('Employee ID must be a valid integer'),

  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Phone number must contain only numbers and valid characters'),

  body('position')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),

  body('hire_date')
    .optional()
    .isISO8601()
    .withMessage('Hire date must be a valid date'),

  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'on_leave'])
    .withMessage('Status must be one of: active, inactive, on_leave'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),

  body('emergency_contact')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Emergency contact must not exceed 255 characters')
];

/**
 * Validation rules for getting an employee by ID
 */
const getEmployeeByIdValidator = [
  param('id')
    .isInt()
    .withMessage('Employee ID must be a valid integer')
];

/**
 * Validation rules for deleting an employee
 */
const deleteEmployeeValidator = [
  param('id')
    .isInt()
    .withMessage('Employee ID must be a valid integer')
];

/**
 * Validation rules for employee query parameters
 */
const employeeQueryValidator = [
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

  query('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position filter must not exceed 100 characters'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'on_leave'])
    .withMessage('Status must be one of: active, inactive, on_leave')
];

module.exports = {
  createEmployeeValidator,
  updateEmployeeValidator,
  getEmployeeByIdValidator,
  deleteEmployeeValidator,
  employeeQueryValidator
};

