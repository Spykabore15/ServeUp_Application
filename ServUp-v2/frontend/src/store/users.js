import { defineStore } from 'pinia';
import userService from '../services/userService';

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    currentUser: null,
    stats: {
      total: 0,
      active: 0,
      inactive: 0,
      byRole: {
        admin: 0,
        responsable_stocks: 0,
        responsable_employes: 0,
        employe: 0
      }
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      search: '',
      role: '',
      is_active: ''
    },
    isLoading: false,
    error: null
  }),

  getters: {
    getUsers: (state) => state.users,
    getCurrentUser: (state) => state.currentUser,
    isLoadingUsers: (state) => state.isLoading,
    getError: (state) => state.error,
    getStats: (state) => state.stats,
    getPagination: (state) => state.pagination,
    getFilters: (state) => state.filters
  },

  actions: {
    /**
     * Fetch all users
     */
    async fetchUsers(params = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const mergedParams = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...params
        };

        // Add filters if they exist
        if (this.filters.search) mergedParams.search = this.filters.search;
        if (this.filters.role) mergedParams.role = this.filters.role;
        if (this.filters.is_active !== '') mergedParams.is_active = this.filters.is_active;

        const response = await userService.getAllUsers(mergedParams);

        if (response && response.success !== undefined) {
          this.users = response.data || [];
          this.pagination = response.pagination || this.pagination;
        } else if (response && Array.isArray(response.data)) {
          this.users = response.data;
          this.pagination = response.pagination || this.pagination;
        } else if (response && Array.isArray(response)) {
          this.users = response;
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error fetching users';
        console.error('Error fetching users:', error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch user by ID
     */
    async fetchUserById(id) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await userService.getUserById(id);
        const user = response.success ? response.data : response;
        this.currentUser = user;
        return user;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error fetching user';
        console.error('Error fetching user:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Create a new user
     */
    async createUser(userData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await userService.createUser(userData);
        const user = response.success ? response.data : response;

        // Add to local state
        this.users.unshift(user);
        this.pagination.total += 1;

        // Refresh
        await this.fetchUsers();
        await this.fetchStats();

        return user;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error creating user';
        console.error('Error creating user:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update a user
     */
    async updateUser(id, userData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await userService.updateUser(id, userData);
        const user = response.success ? response.data : response;

        await this.fetchUsers();
        await this.fetchStats();
        
        return user;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error updating user';
        console.error('Error updating user:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Delete a user
     */
    async deleteUser(id) {
      this.isLoading = true;
      this.error = null;

      try {
        await userService.deleteUser(id);

        // Remove from local state
        this.users = this.users.filter(user => user.id !== id);
        this.pagination.total -= 1;

        // Refresh
        await this.fetchUsers();
        await this.fetchStats();

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error deleting user';
        console.error('Error deleting user:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Toggle user status
     */
    async toggleUserStatus(id) {
      this.isLoading = true;
      this.error = null;

      try {
        await userService.toggleUserStatus(id);

        // Update local state
        const user = this.users.find(u => u.id === id);
        if (user) {
          user.is_active = !user.is_active;
        }

        await this.fetchStats();

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Error toggling user status';
        console.error('Error toggling user status:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch user statistics
     */
    async fetchStats() {
      try {
        const response = await userService.getUserStats();

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
     * Set filters
     */
    setSearchFilter(search) {
      this.filters.search = search;
      this.pagination.page = 1;
    },

    setRoleFilter(role) {
      this.filters.role = role;
      this.pagination.page = 1;
    },

    setActiveFilter(is_active) {
      this.filters.is_active = is_active;
      this.pagination.page = 1;
    },

    /**
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        search: '',
        role: '',
        is_active: ''
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


