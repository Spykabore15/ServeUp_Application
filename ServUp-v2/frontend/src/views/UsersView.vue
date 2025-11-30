<template>
  <div class="users-view">
    <!-- Header -->
    <div class="page-header">
      <h1>👤 User Management</h1>
      <button @click="openAddModal" class="btn btn-success">
        ➕ Add User
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-card">
        <h3>{{ userStore.stats.total }}</h3>
        <p>Total Users</p>
      </div>
      <div class="stat-card success">
        <h3>{{ userStore.stats.active }}</h3>
        <p>Active Users</p>
      </div>
      <div class="stat-card warning">
        <h3>{{ userStore.stats.inactive }}</h3>
        <p>Inactive Users</p>
      </div>
      <div class="stat-card info">
        <h3>{{ userStore.stats.byRole.admin }}</h3>
        <p>Administrators</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <input
        v-model="searchQuery"
        @input="debounceSearch"
        type="text"
        placeholder="🔍 Search by username or email..."
        class="search-input"
      />

      <select v-model="roleFilter" @change="handleRoleFilter" class="filter-select">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="responsable_stocks">Stock Manager</option>
        <option value="responsable_employes">Employee Manager</option>
        <option value="employe">Employee</option>
      </select>

      <select v-model="statusFilter" @change="handleStatusFilter" class="filter-select">
        <option value="">All Statuses</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <button @click="clearAllFilters" class="btn-clear">
        Clear filters
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading users...</p>
    </div>

    <!-- Users Table -->
    <div v-else-if="users.length > 0" class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Linked Employee</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td><strong>{{ user.username }}</strong></td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="`role-${user.role}`">
                {{ formatRole(user.role) }}
              </span>
            </td>
            <td>
              <span v-if="user.employee">
                {{ user.employee.first_name }} {{ user.employee.last_name }}
                <small>({{ user.employee.position }})</small>
              </span>
              <span v-else class="text-muted">Not linked</span>
            </td>
            <td>
              <span 
                class="status-badge" 
                :class="user.is_active ? 'status-active' : 'status-inactive'"
              >
                {{ user.is_active ? '✅ Active' : '❌ Inactive' }}
              </span>
            </td>
            <td>
              {{ user.last_login ? formatDate(user.last_login) : 'Never' }}
            </td>
            <td class="actions-cell">
              <button 
                @click="openEditModal(user)" 
                class="btn-icon edit-btn"
                title="Edit"
              >
                ✏️
              </button>
              <button 
                @click="confirmToggleStatus(user)" 
                class="btn-icon"
                :class="user.is_active ? 'deactivate-btn' : 'activate-btn'"
                :title="user.is_active ? 'Deactivate' : 'Activate'"
              >
                {{ user.is_active ? '🔒' : '🔓' }}
              </button>
              <button 
                @click="confirmDelete(user)" 
                class="btn-icon delete-btn"
                title="Delete"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>👤 No users found</p>
      <button @click="openAddModal" class="btn btn-primary">
        Add first user
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="pagination">
      <button 
        @click="goToPage(pagination.page - 1)" 
        :disabled="pagination.page === 1"
        class="btn-pagination"
      >
        ← Previous
      </button>
      <span class="page-info">
        Page {{ pagination.page }} / {{ pagination.totalPages }}
      </span>
      <button 
        @click="goToPage(pagination.page + 1)" 
        :disabled="pagination.page === pagination.totalPages"
        class="btn-pagination"
      >
        Next →
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h2>{{ isEditMode ? '✏️ Edit User' : '➕ Add New User' }}</h2>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>

        <form @submit.prevent="handleSubmit" class="user-form">
          <!-- Account Information -->
          <div class="form-section">
            <h3 class="section-title">🔐 Account Information</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="username">Username *</label>
                <input
                  v-model="formData.username"
                  id="username"
                  type="text"
                  required
                  class="form-control"
                  placeholder="e.g., johndoe"
                />
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  v-model="formData.email"
                  id="email"
                  type="email"
                  required
                  class="form-control"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="password">
                  Password {{ isEditMode ? '(leave blank to keep current)' : '*' }}
                </label>
                <input
                  v-model="formData.password"
                  id="password"
                  type="password"
                  :required="!isEditMode"
                  class="form-control"
                  placeholder="Minimum 6 characters"
                  minlength="6"
                />
              </div>

              <div class="form-group">
                <label for="role">Role *</label>
                <select
                  v-model="formData.role"
                  id="role"
                  required
                  class="form-control"
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="responsable_stocks">Stock Manager</option>
                  <option value="responsable_employes">Employee Manager</option>
                  <option value="employe">Employee</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Employee Link -->
          <div class="form-section">
            <h3 class="section-title">👥 Link to Employee (Optional)</h3>
            
            <div class="form-group full-width">
              <label for="employee_id">Employee</label>
              <select
                v-model="formData.employee_id"
                id="employee_id"
                class="form-control"
              >
                <option :value="null">Not linked to any employee</option>
                <option 
                  v-for="employee in availableEmployees" 
                  :key="employee.id" 
                  :value="employee.id"
                >
                  {{ employee.first_name }} {{ employee.last_name }} - {{ employee.position }}
                </option>
              </select>
              <small class="form-hint">
                Linking a user to an employee allows the employee to access the system.
              </small>
            </div>
          </div>

          <!-- Account Status -->
          <div class="form-section">
            <h3 class="section-title">⚙️ Account Status</h3>
            
            <div class="form-group full-width">
              <label class="checkbox-label">
                <input
                  v-model="formData.is_active"
                  type="checkbox"
                  class="form-checkbox"
                />
                <span>Account is active</span>
              </label>
              <small class="form-hint">
                Inactive accounts cannot log in to the system.
              </small>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              ❌ Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? '⏳ Saving...' : (isEditMode ? '💾 Update User' : '✅ Add User') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal" @click.self="showDeleteModal = false">
      <div class="modal-content modal-small">
        <h2>⚠️ Confirm Deletion</h2>
        <p>Are you sure you want to delete user <strong>{{ userToDelete?.username }}</strong>?</p>
        <p class="warning-text">This action cannot be undone!</p>
        <div class="form-actions">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="handleDelete" class="btn btn-danger" :disabled="isLoading">
            {{ isLoading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toggle Status Confirmation Modal -->
    <div v-if="showToggleModal" class="modal" @click.self="showToggleModal = false">
      <div class="modal-content modal-small">
        <h2>{{ userToToggle?.is_active ? '🔒 Deactivate User' : '🔓 Activate User' }}</h2>
        <p>
          Are you sure you want to {{ userToToggle?.is_active ? 'deactivate' : 'activate' }} 
          <strong>{{ userToToggle?.username }}</strong>?
        </p>
        <div class="form-actions">
          <button @click="showToggleModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="handleToggleStatus" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Processing...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../store/users'
import { useEmployeeStore } from '../store/employees'

const userStore = useUserStore()
const employeesStore = useEmployeeStore()

// Data
const users = computed(() => userStore.getUsers)
const pagination = computed(() => userStore.getPagination)
const isLoading = computed(() => userStore.isLoadingUsers)

// Filters
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
let searchTimeout = null

// Modal state
const showModal = ref(false)
const showDeleteModal = ref(false)
const showToggleModal = ref(false)
const isEditMode = ref(false)
const userToDelete = ref(null)
const userToToggle = ref(null)

// Available employees for dropdown
const availableEmployees = ref([])

// Form data
const formData = ref({
  username: '',
  email: '',
  password: '',
  role: '',
  employee_id: null,
  is_active: true
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    userStore.fetchUsers(),
    userStore.fetchStats(),
    loadEmployees()
  ])
})

