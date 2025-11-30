const { Order, OrderItem, Product, Employee } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all orders with pagination, search, and filters
 */
const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      status = '',
      payment_method = ''
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause.order_number = { [Op.iLike]: `%${search}%` };
    }

    if (status) {
      whereClause.status = status;
    }

    if (payment_method) {
      whereClause.payment_method = payment_method;
    }

    // Fetch orders with pagination
    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'server',
          attributes: ['id', 'first_name', 'last_name', 'position'],
          required: false
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price_per_unit', 'unit']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      distinct: true
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

/**
 * Get a single order by ID
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'server',
          attributes: ['id', 'first_name', 'last_name', 'position'],
          required: false
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price_per_unit', 'unit']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

/**
 * Create a new order
 */
const createOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();

  try {
    const {
      table_number,
      customer_name,
      served_by,
      payment_method,
      status,
      items // Array of { product_id, quantity, price }
    } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item'
      });
    }

    // Generate order number
    const orderCount = await Order.count();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += parseFloat(item.price) * parseFloat(item.quantity);
    }

    // Create order
    const order = await Order.create({
      order_number: orderNumber,
      table_number,
      customer_name,
      served_by,
      total_amount: totalAmount,
      payment_method: payment_method || 'cash',
      status: status || 'pending'
    }, { transaction });

    // Create order items
    for (const item of items) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }, { transaction });
    }

    await transaction.commit();

    // Fetch the complete order with relations
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: Employee,
          as: 'server',
          attributes: ['id', 'first_name', 'last_name', 'position'],
          required: false
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price_per_unit', 'unit']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

/**
 * Update an order
 */
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      table_number,
      customer_name,
      served_by,
      payment_method,
      status
    } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.update({
      table_number,
      customer_name,
      served_by,
      payment_method,
      status
    });

    // Fetch updated order with relations
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'server',
          attributes: ['id', 'first_name', 'last_name', 'position'],
          required: false
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price_per_unit', 'unit']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

/**
 * Delete an order
 */
const deleteOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();

  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Delete order items first (cascade)
    await OrderItem.destroy({ where: { order_id: id }, transaction });

    // Delete order
    await order.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

/**
 * Get order statistics
 */
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const completedOrders = await Order.count({ where: { status: 'completed' } });
    const cancelledOrders = await Order.count({ where: { status: 'cancelled' } });

    // Calculate total revenue from completed orders
    const completedOrdersData = await Order.findAll({
      where: { status: 'completed' },
      attributes: ['total_amount']
    });
    
    const totalRevenue = completedOrdersData.reduce((sum, order) => {
      return sum + parseFloat(order.total_amount || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        totalRevenue: totalRevenue.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats
};




