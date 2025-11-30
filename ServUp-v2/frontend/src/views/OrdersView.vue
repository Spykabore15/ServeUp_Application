<template>
  <div class="orders-view">
    <!-- Header -->
    <div class="page-header">
      <h1>Order Management</h1>
      <button @click="openAddModal" class="btn btn-success">
        ➕ New Order
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-card">
        <h3>{{ orderStore.stats.total }}</h3>
        <p>Total Orders</p>
      </div>
      <div class="stat-card warning">
        <h3>{{ orderStore.stats.pending }}</h3>
        <p>Pending</p>
      </div>
      <div class="stat-card success">
        <h3>{{ orderStore.stats.completed }}</h3>
        <p>Completed</p>
      </div>
      <div class="stat-card danger">
        <h3>{{ orderStore.stats.cancelled }}</h3>
        <p>Cancelled</p>
      </div>
      <div class="stat-card primary">
        <h3>€{{ orderStore.stats.totalRevenue }}</h3>
        <p>Total Revenue</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <input
        v-model="searchQuery"
        @input="debounceSearch"
        type="text"
        placeholder="🔍 Search by order number..."
        class="search-input"
      />
      
      <select v-model="statusFilter" @change="applyFilters" class="filter-select">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select v-model="paymentFilter" @change="applyFilters" class="filter-select">
        <option value="">All Payment Methods</option>
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="mobile">Mobile</option>
      </select>

      <button @click="clearAllFilters" class="btn-clear">
        Clear filters
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading orders...</p>
    </div>

    <!-- Orders Table -->
    <div v-else-if="orders.length > 0" class="table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Table</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td><strong>{{ order.order_number }}</strong></td>
            <td>{{ order.customer_name || 'Walk-in' }}</td>
            <td>{{ order.table_number || '-' }}</td>
            <td>{{ order.items?.length || 0 }} items</td>
            <td><strong>€{{ parseFloat(order.total_amount).toFixed(2) }}</strong></td>
            <td>
              <span class="payment-badge">{{ formatPaymentMethod(order.payment_method) }}</span>
            </td>
            <td>
              <span class="status-badge" :class="getStatusClass(order.status)">
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td class="actions-cell">
              <button 
                @click="viewOrderDetails(order)" 
                class="btn-icon view-btn"
                title="View Details"
              >
                👁️
              </button>
              <button 
                @click="openEditModal(order)" 
                class="btn-icon edit-btn"
                title="Edit Status"
              >
                ✏️
              </button>
              <button 
                v-if="canDelete"
                @click="confirmDelete(order)" 
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
      <p>🛒 No orders found</p>
      <button @click="openAddModal" class="btn btn-primary">
        Create first order
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

    <!-- View Details Modal -->
    <div v-if="showDetailsModal" class="modal" @click.self="showDetailsModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h2>📋 Order Details - {{ selectedOrder?.order_number }}</h2>
          <button @click="showDetailsModal = false" class="close-button">&times;</button>
        </div>

        <div class="order-details" v-if="selectedOrder">
          <div class="detail-section">
            <h3>Order Information</h3>
            <div class="detail-grid">
              <div><strong>Customer:</strong> {{ selectedOrder.customer_name || 'Walk-in' }}</div>
              <div><strong>Table:</strong> {{ selectedOrder.table_number || 'N/A' }}</div>
              <div><strong>Server:</strong> {{ getServerName(selectedOrder) }}</div>
              <div><strong>Status:</strong> 
                <span class="status-badge" :class="getStatusClass(selectedOrder.status)">
                  {{ formatStatus(selectedOrder.status) }}
                </span>
              </div>
              <div><strong>Payment:</strong> {{ formatPaymentMethod(selectedOrder.payment_method) }}</div>
              <div><strong>Date:</strong> {{ formatDate(selectedOrder.created_at) }}</div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td>{{ item.product?.name || 'Unknown' }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>€{{ parseFloat(item.price).toFixed(2) }}</td>
                  <td><strong>€{{ (item.quantity * item.price).toFixed(2) }}</strong></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3"><strong>Total:</strong></td>
                  <td><strong class="total-amount">€{{ parseFloat(selectedOrder.total_amount).toFixed(2) }}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Status Modal -->
    <div v-if="showEditModal" class="modal" @click.self="closeEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>✏️ Update Order Status</h2>
          <button @click="closeEditModal" class="close-button">&times;</button>
        </div>

        <form @submit.prevent="handleUpdateStatus" class="order-form">
          <div class="form-group">
            <label for="status">Status *</label>
            <select
              v-model="editFormData.status"
              id="status"
              required
              class="form-control"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeEditModal" class="btn btn-secondary">
              ❌ Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? '⏳ Updating...' : '💾 Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal" @click.self="showDeleteModal = false">
      <div class="modal-content modal-small">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete order <strong>{{ orderToDelete?.order_number }}</strong>?</p>
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
import { useOrderStore } from '../store/orders'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const orderStore = useOrderStore()
const authStore = useAuthStore()
const router = useRouter()

// Permissions
const canDelete = computed(() => authStore.userRole === 'admin')

// Data
const orders = computed(() => orderStore.getOrders)
const pagination = computed(() => orderStore.getPagination)
const isLoading = computed(() => orderStore.isLoadingOrders)

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const paymentFilter = ref('')
let searchTimeout = null

// Modal state
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedOrder = ref(null)
const orderToDelete = ref(null)

// Form data
const editFormData = ref({
  id: null,
  status: ''
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    orderStore.fetchOrders(),
    orderStore.fetchStats()
  ])
})