// Load employees for dropdown
const loadEmployees = async () => {
  try {
    await employeesStore.fetchEmployees({ limit: 1000 }) // Get all employees
    availableEmployees.value = employeesStore.getEmployees
  } catch (error) {
    console.error('Error loading employees:', error)
  }
}

// Methods
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    userStore.setSearchFilter(searchQuery.value)
    userStore.fetchUsers()
  }, 500)
}

const handleRoleFilter = () => {
  userStore.setRoleFilter(roleFilter.value)
  userStore.fetchUsers()
}

const handleStatusFilter = () => {
  userStore.setActiveFilter(statusFilter.value)
  userStore.fetchUsers()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  roleFilter.value = ''
  statusFilter.value = ''
  userStore.clearFilters()
  userStore.fetchUsers()
}

const goToPage = (page) => {
  userStore.setPage(page)
  userStore.fetchUsers()
}

const openAddModal = async () => {
  isEditMode.value = false
  formData.value = {
    username: '',
    email: '',
    password: '',
    role: '',
    employee_id: null,
    is_active: true
  }
  await loadEmployees() // Refresh employee list before opening modal
  showModal.value = true
}

const openEditModal = async (user) => {
  isEditMode.value = true
  formData.value = {
    id: user.id,
    username: user.username,
    email: user.email,
    password: '', // Don't prefill password
    role: user.role,
    employee_id: user.employee_id || null,
    is_active: user.is_active
  }
  await loadEmployees() // Refresh employee list before opening modal
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    username: '',
    email: '',
    password: '',
    role: '',
    employee_id: null,
    is_active: true
  }
}

