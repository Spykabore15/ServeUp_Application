const { Employee, Product, Order, Supplier, AccessRequest, sequelize } = require('../models');
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch all statistics in parallel
    // Note: AccessRequest queries are wrapped in try-catch in case table doesn't exist yet
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
        attributes: ['id', 'order_number', 'total_amount', 'status', 'created_at', 'customer_name'],
        include: [
          {
            model: Employee,
            as: 'server',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
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

    // Fetch access requests separately with error handling
    let pendingAccessRequestsCount = 0;
    let pendingAccessRequestsList = [];
    try {
      pendingAccessRequestsCount = await AccessRequest.count({ where: { status: 'pending' } });
      pendingAccessRequestsList = await AccessRequest.findAll({
        where: { status: 'pending' },
        limit: 5,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'full_name', 'email', 'username', 'requested_role', 'reason', 'created_at']
      });
    } catch (error) {
      // Table doesn't exist yet - this is fine, just use defaults
      console.warn('AccessRequest table not found - migration may not have run yet:', error.message);
    }

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
          totalRevenue,
          pendingAccessRequests: pendingAccessRequestsCount
        },
        recentOrders,
        lowStockItems,
        pendingAccessRequests: pendingAccessRequestsList || [],
        monthlyStats: monthlyOrderStats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
        attributes: ['id', 'order_number', 'status', 'created_at', 'customer_name'],
        include: [
          {
            model: Employee,
            as: 'server',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
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
      const serverName = order.server 
        ? `${order.server.first_name} ${order.server.last_name}`
        : 'System';
      activities.push({
        type: 'order',
        icon: '🛒',
        title: `Order ${order.order_number}`,
        description: `Status: ${order.status} - Customer: ${order.customer_name}`,
        user: serverName,
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
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity
};

