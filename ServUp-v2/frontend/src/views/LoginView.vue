<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo-container">
          <div class="logo-circles">
            <div class="circle circle-purple"></div>
            <div class="circle circle-teal"></div>
          </div>
          <h1 class="logo-text">ServeUp</h1>
        </div>
        <p class="system-title">Restaurant Management System</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="form-control"
            placeholder="Enter your username"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-login btn-block" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="access-request-section">
        <p class="divider-text">Don't have an account?</p>
        <button @click="showAccessRequestModal = true" class="btn btn-request-access btn-block">
          Request Access
        </button>
      </div>
    </div>

    <!-- Access Request Modal -->
    <UniversalFormModal
      :visible="showAccessRequestModal"
      entity-type="access_request"
      @close="showAccessRequestModal = false"
      @success="handleAccessRequestSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import UniversalFormModal from '../components/UniversalFormModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const showAccessRequestModal = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  const success = await authStore.login(username.value, password.value)

  if (success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = authStore.error || 'Login failed. Please check your credentials.'
  }

  isLoading.value = false
}

const handleAccessRequestSuccess = (result) => {
  // The modal already shows a success message, just close it
  showAccessRequestModal.value = false
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.login-container {
  background-color: white;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.logo-circles {
  position: relative;
  width: 60px;
  height: 60px;
}

.circle {
  position: absolute;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.circle-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: 0;
  left: 0;
  z-index: 2;
}

.circle-teal {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  bottom: 0;
  right: 0;
  z-index: 1;
  opacity: 0.8;
}

.logo-text {
  color: #667eea;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.system-title {
  color: #3498db;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control::placeholder {
  color: #a0aec0;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #fc8181;
  font-size: 0.9rem;
}

.btn {
  width: 100%;
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-login {
  background: #3498db;
  color: white;
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.access-request-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.divider-text {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.btn-request-access {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-request-access:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}


/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 2rem 1.5rem;
  }

  .logo-text {
    font-size: 2rem;
  }

  .logo-circles {
    width: 50px;
    height: 50px;
  }

  .circle {
    width: 40px;
    height: 40px;
  }
}
</style>

