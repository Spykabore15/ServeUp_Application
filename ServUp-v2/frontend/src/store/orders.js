import { defineStore } from 'pinia';
import orderService from '../services/orderService';

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [],
    currentOrder: null,
    stats: {
      total: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      search: '',
      status: '',
      payment_method: ''
    },
    isLoading: false,
    error: null
  }),

  getters: {
    getOrders: (state) => state.orders,
    getCurrentOrder: (state) => state.currentOrder,
    isLoadingOrders: (state) => state.isLoading,
    getError: (state) => state.error,
    getStats: (state) => state.stats,
    getPagination: (state) => state.pagination,
    getFilters: (state) => state.filters
  },

  actions: {
    /**
     * Fetch all orders
     */
    async fetchOrders(params = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const mergedParams = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          search: this.filters.search,
          status: this.filters.status,
          payment_method: this.filters.payment_method,
          ...params
        };

        // Remove empty filters
        Object.keys(mergedParams).forEach(key => {
          if (mergedParams[key] === '') {
            delete mergedParams[key];
          }
        });

        const response = await orderService.getAllOrders(mergedParams);

        if (response && response.success !== undefined) {
          this.orders = response.data || [];
          this.pagination = response.pagination || this.pagination;
        } else if (response && Array.isArray(response.data)) {
          this.orders = response.data;
          this.pagination = response.pagination || this.pagination;
        } else if (response && Array.isArray(response)) {
          this.orders = response;
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error fetching orders';
        console.error('Error fetching orders:', error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch order by ID
     */
    async fetchOrderById(id) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await orderService.getOrderById(id);
        const order = response.success ? response.data : response;
        this.currentOrder = order;
        return order;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error fetching order';
        console.error('Error fetching order:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Create a new order
     */
    async createOrder(orderData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await orderService.createOrder(orderData);
        const order = response.success ? response.data : response;

        // Add to local state
        this.orders.unshift(order);
        this.pagination.total += 1;

        // Refresh
        await this.fetchOrders();
        await this.fetchStats();

        return order;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error creating order';
        console.error('Error creating order:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update an order
     */
    async updateOrder(id, orderData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await orderService.updateOrder(id, orderData);
        const order = response.success ? response.data : response;

        await this.fetchOrders();
        return order;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error updating order';
        console.error('Error updating order:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Delete an order
     */
    async deleteOrder(id) {
      this.isLoading = true;
      this.error = null;

      try {
        await orderService.deleteOrder(id);

        // Remove from local state
        this.orders = this.orders.filter(order => order.id !== id);
        this.pagination.total -= 1;

        // Refresh
        await this.fetchOrders();
        await this.fetchStats();

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error deleting order';
        console.error('Error deleting order:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch order statistics
     */
    async fetchStats() {
      try {
        const response = await orderService.getOrderStats();

        if (response && response.success) {
          this.stats = response.data;
        } else if (response && typeof response === 'object' && 'total' in response) {
          this.stats = response;
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    },

    /**
     * Set search filter
     */
    setSearchFilter(search) {
      this.filters.search = search;
      this.pagination.page = 1;
    },

    /**
     * Set status filter
     */
    setStatusFilter(status) {
      this.filters.status = status;
      this.pagination.page = 1;
    },

    /**
     * Set payment method filter
     */
    setPaymentMethodFilter(method) {
      this.filters.payment_method = method;
      this.pagination.page = 1;
    },

    /**
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        payment_method: ''
      };
      this.pagination.page = 1;
    },

    /**
     * Set page
     */
    setPage(page) {
      this.pagination.page = page;
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null;
    }
  }
});




