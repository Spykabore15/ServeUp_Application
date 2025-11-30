import api from './api';

const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const response = await api.get('/dashboard/stats');
    return response;
  },

  /**
   * Get recent activity
   */
  async getRecentActivity(limit = 10) {
    const response = await api.get(`/dashboard/activity?limit=${limit}`);
    return response;
  }
};

export default dashboardService;

