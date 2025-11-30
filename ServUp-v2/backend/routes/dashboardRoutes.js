const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboardStats, getRecentActivity } = require('../controllers/dashboardController');

// All dashboard routes require authentication
router.use(authMiddleware);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get recent activity
router.get('/activity', getRecentActivity);

module.exports = router;

