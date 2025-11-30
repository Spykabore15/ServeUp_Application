const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createEmployeeValidator,
  updateEmployeeValidator,
  getEmployeeByIdValidator,
  deleteEmployeeValidator,
  employeeQueryValidator
} = require('../validators/employeeValidators');
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
 * @route   GET /api/employees/stats
 * @desc    Get employee statistics
 * @access  Private (Admin, HR Manager)
 */
router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_employes']),
  getEmployeeStats
);

/**
 * @route   GET /api/employees
 * @desc    Get all employees with pagination and filters
 * @access  Private (Admin, HR Manager)
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_employes']),
  employeeQueryValidator,
  handleValidationErrors,
  getAllEmployees
);

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID
 * @access  Private (Admin, HR Manager)
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_employes']),
  getEmployeeByIdValidator,
  handleValidationErrors,
  getEmployeeById
);

/**
 * @route   POST /api/employees
 * @desc    Create a new employee
 * @access  Private (Admin, HR Manager)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_employes']),
  createEmployeeValidator,
  handleValidationErrors,
  createEmployee
);

/**
 * @route   PUT /api/employees/:id
 * @desc    Update an employee
 * @access  Private (Admin, HR Manager)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_employes']),
  updateEmployeeValidator,
  handleValidationErrors,
  updateEmployee
);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete an employee
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  deleteEmployeeValidator,
  handleValidationErrors,
  deleteEmployee
);

module.exports = router;

