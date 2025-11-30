const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createOrderValidator,
  updateOrderValidator,
  getOrderByIdValidator,
  deleteOrderValidator,
  orderQueryValidator
} = require('../validators/orderValidators');
const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 * @access  Private (All authenticated users)
 */
router.get(
  '/stats',
  authMiddleware,
  getOrderStats
);

/**
 * @route   GET /api/orders
 * @desc    Get all orders with pagination and filters
 * @access  Private (All authenticated users)
 */
router.get(
  '/',
  authMiddleware,
  orderQueryValidator,
  handleValidationErrors,
  getAllOrders
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private (All authenticated users)
 */
router.get(
  '/:id',
  authMiddleware,
  getOrderByIdValidator,
  handleValidationErrors,
  getOrderById
);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private (All authenticated users)
 */
router.post(
  '/',
  authMiddleware,
  createOrderValidator,
  handleValidationErrors,
  createOrder
);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update an order
 * @access  Private (All authenticated users)
 */
router.put(
  '/:id',
  authMiddleware,
  updateOrderValidator,
  handleValidationErrors,
  updateOrder
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an order
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  deleteOrderValidator,
  handleValidationErrors,
  deleteOrder
);

module.exports = router;




