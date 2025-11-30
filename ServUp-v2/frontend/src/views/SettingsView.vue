<template>
  <div class="settings-view">
    <div class="settings-header">
      <h1>⚙️ Settings</h1>
      <p class="settings-subtitle">Manage your preferences and account settings</p>
    </div>

    <div class="settings-container">
      <!-- General Preferences Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2>General Preferences</h2>
          <p class="section-description">Customize your application experience</p>
        </div>
        
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">Dark Mode</label>
              <p class="setting-description">Switch between light and dark theme</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settingsStore.darkMode"
                @change="settingsStore.toggleDarkMode()"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Security Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2>Security</h2>
          <p class="section-description">Manage your account security</p>
        </div>
        
        <div class="settings-card">
          <form @submit.prevent="handleChangePassword" class="password-form">
            <div class="form-group">
              <label for="currentPassword" class="form-label">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                class="form-input"
                placeholder="Enter your current password"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="newPassword" class="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                v-model="passwordForm.newPassword"
                class="form-input"
                placeholder="Enter your new password"
                required
                minlength="6"
              >
            </div>
            
            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                class="form-input"
                placeholder="Confirm your new password"
                required
                minlength="6"
              >
            </div>
            
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
            
            <div v-if="passwordSuccess" class="success-message">
              {{ passwordSuccess }}
            </div>
            
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="isChangingPassword"
            >
              <span v-if="isChangingPassword">Changing Password...</span>
              <span v-else>Change Password</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Accessibility Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2>Accessibility</h2>
          <p class="section-description">Customize the interface for better accessibility</p>
        </div>
        
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">Font Size</label>
              <p class="setting-description">Adjust the text size for better readability</p>
            </div>
            <select 
              v-model="settingsStore.fontSize"
              @change="settingsStore.setFontSize(settingsStore.fontSize)"
              class="font-size-select"
            >
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="xlarge">Extra Large</option>
            </select>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">Readable Font</label>
              <p class="setting-description">Use a more readable font family</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settingsStore.readableFont"
                @change="settingsStore.toggleReadableFont()"
              >
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">Highlight Links</label>
              <p class="setting-description">Make links more visible with highlighting</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settingsStore.highlightLinks"
                @change="settingsStore.toggleHighlightLinks()"
              >
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">High Contrast Mode</label>
              <p class="setting-description">Increase contrast for better visibility</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settingsStore.highContrast"
                @change="settingsStore.toggleHighContrast()"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Account Information Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2>Account Information</h2>
          <p class="section-description">View your account details</p>
        </div>
        
        <div class="settings-card">
          <div class="account-info">
            <div class="info-item">
              <span class="info-label">Username:</span>
              <span class="info-value">{{ authStore.userName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ authStore.user?.email || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Role:</span>
              <span class="info-value role-badge" :class="authStore.userRole">
                {{ formatRole(authStore.userRole) }}
              </span>
            </div>
            <div class="info-item" v-if="authStore.user?.first_name">
              <span class="info-label">Name:</span>
              <span class="info-value">
                {{ authStore.user.first_name }} {{ authStore.user.last_name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '../store/settings'
import { useAuthStore } from '../store/auth'
import authService from '../services/authService'

const settingsStore = useSettingsStore()
const authStore = useAuthStore()

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isChangingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

const formatRole = (role) => {
  const roleMap = {
    'admin': 'Administrator',
    'responsable_stocks': 'Stock Manager',
    'responsable_employes': 'HR Manager',
    'employe': 'Employee'
  }
  return roleMap[role] || role
}

const handleChangePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''
  
  // Validation
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }
  
  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'Password must be at least 6 characters long'
    return
  }
  
  isChangingPassword.value = true
  
  try {
    await authService.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    )
    
    passwordSuccess.value = 'Password changed successfully!'
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      passwordSuccess.value = ''
    }, 5000)
  } catch (error) {
    passwordError.value = error.response?.data?.message || error.message || 'Failed to change password'
  } finally {
    isChangingPassword.value = false
  }
}
</script>

<style scoped>
.settings-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
}

.settings-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.settings-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.settings-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.settings-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #6b7280;
  font-size: 0.95rem;
}

.settings-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: background 0.2s;
}

.setting-item:hover {
  background: #f3f4f6;
}

.setting-info {
  flex: 1;
}

.setting-label {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.setting-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 28px;
  margin-left: 1rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

input:checked + .slider:before {
  transform: translateX(28px);
}

/* Font Size Select */
.font-size-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #1f2937;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 150px;
}

.font-size-select:hover {
  border-color: #667eea;
}

.font-size-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Password Form */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-primary {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  align-self: flex-start;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem 1rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 4px solid #dc2626;
}

.success-message {
  padding: 0.75rem 1rem;
  background: #d1fae5;
  color: #059669;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 4px solid #059669;
}

/* Account Information */
.account-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.95rem;
}

.info-value {
  font-weight: 500;
  color: #1f2937;
  font-size: 1rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.admin {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.responsable_stocks {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.responsable_employes {
  background: #e0e7ff;
  color: #3730a3;
}

.role-badge.employe {
  background: #f3f4f6;
  color: #374151;
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-view {
    padding: 1rem;
  }
  
  .settings-section {
    padding: 1.5rem;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .toggle-switch {
    margin-left: 0;
    align-self: flex-end;
  }
  
  .font-size-select {
    width: 100%;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
