import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const darkMode = ref(localStorage.getItem('darkMode') === 'true' || false)
  const fontSize = ref(localStorage.getItem('fontSize') || 'normal')
  const readableFont = ref(localStorage.getItem('readableFont') === 'true' || false)
  const highlightLinks = ref(localStorage.getItem('highlightLinks') === 'true' || false)
  const highContrast = ref(localStorage.getItem('highContrast') === 'true' || false)

  // Actions
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', darkMode.value.toString())
    updateBodyClasses()
  }

  function setFontSize(size) {
    fontSize.value = size
    localStorage.setItem('fontSize', size)
    updateBodyClasses()
  }

  function toggleReadableFont() {
    readableFont.value = !readableFont.value
    localStorage.setItem('readableFont', readableFont.value.toString())
    updateBodyClasses()
  }

  function toggleHighlightLinks() {
    highlightLinks.value = !highlightLinks.value
    localStorage.setItem('highlightLinks', highlightLinks.value.toString())
    updateBodyClasses()
  }

  function toggleHighContrast() {
    highContrast.value = !highContrast.value
    localStorage.setItem('highContrast', highContrast.value.toString())
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

  // Initialize body classes on load
  updateBodyClasses()

  return {
    // State
    darkMode,
    fontSize,
    readableFont,
    highlightLinks,
    highContrast,
    // Actions
    toggleDarkMode,
    setFontSize,
    toggleReadableFont,
    toggleHighlightLinks,
    toggleHighContrast
  }
})

