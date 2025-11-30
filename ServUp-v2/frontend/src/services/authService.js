import api from './api'

const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password })
    return response
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response
  },

  async changePassword(oldPassword, newPassword) {
    const response = await api.put('/auth/change-password', {
      oldPassword,
      newPassword
    })
    return response
  }
}

export default authService

