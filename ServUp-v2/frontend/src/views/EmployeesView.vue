<template>
  <div class="employees-view">
    <!-- Header -->
    <div class="page-header">
      <h1>Employee Management</h1>
      <button 
        v-if="canManage" 
        @click="openAddModal" 
        class="btn btn-success"
      >
        ➕ Add Employee
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-card">
        <h3>{{ employeeStore.stats.total }}</h3>
        <p>Total Employees</p>
      </div>
      <div class="stat-card success">
        <h3>{{ employeeStore.stats.active }}</h3>
        <p>Active</p>
      </div>
      <div class="stat-card warning">
        <h3>{{ employeeStore.stats.on_leave }}</h3>
        <p>On Leave</p>
      </div>
      <div class="stat-card danger">
        <h3>{{ employeeStore.stats.inactive }}</h3>
        <p>Inactive</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <input
        v-model="searchQuery"
        @input="debounceSearch"
        type="text"
        placeholder="🔍 Search by name, email, or phone..."
        class="search-input"
      />
      
      <select v-model="statusFilter" @change="applyFilters" class="filter-select">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="on_leave">On Leave</option>
      </select>

      <button @click="clearAllFilters" class="btn-clear">
        Clear filters
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading employees...</p>
    </div>

    <!-- Employees Table -->
    <div v-else-if="employees.length > 0" class="table-container">
      <table class="employees-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Hire Date</th>
            <th>Status</th>
            <th v-if="canManage">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>
              <strong>{{ employee.first_name }} {{ employee.last_name }}</strong>
            </td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.phone }}</td>
            <td>{{ employee.position }}</td>
            <td>{{ formatDate(employee.hire_date) }}</td>
            <td>
              <span 
                class="status-badge" 
                :class="getStatusClass(employee.status)"
              >
                {{ formatStatus(employee.status) }}
              </span>
            </td>
            <td v-if="canManage" class="actions-cell">
              <button 
                @click="openEditModal(employee)" 
                class="btn-icon edit-btn"
                title="Edit"
              >
                ✏️
              </button>
              <button 
                v-if="canDelete"
                @click="confirmDelete(employee)" 
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
      <p>📋 No employees found</p>
      <button v-if="canManage" @click="openAddModal" class="btn btn-primary">
        Add first employee
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
          <h2>{{ isEditMode ? '✏️ Edit Employee' : '➕ Add New Employee' }}</h2>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>

        <form @submit.prevent="handleSubmit" class="employee-form">
          <!-- Personal Information Section -->
          <div class="form-section">
            <h3 class="section-title">👤 Personal Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="first_name">First Name *</label>
                <input
                  v-model="formData.first_name"
                  id="first_name"
                  type="text"
                  required
                  class="form-control"
                  placeholder="e.g., John"
                />
              </div>

              <div class="form-group">
                <label for="last_name">Last Name *</label>
                <input
                  v-model="formData.last_name"
                  id="last_name"
                  type="text"
                  required
                  class="form-control"
                  placeholder="e.g., Doe"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  v-model="formData.email"
                  id="email"
                  type="email"
                  required
                  class="form-control"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div class="form-group">
                <label for="phone">Phone *</label>
                <input
                  v-model="formData.phone"
                  id="phone"
                  type="tel"
                  required
                  class="form-control"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div class="form-group full-width">
              <label for="address">Address</label>
              <textarea
                v-model="formData.address"
                id="address"
                rows="2"
                class="form-control"
                placeholder="123 Main Street, City, State, ZIP"
              ></textarea>
            </div>
          </div>

          <!-- Employment Details Section -->
          <div class="form-section">
            <h3 class="section-title">💼 Employment Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="position">Position *</label>
                <input
                  v-model="formData.position"
                  id="position"
                  type="text"
                  required
                  class="form-control"
                  placeholder="e.g., Head Chef, Waiter, Manager"
                />
              </div>

              <div class="form-group">
                <label for="hire_date">Hire Date *</label>
                <input
                  v-model="formData.hire_date"
                  id="hire_date"
                  type="date"
                  required
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="salary">Monthly Salary (€)</label>
                <input
                  v-model.number="formData.salary"
                  id="salary"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-control"
                  placeholder="2500.00"
                />
              </div>

              <div class="form-group">
                <label for="status">Employment Status *</label>
                <select
                  v-model="formData.status"
                  id="status"
                  required
                  class="form-control"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Emergency Contact Section -->
          <div class="form-section">
            <h3 class="section-title">🚨 Emergency Contact</h3>
            <div class="form-group full-width">
              <label for="emergency_contact">Contact Details</label>
              <input
                v-model="formData.emergency_contact"
                id="emergency_contact"
                type="text"
                class="form-control"
                placeholder="e.g., Jane Doe - Mother - +1 234 567 8901"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              ❌ Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? '⏳ Saving...' : (isEditMode ? '💾 Update Employee' : '✅ Add Employee') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal" @click.self="showDeleteModal = false">
      <div class="modal-content modal-small">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete <strong>{{ employeeToDelete?.first_name }} {{ employeeToDelete?.last_name }}</strong>?</p>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEmployeeStore } from '../store/employees'
