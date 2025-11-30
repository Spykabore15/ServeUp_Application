const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating an order
 */
const createOrderValidator = [
  body('table_number')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),

  body('customer_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Customer name must not exceed 100 characters'),

  body('served_by')
    .optional()
    .isInt()
    .withMessage('Server ID must be an integer'),

  body('payment_method')
    .optional()
    .isIn(['cash', 'card', 'mobile'])
    .withMessage('Payment method must be one of: cash, card, mobile'),

  body('status')
    .optional()
    .isIn(['pending', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, completed, cancelled'),

  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),

  body('items.*.product_id')
    .isInt()
    .withMessage('Product ID must be an integer'),

  body('items.*.quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be a positive number'),

  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number')
];

/**
 * Validation rules for updating an order
 */
const updateOrderValidator = [
  param('id')
    .isInt()
    .withMessage('Order ID must be a valid integer'),

  body('table_number')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),

  body('customer_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Customer name must not exceed 100 characters'),

  body('served_by')
    .optional()
    .isInt()
    .withMessage('Server ID must be an integer'),

  body('payment_method')
    .optional()
    .isIn(['cash', 'card', 'mobile'])
    .withMessage('Payment method must be one of: cash, card, mobile'),

  body('status')
    .optional()
    .isIn(['pending', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, completed, cancelled')
];

/**
 * Validation rules for getting an order by ID
 */
const getOrderByIdValidator = [
  param('id')
    .isInt()
    .withMessage('Order ID must be a valid integer')
];

/**
 * Validation rules for deleting an order
 */
const deleteOrderValidator = [
  param('id')
    .isInt()
    .withMessage('Order ID must be a valid integer')
];

/**
 * Validation rules for order query parameters
 */
const orderQueryValidator = [
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
    .withMessage('Search query must not exceed 100 characters'),

  query('status')
    .optional()
    .isIn(['pending', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, completed, cancelled'),

  query('payment_method')
    .optional()
    .isIn(['cash', 'card', 'mobile'])
    .withMessage('Payment method must be one of: cash, card, mobile')
];

module.exports = {
  createOrderValidator,
  updateOrderValidator,
  getOrderByIdValidator,
  deleteOrderValidator,
  orderQueryValidator
};




