/**
 * Report Controller
 * Handles generation of various analytics reports
 */

const { Order, Product, Employee, Supplier, Category, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get sales analytics
 * Provides revenue, order counts, and trends over time
 */
const getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Total revenue
    const totalRevenue = await Order.sum('total_amount', { where: dateFilter }) || 0;

    // Total orders
    const totalOrders = await Order.count({ where: dateFilter });

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily revenue trend
    // If date filter provided, use it; otherwise show last 30 days or all time if no recent orders
    let trendDateFilter = dateFilter;
    
    if (!startDate || !endDate) {
      // No date filter provided - check for recent orders
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentOrdersCount = await Order.count({
        where: {
          created_at: { [Op.gte]: thirtyDaysAgo }
        }
      });

      // If no recent orders, show all orders; otherwise show last 30 days
      trendDateFilter = recentOrdersCount > 0 
        ? { created_at: { [Op.gte]: thirtyDaysAgo } }
        : {}; // Empty filter = all orders
    }

    const dailyRevenue = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount']
      ],
      where: trendDateFilter,
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // Format daily revenue data
    const revenueData = dailyRevenue.map(item => ({
      date: item.date,
      revenue: parseFloat(item.revenue || 0).toFixed(2),
      orderCount: parseInt(item.orderCount || 0)
    }));

    res.json({
      success: true,
      data: {
        totalRevenue: parseFloat(totalRevenue).toFixed(2),
        totalOrders,
        avgOrderValue: parseFloat(avgOrderValue).toFixed(2),
        revenueData
      }
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales analytics',
      error: error.message
    });
  }
};

/**
 * Get inventory analytics
 * Provides stock levels, categories, and supplier distribution
 */
const getInventoryAnalytics = async (req, res) => {
  try {
    // Total products
    const totalProducts = await Product.count();

    // Stock status breakdown
    const products = await Product.findAll({
      attributes: ['quantity', 'threshold']
    });

    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach(product => {
      if (product.quantity === 0) {
        outOfStock++;
      } else if (product.quantity <= product.threshold) {
        lowStock++;
      } else {
        inStock++;
      }
    });

    // Products by category
    const productsByCategory = await Product.findAll({
      attributes: [
        'category_id',
        [sequelize.fn('COUNT', sequelize.col('Product.id')), 'count']
      ],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['name']
      }],
      group: ['category_id', 'category.id'],
      raw: false
    });

    const categoryData = productsByCategory.map(item => ({
      category: item.category?.name || 'Uncategorized',
      count: parseInt(item.dataValues.count || 0)
    }));

    // Products by supplier
    const productsBySupplier = await Product.findAll({
      attributes: [
        'supplier_id',
        [sequelize.fn('COUNT', sequelize.col('Product.id')), 'count']
      ],
      include: [{
        model: Supplier,
        as: 'supplier',
        attributes: ['name']
      }],
      where: {
        supplier_id: { [Op.ne]: null }
      },
      group: ['supplier_id', 'supplier.id'],
      raw: false
    });

    const supplierData = productsBySupplier.map(item => ({
      supplier: item.supplier?.name || 'Unknown',
      count: parseInt(item.dataValues.count || 0)
    }));

    // Total inventory value
    const inventoryValue = await Product.sum('price_per_unit', {
      where: { price_per_unit: { [Op.ne]: null } }
    }) || 0;

    res.json({
      success: true,
      data: {
        totalProducts,
        inStock,
        lowStock,
        outOfStock,
        categoryData,
        supplierData,
        inventoryValue: parseFloat(inventoryValue).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching inventory analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory analytics',
      error: error.message
    });
  }
};

/**
 * Get employee analytics
 * Provides employee distribution by position and status
 */
const getEmployeeAnalytics = async (req, res) => {
  try {
    // Total employees
    const totalEmployees = await Employee.count();

    // Employees by status
    const activeEmployees = await Employee.count({ where: { status: 'active' } });
    const inactiveEmployees = await Employee.count({ where: { status: 'inactive' } });
    const onLeaveEmployees = await Employee.count({ where: { status: 'on_leave' } });

    // Employees by position
    const employeesByPosition = await Employee.findAll({
      attributes: [
        'position',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['position'],
      raw: true
    });

    const positionData = employeesByPosition.map(item => ({
      position: item.position || 'Unknown',
      count: parseInt(item.count || 0)
    }));

    // Average salary (if applicable) - using Sequelize aggregation
    const salaryResult = await Employee.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('salary')), 'avgSalary']
      ],
      where: { salary: { [Op.ne]: null } },
      raw: true
    });
    const avgSalary = salaryResult ? parseFloat(salaryResult.avgSalary || 0) : 0;

    res.json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        onLeaveEmployees,
        positionData,
        avgSalary: parseFloat(avgSalary).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching employee analytics:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get supplier analytics
 * Provides supplier ratings and product distribution
 */
const getSupplierAnalytics = async (req, res) => {
  try {
    // Total suppliers
    const totalSuppliers = await Supplier.count();

    // Active vs inactive suppliers
    const activeSuppliers = await Supplier.count({ where: { is_active: true } });
    const inactiveSuppliers = totalSuppliers - activeSuppliers;

    // Suppliers by rating
    const suppliersByRating = await Supplier.findAll({
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { rating: { [Op.ne]: null } },
      group: ['rating'],
      order: [['rating', 'DESC']],
      raw: true
    });

    const ratingData = suppliersByRating.map(item => ({
      rating: item.rating || 0,
      count: parseInt(item.count || 0)
    }));

    // Top suppliers by product count
    const topSuppliers = await Product.findAll({
      attributes: [
        'supplier_id',
        [sequelize.fn('COUNT', sequelize.col('Product.id')), 'productCount']
      ],
      include: [{
        model: Supplier,
        as: 'supplier',
        attributes: ['name'],
        required: false
      }],
      where: {
        supplier_id: { [Op.ne]: null }
      },
      group: ['supplier_id', 'supplier.id', 'supplier.name'],
      order: [[sequelize.fn('COUNT', sequelize.col('Product.id')), 'DESC']],
      limit: 10,
      raw: false
    });

    const topSupplierData = topSuppliers.map(item => {
      // Handle both Sequelize instance and raw data
      const productCount = item.dataValues?.productCount 
        ? parseInt(item.dataValues.productCount) 
        : (item.productCount ? parseInt(item.productCount) : 0);
      
      return {
        supplier: item.supplier?.name || 'Unknown',
        productCount: productCount
      };
    });

    res.json({
      success: true,
      data: {
        totalSuppliers,
        activeSuppliers,
        inactiveSuppliers,
        ratingData,
        topSuppliers: topSupplierData
      }
    });
  } catch (error) {
    console.error('Error fetching supplier analytics:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supplier analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getSalesAnalytics,
  getInventoryAnalytics,
  getEmployeeAnalytics,
  getSupplierAnalytics
};






