const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  toggleUserStatus
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createUserValidator,
  updateUserValidator,
  getUserByIdValidator,
  deleteUserValidator,
  userQueryValidator,
  toggleUserStatusValidator
} = require('../validators/userValidators');
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
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private (Admin only)
 */
router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(['admin']),
  getUserStats
);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination and filters
 * @access  Private (Admin only)
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  userQueryValidator,
  handleValidationErrors,
  getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin only)
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  getUserByIdValidator,
  handleValidationErrors,
  getUserById
);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  createUserValidator,
  handleValidationErrors,
  createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  updateUserValidator,
  handleValidationErrors,
  updateUser
);

/**
 * @route   PATCH /api/users/:id/toggle-status
 * @desc    Toggle user active status
 * @access  Private (Admin only)
 */
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  roleMiddleware(['admin']),
  toggleUserStatusValidator,
  handleValidationErrors,
  toggleUserStatus
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  deleteUserValidator,
  handleValidationErrors,
  deleteUser
);

module.exports = router;


