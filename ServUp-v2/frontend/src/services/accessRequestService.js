import api from './api';

const accessRequestService = {
  /**
   * Create a new access request
   */
  async createAccessRequest(data) {
    // API interceptor already returns response.data, so we just return the response directly
    const response = await api.post('/access-requests', data);
    return response;
  },

  /**
   * Get all access requests
   */
  async getAccessRequests(params = {}) {
    // API interceptor already returns response.data
    const response = await api.get('/access-requests', { params });
    return response;
  },

  /**
   * Get pending access requests count
   */
  async getPendingRequestsCount() {
    // API interceptor already returns response.data
    const response = await api.get('/access-requests/pending/count');
    return response;
  },

  /**
   * Approve an access request
   */
  async approveAccessRequest(id, data = {}) {
    // API interceptor already returns response.data
    // data can be { assigned_role, review_notes } or just a string (review_notes) for backward compatibility
    const payload = typeof data === 'string' 
      ? { review_notes: data }
      : { assigned_role: data.assigned_role, review_notes: data.review_notes || null };
    
    const response = await api.put(`/access-requests/${id}/approve`, payload);
    return response;
  },

  /**
   * Deny an access request
   */
  async denyAccessRequest(id, reviewNotes = '') {
    // API interceptor already returns response.data
    const response = await api.put(`/access-requests/${id}/deny`, {
      review_notes: reviewNotes
    });
    return response;
  }
};

export default accessRequestService;

