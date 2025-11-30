import { defineStore } from 'pinia';
import supplierService from '../services/supplierService';

export const useSupplierStore = defineStore('suppliers', {
  state: () => ({
    suppliers: [],
    currentSupplier: null,
    stats: {
      total: 0,
      active: 0,
      inactive: 0
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      search: ''
    },
    isLoading: false,
    error: null
  }),

  getters: {
    getSuppliers: (state) => state.suppliers,
    getCurrentSupplier: (state) => state.currentSupplier,
    isLoadingSuppliers: (state) => state.isLoading,
    getError: (state) => state.error,
    getStats: (state) => state.stats,
    getPagination: (state) => state.pagination,
    getFilters: (state) => state.filters
  },

  actions: {
    /**
     * Fetch all suppliers
     */
    async fetchSuppliers(params = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const mergedParams = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          search: this.filters.search,
          ...params
        };

        // Remove empty filters
        Object.keys(mergedParams).forEach(key => {
          if (mergedParams[key] === '') {
            delete mergedParams[key];
          }
        });

        const response = await supplierService.getAllSuppliers(mergedParams);

        if (response && response.success !== undefined) {
          this.suppliers = response.data || [];
          this.pagination = response.pagination || this.pagination;
        } else if (response && Array.isArray(response.data)) {
          this.suppliers = response.data;
          this.pagination = response.pagination || this.pagination;
        } else if (response && Array.isArray(response)) {
          this.suppliers = response;
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error fetching suppliers';
        console.error('Error fetching suppliers:', error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch supplier by ID
     */
    async fetchSupplierById(id) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await supplierService.getSupplierById(id);
        const supplier = response.success ? response.data : response;
        this.currentSupplier = supplier;
        return supplier;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error fetching supplier';
        console.error('Error fetching supplier:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Create a new supplier
     */
    async createSupplier(supplierData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await supplierService.createSupplier(supplierData);
        const supplier = response.success ? response.data : response;

        // Add to local state
        this.suppliers.unshift(supplier);
        this.pagination.total += 1;

        // Refresh
        await this.fetchSuppliers();
        await this.fetchStats();

        return supplier;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error creating supplier';
        console.error('Error creating supplier:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update a supplier
     */
    async updateSupplier(id, supplierData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await supplierService.updateSupplier(id, supplierData);
        const supplier = response.success ? response.data : response;

        await this.fetchSuppliers();
        return supplier;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error updating supplier';
        console.error('Error updating supplier:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Delete a supplier
     */
    async deleteSupplier(id) {
      this.isLoading = true;
      this.error = null;

      try {
        await supplierService.deleteSupplier(id);

        // Remove from local state
        this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
        this.pagination.total -= 1;

        // Refresh
        await this.fetchSuppliers();
        await this.fetchStats();

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error deleting supplier';
        console.error('Error deleting supplier:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch supplier statistics
     */
    async fetchStats() {
      try {
        const response = await supplierService.getSupplierStats();

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
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        search: ''
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




