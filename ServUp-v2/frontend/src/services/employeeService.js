import api from './api';

/**
 * Employee Service
 * Handles all employee-related API calls
 */

const employeeService = {
  /**
   * Get all employees with pagination and filters
   */
  getAllEmployees: async (params = {}) => {
    try {
      const response = await api.get('/employees', { params });
      return response;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  /**
   * Get a single employee by ID
   */
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  /**
   * Create a new employee
   */
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  /**
   * Update an employee
   */
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  /**
   * Delete an employee
   */
  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  /**
   * Get employee statistics
   */
  getEmployeeStats: async () => {
    try {
      const response = await api.get('/employees/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      throw error;
    }
  },

  /**
   * Search employees
   */
  searchEmployees: async (searchQuery, params = {}) => {
    try {
      const response = await api.get('/employees', {
        params: {
          search: searchQuery,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching employees:', error);
      throw error;
    }
  }
};

export default employeeService;

