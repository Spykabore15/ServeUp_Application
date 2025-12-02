import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'
import { useSettingsStore } from './settings'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.username || '')

  // Actions
  async function login(username, password) {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔐 Auth Store: Attempting login...')
      const response = await authService.login(username, password)
      console.log('✅ Auth Store: Login response:', response)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      console.log('✅ Auth Store: Login successful, user:', user.value)
      
      // Load user-specific settings after login
      const settingsStore = useSettingsStore()
      settingsStore.loadUserPreferences()
      
      return true
    } catch (err) {
      console.error('❌ Auth Store: Login failed:', err)
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return

    try {
      const response = await authService.getCurrentUser()
      user.value = response.user
      
      // Load user-specific settings after fetching user
      const settingsStore = useSettingsStore()
      settingsStore.loadUserPreferences()
    } catch (err) {
      console.error('Failed to fetch user:', err)
      // If token is invalid, logout
      await logout()
    }
  }

  function hasRole(roles) {
    if (!Array.isArray(roles)) roles = [roles]
    return roles.includes(userRole.value)
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    userName,
    // Actions
    login,
    logout,
    fetchCurrentUser,
    hasRole
  }
})

