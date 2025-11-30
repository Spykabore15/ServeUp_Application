import { defineStore } from 'pinia';
import dashboardService from '../services/dashboardService';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      overview: {
        totalProducts: 0,
        lowStockProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalEmployees: 0,
        activeEmployees: 0,
        totalSuppliers: 0,
        totalRevenue: 0
      },
      recentOrders: [],
      lowStockItems: [],
      monthlyStats: []
    },
    recentActivity: [],
    isLoading: false,
    error: null
  }),

  getters: {
    getStats: (state) => state.stats,
    getRecentActivity: (state) => state.recentActivity,
    isLoadingStats: (state) => state.isLoading
  },

  actions: {
    /**
     * Fetch dashboard statistics
     */
    async fetchStats() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await dashboardService.getDashboardStats();
        
        if (response && response.success) {
          this.stats = response.data;
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        this.error = error.message || 'Failed to fetch dashboard statistics';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch recent activity
     */
    async fetchActivity(limit = 10) {
      try {
        const response = await dashboardService.getRecentActivity(limit);
        
        if (response && response.success) {
          this.recentActivity = response.data;
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    },

    /**
     * Refresh all dashboard data
     */
    async refreshDashboard() {
      await Promise.all([
        this.fetchStats(),
        this.fetchActivity()
      ]);
    }
  }
});

