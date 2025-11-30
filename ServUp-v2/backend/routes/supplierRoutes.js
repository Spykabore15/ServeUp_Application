const express = require('express');
const router = express.Router();
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierStats
} = require('../controllers/supplierController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createSupplierValidator,
  updateSupplierValidator,
  getSupplierByIdValidator,
  deleteSupplierValidator,
  supplierQueryValidator
} = require('../validators/supplierValidators');
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
 * @route   GET /api/suppliers/stats
 * @desc    Get supplier statistics
 * @access  Private (Admin, Stock Manager)
 */
router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_stocks']),
  getSupplierStats
);

/**
 * @route   GET /api/suppliers
 * @desc    Get all suppliers with pagination and filters
 * @access  Private (Admin, Stock Manager)
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_stocks']),
  supplierQueryValidator,
  handleValidationErrors,
  getAllSuppliers
);

/**
 * @route   GET /api/suppliers/:id
 * @desc    Get supplier by ID
 * @access  Private (Admin, Stock Manager)
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_stocks']),
  getSupplierByIdValidator,
  handleValidationErrors,
  getSupplierById
);

/**
 * @route   POST /api/suppliers
 * @desc    Create a new supplier
 * @access  Private (Admin, Stock Manager)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_stocks']),
  createSupplierValidator,
  handleValidationErrors,
  createSupplier
);

/**
 * @route   PUT /api/suppliers/:id
 * @desc    Update a supplier
 * @access  Private (Admin, Stock Manager)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_stocks']),
  updateSupplierValidator,
  handleValidationErrors,
  updateSupplier
);

/**
 * @route   DELETE /api/suppliers/:id
 * @desc    Delete a supplier
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  deleteSupplierValidator,
  handleValidationErrors,
  deleteSupplier
);

module.exports = router;




