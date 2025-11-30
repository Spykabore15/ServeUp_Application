import api from './api';

/**
 * Order Service
 * Handles all order-related API calls
 */

const orderService = {
  /**
   * Get all orders with pagination and filters
   */
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Get a single order by ID
   */
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  /**
   * Create a new order
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Update an order
   */
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/orders/${id}`, orderData);
      return response;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  /**
   * Delete an order
   */
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  /**
   * Get order statistics
   */
  getOrderStats: async () => {
    try {
      const response = await api.get('/orders/stats');
      return response;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  },

  /**
   * Search orders
   */
  searchOrders: async (searchQuery, params = {}) => {
    try {
      const response = await api.get('/orders', {
        params: {
          search: searchQuery,
          ...params
        }
      });
      return response;
    } catch (error) {
      console.error('Error searching orders:', error);
      throw error;
    }
  }
};

export default orderService;




