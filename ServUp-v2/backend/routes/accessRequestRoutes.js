const express = require('express');
const router = express.Router();
const accessRequestController = require('../controllers/accessRequestController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public route - anyone can create an access request
router.post('/', accessRequestController.createAccessRequest);

// Protected routes - only admins can view and manage requests
router.get('/', authMiddleware, roleMiddleware(['admin']), accessRequestController.getAccessRequests);
router.get('/pending/count', authMiddleware, roleMiddleware(['admin']), accessRequestController.getPendingRequestsCount);
router.put('/:id/approve', authMiddleware, roleMiddleware(['admin']), accessRequestController.approveAccessRequest);
router.put('/:id/deny', authMiddleware, roleMiddleware(['admin']), accessRequestController.denyAccessRequest);

module.exports = router;

