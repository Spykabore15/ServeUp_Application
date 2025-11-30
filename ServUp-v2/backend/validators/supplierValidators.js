const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating a supplier
 */
const createSupplierValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Supplier name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Supplier name must be between 2 and 100 characters'),

  body('contact_person')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Contact person name must not exceed 100 characters'),

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

  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

/**
 * Validation rules for updating a supplier
 */
const updateSupplierValidator = [
  param('id')
    .isInt()
    .withMessage('Supplier ID must be a valid integer'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Supplier name must be between 2 and 100 characters'),

  body('contact_person')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Contact person name must not exceed 100 characters'),

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

  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

/**
 * Validation rules for getting a supplier by ID
 */
const getSupplierByIdValidator = [
  param('id')
    .isInt()
    .withMessage('Supplier ID must be a valid integer')
];

/**
 * Validation rules for deleting a supplier
 */
const deleteSupplierValidator = [
  param('id')
    .isInt()
    .withMessage('Supplier ID must be a valid integer')
];

/**
 * Validation rules for supplier query parameters
 */
const supplierQueryValidator = [
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
    .withMessage('Search query must not exceed 100 characters')
];

module.exports = {
  createSupplierValidator,
  updateSupplierValidator,
  getSupplierByIdValidator,
  deleteSupplierValidator,
  supplierQueryValidator
};




