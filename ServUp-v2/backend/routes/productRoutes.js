const express = require('express');
const router = express.Router();

// Controllers
const productController = require('../controllers/productController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Validators
const {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  productQueryValidation,
  handleValidationErrors
} = require('../validators/productValidators');

// Roles that can manage products
const canManageProducts = ['admin', 'responsable_stocks'];

// Public/Protected routes (all authenticated users can view)
router.get(
  '/',
  authMiddleware,
  productQueryValidation,
  handleValidationErrors,
  productController.getAllProducts
);

router.get(
  '/low-stock',
  authMiddleware,
  productController.getLowStockProducts
);

router.get(
  '/:id',
  authMiddleware,
  productIdValidation,
  handleValidationErrors,
  productController.getProductById
);

// Protected routes (only admin and stock managers)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(canManageProducts),
  createProductValidation,
  handleValidationErrors,
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(canManageProducts),
  updateProductValidation,
  handleValidationErrors,
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(canManageProducts),
  productIdValidation,
  handleValidationErrors,
  productController.deleteProduct
);

module.exports = router;

