import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.url)
    if (config.data) {
      console.log('📦 Request Data:', config.data)
    }
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.config.url, response.data)
    return response.data
  },
  (error) => {
    console.error('❌ API Error:', error)
    if (error.response) {
      // Server responded with error
      console.error('❌ Response Error:', error.response.status, error.response.data)
      if (error.response.data?.errors) {
        console.error('❌ Validation Errors:', error.response.data.errors)
      }
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('Forbidden: You don\'t have permission')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
      }
    } else if (error.request) {
      // Request made but no response
      console.error('❌ Network error: No response from server')
    } else {
      // Something else happened
      console.error('❌ Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api

