/**
 * Report Service
 * API calls for analytics and reporting
 */

import api from './api';

const reportService = {
  /**
   * Get sales analytics
   * @param {string} startDate - Optional start date (YYYY-MM-DD)
   * @param {string} endDate - Optional end date (YYYY-MM-DD)
   * @returns {Promise} Sales analytics data
   */
  async getSalesAnalytics(startDate = null, endDate = null) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get('/reports/sales', { params });
    // Axios interceptor already returns response.data, so response is the backend response
    return response;
  },

  /**
   * Get inventory analytics
   * @returns {Promise} Inventory analytics data
   */
  async getInventoryAnalytics() {
    const response = await api.get('/reports/inventory');
    // Axios interceptor already returns response.data, so response is the backend response
    return response;
  },

  /**
   * Get employee analytics
   * @returns {Promise} Employee analytics data
   */
  async getEmployeeAnalytics() {
    const response = await api.get('/reports/employees');
    // Axios interceptor already returns response.data, so response is the backend response
    return response;
  },

  /**
   * Get supplier analytics
   * @returns {Promise} Supplier analytics data
   */
  async getSupplierAnalytics() {
    const response = await api.get('/reports/suppliers');
    // Axios interceptor already returns response.data, so response is the backend response
    return response;
  }
};

export default reportService;






