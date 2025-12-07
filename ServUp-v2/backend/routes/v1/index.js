/**
 * API v1 Routes
 * Centralized route definitions for API version 1
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('../../routes/authRoutes');
const productRoutes = require('../../routes/productRoutes');
const categoryRoutes = require('../../routes/categoryRoutes');
const employeeRoutes = require('../../routes/employeeRoutes');
const orderRoutes = require('../../routes/orderRoutes');
const supplierRoutes = require('../../routes/supplierRoutes');
const userRoutes = require('../../routes/userRoutes');
const reportRoutes = require('../../routes/reportRoutes');
const dashboardRoutes = require('../../routes/dashboardRoutes');
const accessRequestRoutes = require('../../routes/accessRequestRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/employees', employeeRoutes);
router.use('/orders', orderRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/access-requests', accessRequestRoutes);

module.exports = router;

