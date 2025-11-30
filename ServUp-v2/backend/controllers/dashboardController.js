const { User, Employee, Product, Order, Supplier, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get current date and date 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Fetch all statistics in parallel
    const [
      totalProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalEmployees,
      activeEmployees,
      totalSuppliers,
      recentOrders,
      lowStockItems,
      monthlyOrderStats
    ] = await Promise.all([
      // Total products
      Product.count(),
      
      // Low stock products (quantity < 10)
      Product.count({ where: { quantity: { [Op.lt]: 10 } } }),
      
      // Total orders
      Order.count(),
      
      // Pending orders
      Order.count({ where: { status: 'pending' } }),
      
      // Total employees
      Employee.count(),
      
      // Active employees
      Employee.count({ where: { status: 'active' } }),
      
      // Total suppliers
      Supplier.count(),
      
      // Recent orders (last 5)
      Order.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'order_number', 'total_amount', 'status', 'created_at'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['username']
          }
        ]
      }),
      
      // Low stock items (quantity < 10)
      Product.findAll({
        where: { quantity: { [Op.lt]: 10 } },
        limit: 5,
        order: [['quantity', 'ASC']],
        attributes: ['id', 'name', 'quantity', 'unit']
      }),
      
      // Monthly order statistics (last 30 days)
      Order.findAll({
        where: {
          created_at: { [Op.gte]: thirtyDaysAgo }
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('total_amount')), 'total']
        ],
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
        raw: true
      })
    ]);

    // Calculate total revenue from all orders
    const revenueResult = await Order.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue']],
      raw: true
    });
    const totalRevenue = parseFloat(revenueResult.totalRevenue) || 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          lowStockProducts,
          totalOrders,
          pendingOrders,
          totalEmployees,
          activeEmployees,
          totalSuppliers,
          totalRevenue
        },
        recentOrders,
        lowStockItems,
        monthlyStats: monthlyOrderStats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get recent activity
 */
const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Fetch recent activities
    const [recentOrders, recentProducts, recentEmployees] = await Promise.all([
      Order.findAll({
        limit: Math.floor(limit / 3),
        order: [['created_at', 'DESC']],
        attributes: ['id', 'order_number', 'status', 'created_at'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['username']
          }
        ]
      }),
      
      Product.findAll({
        limit: Math.floor(limit / 3),
        order: [['created_at', 'DESC']],
        attributes: ['id', 'name', 'created_at']
      }),
      
      Employee.findAll({
        limit: Math.floor(limit / 3),
        order: [['created_at', 'DESC']],
        attributes: ['id', 'first_name', 'last_name', 'position', 'created_at']
      })
    ]);

    // Combine and format activities
    const activities = [];

    recentOrders.forEach(order => {
      activities.push({
        type: 'order',
        icon: '🛒',
        title: `Order ${order.order_number}`,
        description: `Status: ${order.status}`,
        user: order.user?.username || 'System',
        timestamp: order.created_at
      });
    });

    recentProducts.forEach(product => {
      activities.push({
        type: 'product',
        icon: '📦',
        title: `Product Added`,
        description: product.name,
        user: 'Admin',
        timestamp: product.created_at
      });
    });

    recentEmployees.forEach(employee => {
      activities.push({
        type: 'employee',
        icon: '👤',
        title: `New Employee`,
        description: `${employee.first_name} ${employee.last_name} - ${employee.position}`,
        user: 'HR',
        timestamp: employee.created_at
      });
    });

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: activities.slice(0, limit)
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity
};