import { useAuthStore } from '../store/auth'

const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

// Permissions
const canManage = computed(() => ['admin', 'responsable_employes'].includes(authStore.userRole))
const canDelete = computed(() => authStore.userRole === 'admin')

// Data
const employees = computed(() => employeeStore.getEmployees)
const pagination = computed(() => employeeStore.getPagination)
const isLoading = computed(() => employeeStore.isLoadingEmployees)

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
let searchTimeout = null

// Modal state
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const employeeToDelete = ref(null)

// Form data
const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  hire_date: '',
  salary: null,
  status: 'active',
  address: '',
  emergency_contact: ''
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    employeeStore.fetchEmployees(),
    employeeStore.fetchStats()
  ])
})

// Methods
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    employeeStore.setSearchFilter(searchQuery.value)
    employeeStore.fetchEmployees()
  }, 500)
}

const applyFilters = () => {
  employeeStore.setStatusFilter(statusFilter.value)
  employeeStore.fetchEmployees()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  employeeStore.clearFilters()
  employeeStore.fetchEmployees()
}

const goToPage = (page) => {
  employeeStore.setPage(page)
  employeeStore.fetchEmployees()
}

const openAddModal = () => {
  isEditMode.value = false
  formData.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    hire_date: '',
    salary: null,
    status: 'active',
    address: '',
    emergency_contact: ''
  }
  showModal.value = true
}

const openEditModal = (employee) => {
  isEditMode.value = true
  formData.value = {
    id: employee.id,
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone,
    position: employee.position,
    hire_date: employee.hire_date,
    salary: employee.salary,
    status: employee.status,
    address: employee.address || '',
    emergency_contact: employee.emergency_contact || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    hire_date: '',
    salary: null,
    status: 'active',
    address: '',
    emergency_contact: ''
  }
}

const handleSubmit = async () => {
  try {
    // Clean up the form data before submitting
    const cleanedData = {
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      email: formData.value.email,
      phone: formData.value.phone,
      position: formData.value.position,
      hire_date: formData.value.hire_date,
      status: formData.value.status,
      salary: formData.value.salary || null,
      address: formData.value.address || null,
      emergency_contact: formData.value.emergency_contact || null
    };

    if (isEditMode.value) {
      await employeeStore.updateEmployee(formData.value.id, cleanedData)
      closeModal()
      alert('✅ Employee updated successfully!')
    } else {
      await employeeStore.createEmployee(cleanedData)
      closeModal()
      alert('✅ Employee created successfully!')
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    alert('❌ Error: ' + errorMessage)
    console.error('Submit error:', error)
  }
}

const confirmDelete = (employee) => {
  employeeToDelete.value = employee
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    console.log('🗑️ View: Attempting to delete employee:', employeeToDelete.value);
    await employeeStore.deleteEmployee(employeeToDelete.value.id)
    showDeleteModal.value = false
    employeeToDelete.value = null
    alert('✅ Employee deleted successfully!')
  } catch (error) {
    console.error('❌ View: Delete failed:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete employee'
    alert('❌ Error: ' + errorMessage)
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusClass = (status) => {
  const classes = {
    active: 'status-active',
    inactive: 'status-inactive',
    on_leave: 'status-leave'
  }
  return classes[status] || ''
}
</script>

<style scoped>
.employees-view {
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

.stat-card.danger {
  border-left-color: #dc3545;
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
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 1rem;
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

.employees-table {
  width: 100%;
  border-collapse: collapse;
}

.employees-table thead {
  background: var(--primary-color);
  color: white;
}

.employees-table th,
.employees-table td {
  padding: 1rem;
  text-align: left;
}

.employees-table tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;
}

.employees-table tbody tr:hover {
  background: var(--bg-hover);
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

.status-leave {
  background: #fff3cd;
  color: #856404;
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
  color: var(--text-color);
  background: var(--danger-color);
  color: white;
  transform: scale(1.1);
}

/* Form */
.employee-form {
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

.form-control::placeholder {
  color: #95a5a6;
  opacity: 0.8;
  font-size: 0.95rem;
}

/* Dark mode specific input styling */
:global(.dark-mode) .form-control {
  background: #2c3e50;
  color: #ecf0f1;
  border-color: #34495e;
}

:global(.dark-mode) .form-control::placeholder {
  color: #7f8c8d;
  opacity: 0.9;
}

:global(.dark-mode) .form-control:focus {
  background: #34495e;
  border-color: var(--primary-color);
}

textarea.form-control {
  resize: vertical;
  font-family: inherit;
}

select.form-control {
  cursor: pointer;
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

.btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .employees-table {
    font-size: 0.85rem;
  }
  
  .employees-table th,
  .employees-table td {
    padding: 0.65rem 0.4rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-width: 95%;
    margin: 0.5rem;
  }

  .modal-header {
    padding: 1.25rem 1.5rem;
  }

  .modal-header h2 {
    font-size: 1.25rem;
  }

  .employee-form {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
