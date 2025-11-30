const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

// Validators
const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  handleValidationErrors
} = require('../validators/authValidators');

// Public routes
router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  authController.login
);

// Protected routes (require authentication)
router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, authController.getCurrentUser);

router.put(
  '/change-password',
  authMiddleware,
  changePasswordValidation,
  handleValidationErrors,
  authController.changePassword
);

module.exports = router;

