const { body, param, query, validationResult } = require('express-validator');

// Custom validator for optional integer that accepts null
const optionalInt = (fieldName, errorMessage) => {
  return body(fieldName)
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === '' || value === undefined) return true;
      if (!Number.isInteger(Number(value)) || Number(value) < 0) {
        throw new Error(errorMessage);
      }
      return true;
    });
};

// Custom validator for optional float that accepts null
const optionalFloat = (fieldName, errorMessage, min = 0) => {
  return body(fieldName)
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === '' || value === undefined) return true;
      const num = Number(value);
      if (isNaN(num) || num < min) {
        throw new Error(errorMessage);
      }
      return true;
    });
};

// Validation rules for creating product
const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Product name must be between 2 and 150 characters'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  optionalInt('category_id', 'Category ID must be a valid integer'),

  optionalFloat('quantity', 'Quantity must be a positive number'),

  body('unit')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Unit must not exceed 20 characters'),

  optionalFloat('threshold', 'Threshold must be a positive number'),

  optionalFloat('price_per_unit', 'Price must be a positive number'),

  optionalInt('supplier_id', 'Supplier ID must be a valid integer'),

  body('expiration_date')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === '' || value === undefined) return true;
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Expiration date must be a valid date');
      }
      return true;
    }),

  body('sku')
    .optional({ nullable: true })
    .trim()
    .custom((value) => {
      if (value === null || value === '' || value === undefined) return true;
      if (value.length > 50) {
        throw new Error('SKU must not exceed 50 characters');
      }
      if (!/^[A-Z0-9-_]+$/i.test(value)) {
        throw new Error('SKU can only contain letters, numbers, hyphens, and underscores');
      }
      return true;
    })
];

// Validation rules for updating product
const updateProductValidation = [
  param('id')
    .isInt()
    .withMessage('Product ID must be a valid integer'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Product name must be between 2 and 150 characters'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  optionalInt('category_id', 'Category ID must be a valid integer'),

  optionalFloat('quantity', 'Quantity must be a positive number'),

  body('unit')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Unit must not exceed 20 characters'),

  optionalFloat('threshold', 'Threshold must be a positive number'),

  optionalFloat('price_per_unit', 'Price must be a positive number'),

  optionalInt('supplier_id', 'Supplier ID must be a valid integer'),

  body('expiration_date')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === '' || value === undefined) return true;
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Expiration date must be a valid date');
      }
      return true;
    }),

  body('sku')
    .optional({ nullable: true })
    .trim()
    .custom((value) => {
      if (value === null || value === '' || value === undefined) return true;
      if (value.length > 50) {
        throw new Error('SKU must not exceed 50 characters');
      }
      if (!/^[A-Z0-9-_]+$/i.test(value)) {
        throw new Error('SKU can only contain letters, numbers, hyphens, and underscores');
      }
      return true;
    }),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value')
];

// Validation for product ID parameter
const productIdValidation = [
  param('id')
    .isInt()
    .withMessage('Product ID must be a valid integer')
];

// Validation for query parameters
const productQueryValidation = [
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

  query('category_id')
    .optional()
    .isInt()
    .withMessage('Category ID must be a valid integer'),

  query('supplier_id')
    .optional()
    .isInt()
    .withMessage('Supplier ID must be a valid integer'),

  query('low_stock')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('low_stock must be true or false')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }

  next();
};

module.exports = {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  productQueryValidation,
  handleValidationErrors
};