// Methods
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    orderStore.setSearchFilter(searchQuery.value)
    orderStore.fetchOrders()
  }, 500)
}

const applyFilters = () => {
  orderStore.setStatusFilter(statusFilter.value)
  orderStore.setPaymentMethodFilter(paymentFilter.value)
  orderStore.fetchOrders()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  paymentFilter.value = ''
  orderStore.clearFilters()
  orderStore.fetchOrders()
}

const goToPage = (page) => {
  orderStore.setPage(page)
  orderStore.fetchOrders()
}

const openAddModal = () => {
  // Navigate to a separate create order page (more complex UI needed)
  alert('💡 Tip: Create order functionality requires a more complex UI. Coming soon!')
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const openEditModal = (order) => {
  editFormData.value = {
    id: order.id,
    status: order.status
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editFormData.value = {
    id: null,
    status: ''
  }
}

const handleUpdateStatus = async () => {
  try {
    await orderStore.updateOrder(editFormData.value.id, {
      status: editFormData.value.status
    })
    closeEditModal()
    alert('✅ Order status updated successfully!')
  } catch (error) {
    alert('❌ Error: ' + (error.response?.data?.message || error.message))
  }
}

const confirmDelete = (order) => {
  orderToDelete.value = order
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await orderStore.deleteOrder(orderToDelete.value.id)
    showDeleteModal.value = false
    orderToDelete.value = null
    alert('✅ Order deleted successfully!')
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete order'
    alert('❌ Error: ' + errorMessage)
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatStatus = (status) => {
  if (!status) return 'N/A'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatPaymentMethod = (method) => {
  if (!method) return 'N/A'
  return method.charAt(0).toUpperCase() + method.slice(1)
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'status-pending',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  }
  return classes[status] || ''
}

const getServerName = (order) => {
  if (order.server) {
    return `${order.server.first_name} ${order.server.last_name}`
  }
  return 'N/A'
}
</script>

<style scoped>
.orders-view {
  max-width: 1600px;
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

.stat-card.primary {
  border-left-color: #007bff;
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

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table thead {
  background: var(--primary-color);
  color: white;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  text-align: left;
}

.orders-table tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;
}

.orders-table tbody tr:hover {
  background: var(--bg-hover);
}

.status-badge, .payment-badge {
  display: inline-block;
  padding: 0.35rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.payment-badge {
  background: #e7f3ff;
  color: #0066cc;
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

/* Order Details */
.order-details {
  padding: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  margin: 0 0 1rem 0;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.items-table th,
.items-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.items-table thead {
  background: var(--bg-hover);
}

.items-table tfoot {
  font-weight: bold;
  background: var(--bg-hover);
}

.total-amount {
  color: var(--primary-color);
  font-size: 1.2rem;
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
  max-width: 600px;
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
.order-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
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

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .orders-table {
    font-size: 0.85rem;
  }
  
  .orders-table th,
  .orders-table td {
    padding: 0.65rem 0.4rem;
  }

  .detail-grid {
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
</style>
