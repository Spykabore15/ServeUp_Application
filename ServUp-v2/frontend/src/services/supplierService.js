import api from './api';

/**
 * Supplier Service
 * Handles all supplier-related API calls
 */

const supplierService = {
  /**
   * Get all suppliers with pagination and filters
   */
  getAllSuppliers: async (params = {}) => {
    try {
      const response = await api.get('/suppliers', { params });
      return response;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  /**
   * Get a single supplier by ID
   */
  getSupplierById: async (id) => {
    try {
      const response = await api.get(`/suppliers/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching supplier:', error);
      throw error;
    }
  },

  /**
   * Create a new supplier
   */
  createSupplier: async (supplierData) => {
    try {
      const response = await api.post('/suppliers', supplierData);
      return response;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  /**
   * Update a supplier
   */
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return response;
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  },

  /**
   * Delete a supplier
   */
  deleteSupplier: async (id) => {
    try {
      const response = await api.delete(`/suppliers/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  },

  /**
   * Get supplier statistics
   */
  getSupplierStats: async () => {
    try {
      const response = await api.get('/suppliers/stats');
      return response;
    } catch (error) {
      console.error('Error fetching supplier stats:', error);
      throw error;
    }
  },

  /**
   * Search suppliers
   */
  searchSuppliers: async (searchQuery, params = {}) => {
    try {
      const response = await api.get('/suppliers', {
        params: {
          search: searchQuery,
          ...params
        }
      });
      return response;
    } catch (error) {
      console.error('Error searching suppliers:', error);
      throw error;
    }
  }
};

export default supplierService;




