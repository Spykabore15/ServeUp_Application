import { defineStore } from 'pinia';
import employeeService from '../services/employeeService';

export const useEmployeeStore = defineStore('employees', {
  state: () => ({
    employees: [],
    currentEmployee: null,
    stats: {
      total: 0,
      active: 0,
      inactive: 0,
      on_leave: 0
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      search: '',
      position: '',
      status: ''
    },
    isLoading: false,
    error: null
  }),

  getters: {
    /**
     * Get employees list
     */
    getEmployees: (state) => state.employees,

    /**
     * Get current employee
     */
    getCurrentEmployee: (state) => state.currentEmployee,

    /**
     * Get loading state
     */
    isLoadingEmployees: (state) => state.isLoading,

    /**
     * Get error state
     */
    getError: (state) => state.error,

    /**
     * Get stats
     */
    getStats: (state) => state.stats,

    /**
     * Get pagination info
     */
    getPagination: (state) => state.pagination,

    /**
     * Get active filters
     */
    getFilters: (state) => state.filters
  },

  actions: {
    /**
     * Fetch all employees
     */
    async fetchEmployees(params = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        // Build params, only include filters that have values
        const mergedParams = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...params
        };

        // Only add filters if they have actual values
        if (this.filters.search) {
          mergedParams.search = this.filters.search;
        }
        if (this.filters.position) {
          mergedParams.position = this.filters.position;
        }
        if (this.filters.status) {
          mergedParams.status = this.filters.status;
        }

        console.log('🔄 Store: Fetching employees with params:', mergedParams);
        const response = await employeeService.getAllEmployees(mergedParams);
        console.log('✅ Store: Received response:', response);
        console.log('✅ Store: Response structure check:', {
          hasSuccess: 'success' in response,
          hasData: 'data' in response,
          hasPagination: 'pagination' in response,
          successValue: response.success,
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          dataLength: response.data?.length
        });

        // Handle both wrapped and direct responses
        if (response && response.success !== undefined) {
          // Wrapped response: { success: true, data: [...], pagination: {...} }
          console.log('✅ Store: Using wrapped response format');
          this.employees = response.data || [];
          this.pagination = response.pagination || this.pagination;
        } else if (response && Array.isArray(response.data)) {
          // Direct response with data array
          console.log('✅ Store: Using direct response format with data array');
          this.employees = response.data;
          this.pagination = response.pagination || this.pagination;
        } else if (response && Array.isArray(response)) {
          // Response is directly an array
          console.log('✅ Store: Response is directly an array');
          this.employees = response;
        } else {
          console.error('❌ Store: Unexpected response format:', response);
          throw new Error('Unexpected response format from server');
        }
        
        console.log('✅ Store: Final employees count:', this.employees.length);
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error fetching employees';
        console.error('❌ Store: Error fetching employees:', error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch employee by ID
     */
    async fetchEmployeeById(id) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await employeeService.getEmployeeById(id);

        if (response.success) {
          this.currentEmployee = response.data;
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch employee');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error fetching employee';
        console.error('Error fetching employee:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Create a new employee
     */
    async createEmployee(employeeData) {
      this.isLoading = true;
      this.error = null;

      try {
        console.log('🔄 Store: Creating employee...');
        const response = await employeeService.createEmployee(employeeData);
        console.log('✅ Store: Received response:', response);

        // Check if response has success property (wrapped) or is the data directly
        const employee = response.success ? response.data : response;
        
        console.log('✅ Store: Employee created successfully!', employee);
        
        // Add the new employee to the list immediately
        this.employees.unshift(employee);
        this.pagination.total += 1;
        
        // Also refresh to ensure consistency
        await this.fetchEmployees();
        await this.fetchStats();
        
        return employee;
      } catch (error) {
        console.error('❌ Store: Error creating employee:', error);
        this.error = error.response?.data?.message || error.message || 'Error creating employee';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update an employee
     */
    async updateEmployee(id, employeeData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await employeeService.updateEmployee(id, employeeData);

        // Handle both wrapped and direct responses
        const employee = response.success ? response.data : response;
        
        // Refresh the list after updating
        await this.fetchEmployees();
        return employee;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error updating employee';
        console.error('Error updating employee:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Delete an employee
     */
    async deleteEmployee(id) {
      this.isLoading = true;
      this.error = null;

      try {
        console.log('🗑️ Store: Deleting employee with ID:', id);
        const response = await employeeService.deleteEmployee(id);
        console.log('✅ Store: Delete response:', response);

        // Handle both wrapped and direct responses
        const isSuccess = response?.success !== false;
        
        if (isSuccess) {
          console.log('✅ Store: Employee deleted successfully');
          
          // Remove from local state immediately
          this.employees = this.employees.filter(emp => emp.id !== id);
          this.pagination.total -= 1;
          
          // Refresh the list and stats
          await this.fetchEmployees();
          await this.fetchStats();
          
          return true;
        } else {
          throw new Error(response?.message || 'Failed to delete employee');
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error deleting employee';
        console.error('❌ Store: Error deleting employee:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch employee statistics
     */
    async fetchStats() {
      try {
        console.log('📊 Store: Fetching stats...');
        const response = await employeeService.getEmployeeStats();
        console.log('📊 Store: Stats response:', response);

        // Handle both wrapped and direct responses
        if (response && response.success) {
          this.stats = response.data;
        } else if (response && typeof response === 'object' && 'total' in response) {
          // Direct stats object
          this.stats = response;
        }
        
        console.log('📊 Store: Final stats:', this.stats);
      } catch (error) {
        console.error('❌ Error fetching stats:', error);
      }
    },

    /**
     * Set search filter
     */
    setSearchFilter(search) {
      this.filters.search = search;
      this.pagination.page = 1; // Reset to first page
    },

    /**
     * Set position filter
     */
    setPositionFilter(position) {
      this.filters.position = position;
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
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        search: '',
        position: '',
        status: ''
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

