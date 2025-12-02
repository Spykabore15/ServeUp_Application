import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useSettingsStore = defineStore('settings', () => {
  // Helper function to get user-specific key
  const getStorageKey = (key) => {
    const authStore = useAuthStore()
    const userId = authStore.user?.id
    return userId ? `settings_${userId}_${key}` : `settings_${key}`
  }

  // Helper function to load user-specific setting
  const loadSetting = (key, defaultValue) => {
    const storageKey = getStorageKey(key)
    const value = localStorage.getItem(storageKey)
    if (value === null) return defaultValue
    if (typeof defaultValue === 'boolean') return value === 'true'
    return value
  }

  // Helper function to save user-specific setting
  const saveSetting = (key, value) => {
    const storageKey = getStorageKey(key)
    localStorage.setItem(storageKey, value.toString())
  }

  // State - initialized with default values, will be loaded when user logs in
  const darkMode = ref(false)
  const fontSize = ref('normal')
  const readableFont = ref(false)
  const highlightLinks = ref(false)
  const highContrast = ref(false)

  // Load user preferences
  function loadUserPreferences() {
    darkMode.value = loadSetting('darkMode', false)
    fontSize.value = loadSetting('fontSize', 'normal')
    readableFont.value = loadSetting('readableFont', false)
    highlightLinks.value = loadSetting('highlightLinks', false)
    highContrast.value = loadSetting('highContrast', false)
    updateBodyClasses()
  }

  // Actions
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    saveSetting('darkMode', darkMode.value)
    updateBodyClasses()
  }

  function setFontSize(size) {
    fontSize.value = size
    saveSetting('fontSize', size)
    updateBodyClasses()
  }

  function toggleReadableFont() {
    readableFont.value = !readableFont.value
    saveSetting('readableFont', readableFont.value)
    updateBodyClasses()
  }

  function toggleHighlightLinks() {
    highlightLinks.value = !highlightLinks.value
    saveSetting('highlightLinks', highlightLinks.value)
    updateBodyClasses()
  }

  function toggleHighContrast() {
    highContrast.value = !highContrast.value
    saveSetting('highContrast', highContrast.value)
    updateBodyClasses()
  }

  function updateBodyClasses() {
    const body = document.body
    
    // Dark mode
    body.classList.toggle('dark-mode', darkMode.value)
    
    // Font size
    body.classList.remove('font-small', 'font-large', 'font-xlarge')
    if (fontSize.value !== 'normal') {
      body.classList.add(`font-${fontSize.value}`)
    }
    
    // Accessibility options
    body.classList.toggle('readable-font', readableFont.value)
    body.classList.toggle('highlight-links', highlightLinks.value)
    body.classList.toggle('high-contrast', highContrast.value)
  }

  return {
    // State
    darkMode,
    fontSize,
    readableFont,
    highlightLinks,
    highContrast,
    // Actions
    loadUserPreferences,
    toggleDarkMode,
    setFontSize,
    toggleReadableFont,
    toggleHighlightLinks,
    toggleHighContrast
  }
})

