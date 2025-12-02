/**
 * Report Routes
 * API endpoints for analytics and reporting
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All report routes require authentication
router.use(authMiddleware);

// Sales Analytics (Admin, Stock Manager)
router.get('/sales', 
  roleMiddleware(['admin', 'responsable_stocks']), 
  reportController.getSalesAnalytics
);

// Inventory Analytics (Admin, Stock Manager)
router.get('/inventory', 
  roleMiddleware(['admin', 'responsable_stocks']), 
  reportController.getInventoryAnalytics
);

// Employee Analytics (Admin, HR Manager)
router.get('/employees', 
  roleMiddleware(['admin', 'responsable_employes']), 
  reportController.getEmployeeAnalytics
);

// Supplier Analytics (Admin, Stock Manager)
router.get('/suppliers', 
  roleMiddleware(['admin', 'responsable_stocks']), 
  reportController.getSupplierAnalytics
);

module.exports = router;