const handleSubmit = async () => {
  try {
    const submitData = {
      username: formData.value.username,
      email: formData.value.email,
      role: formData.value.role,
      employee_id: formData.value.employee_id,
      is_active: formData.value.is_active
    }

    // Only include password if it's provided
    if (formData.value.password) {
      submitData.password = formData.value.password
    }

    if (isEditMode.value) {
      await userStore.updateUser(formData.value.id, submitData)
      closeModal()
      await loadEmployees() // Refresh employee list
      alert('✅ User updated successfully!')
    } else {
      // Password is required for new users
      if (!formData.value.password) {
        alert('❌ Password is required for new users')
        return
      }
      await userStore.createUser(submitData)
      closeModal()
      await loadEmployees() // Refresh employee list
      alert('✅ User created successfully!')
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    alert('❌ Error: ' + errorMessage)
    console.error('Submit error:', error)
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await userStore.deleteUser(userToDelete.value.id)
    showDeleteModal.value = false
    userToDelete.value = null
    await loadEmployees() // Refresh employee list
    alert('✅ User deleted successfully!')
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user'
    alert('❌ Error: ' + errorMessage)
  }
}

const confirmToggleStatus = (user) => {
  userToToggle.value = user
  showToggleModal.value = true
}

const handleToggleStatus = async () => {
  try {
    await userStore.toggleUserStatus(userToToggle.value.id)
    showToggleModal.value = false
    const action = userToToggle.value.is_active ? 'deactivated' : 'activated'
    userToToggle.value = null
    alert(`✅ User ${action} successfully!`)
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to toggle user status'
    alert('❌ Error: ' + errorMessage)
  }
}

// Formatting helpers
const formatRole = (role) => {
  const roleMap = {
    'admin': 'Administrator',
    'responsable_stocks': 'Stock Manager',
    'responsable_employes': 'Employee Manager',
    'user': 'User'
  }
  return roleMap[role] || role
}

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}
</script>

<style scoped>
.users-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: var(--text-color);
  margin: 0;
}

/* Stats Cards */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  border-left: 4px solid var(--primary-color);
}

.stat-card.success {
  border-left-color: #28a745;
}

.stat-card.warning {
  border-left-color: #ffc107;
}

.stat-card.info {
  border-left-color: #17a2b8;
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.stat-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Filters */
.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--bg-secondary);
  color: var(--text-color);
  cursor: pointer;
}

.btn-clear {
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: var(--bg-hover);
}

/* Table */
.table-container {
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: var(--primary-color);
  color: white;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
}

.users-table tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;
}

.users-table tbody tr:hover {
  background: var(--bg-hover);
}

.role-badge {
  display: inline-block;
  padding: 0.35rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.role-admin {
  background: #dc3545;
  color: white;
}

.role-responsable_stocks {
  background: #17a2b8;
  color: white;
}

.role-responsable_employes {
  background: #ffc107;
  color: #333;
}

.role-employe {
  background: #6c757d;
  color: white;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

.text-muted {
  color: var(--text-secondary);
  font-style: italic;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: transform 0.2s;
}

.btn-icon:hover {
  transform: scale(1.2);
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-pagination {
  padding: 0.6rem 1.2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-pagination:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: var(--text-color);
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
}

.modal-large {
  max-width: 900px;
}

.modal-small {
  max-width: 450px;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem 2rem;
  border-bottom: 2px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 16px 16px 0 0;
}

.modal-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
}

.close-button {
  background: var(--bg-hover);
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  color: var(--text-secondary);
  line-height: 1;
  padding: 0.25rem;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: var(--danger-color);
  color: white;
  transform: scale(1.1);
}

/* Form */
.user-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0 0 1.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2c3e50;
  transition: all 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.warning-text {
  color: var(--danger-color);
  font-weight: 500;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

/* Buttons */
.btn {
  padding: 0.85rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(135deg, #218838 0%, #1aa179 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  box-shadow: none;
}

.btn-secondary:hover {
  background: var(--bg-hover);
  border-color: var(--text-secondary);
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .users-table {
    font-size: 0.85rem;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.65rem 0.4rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-width: 95%;
    margin: 0.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}

/* Dark mode adjustments */
:global(.dark-mode) .form-control {
  background: #2c3e50;
  color: #ecf0f1;
  border-color: #34495e;
}

:global(.dark-mode) .form-control:focus {
  background: #34495e;
  border-color: var(--primary-color);
}
</style>


