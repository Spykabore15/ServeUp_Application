<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1>👋 Welcome back, {{ authStore.userName }}!</h1>
        <p class="subtitle">Here's what's happening with your restaurant today</p>
      </div>
      <button @click="refreshDashboard" class="btn btn-refresh" :disabled="isLoading">
        <span v-if="!isLoading">🔄 Refresh</span>
        <span v-else>⏳ Loading...</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !stats.overview.totalProducts" class="loading-state">
      <p>Loading dashboard...</p>
    </div>

    <!-- Main Dashboard Content -->
    <div v-else class="dashboard-content">
      <!-- Statistics Cards -->
      <div class="stats-grid">
        <!-- Total Products Card -->
        <div class="stat-card primary">
          <div class="stat-icon">📦</div>
          <div class="stat-details">
            <h3>{{ stats.overview.totalProducts }}</h3>
            <p>Total Products</p>
            <span v-if="stats.overview.lowStockProducts > 0" class="stat-alert">
              ⚠️ {{ stats.overview.lowStockProducts }} low stock
            </span>
          </div>
        </div>

        <!-- Total Orders Card -->
        <div class="stat-card success">
          <div class="stat-icon">🛒</div>
          <div class="stat-details">
            <h3>{{ stats.overview.totalOrders }}</h3>
            <p>Total Orders</p>
            <span v-if="stats.overview.pendingOrders > 0" class="stat-badge">
              {{ stats.overview.pendingOrders }} pending
            </span>
          </div>
        </div>

        <!-- Total Employees Card -->
        <div class="stat-card info">
          <div class="stat-icon">👥</div>
          <div class="stat-details">
            <h3>{{ stats.overview.totalEmployees }}</h3>
            <p>Total Employees</p>
            <span class="stat-badge">
              {{ stats.overview.activeEmployees }} active
            </span>
          </div>
        </div>

        <!-- Total Revenue Card -->
        <div class="stat-card warning">
          <div class="stat-icon">💰</div>
          <div class="stat-details">
            <h3>${{ formatCurrency(stats.overview.totalRevenue) }}</h3>
            <p>Total Revenue</p>
            <span class="stat-badge">
              {{ stats.overview.totalSuppliers }} suppliers
            </span>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="dashboard-grid">
        <!-- Left Column -->
        <div class="dashboard-column">
          <!-- Recent Orders -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2>📋 Recent Orders</h2>
              <router-link to="/orders" class="card-link">View All →</router-link>
            </div>
            <div class="card-body">
              <div v-if="stats.recentOrders.length === 0" class="empty-state">
                <p>No recent orders</p>
              </div>
              <div v-else class="orders-list">
                <div 
                  v-for="order in stats.recentOrders" 
                  :key="order.id" 
                  class="order-item"
                >
                  <div class="order-info">
                    <strong>{{ order.order_number }}</strong>
                    <span class="order-meta">{{ formatDate(order.created_at) }}</span>
                  </div>
                  <div class="order-details">
                    <span :class="`status-badge status-${order.status}`">
                      {{ formatStatus(order.status) }}
                    </span>
                    <span class="order-amount">${{ formatCurrency(order.total_amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Low Stock Alert -->
          <div class="dashboard-card alert-card">
            <div class="card-header">
              <h2>⚠️ Low Stock Alert</h2>
              <router-link to="/products" class="card-link">Manage Stock →</router-link>
            </div>
            <div class="card-body">
              <div v-if="stats.lowStockItems.length === 0" class="empty-state success">
                <p>✅ All products are well stocked!</p>
              </div>
              <div v-else class="stock-list">
                <div 
                  v-for="item in stats.lowStockItems" 
                  :key="item.id" 
                  class="stock-item"
                >
                  <div class="stock-info">
                    <strong>{{ item.name }}</strong>
                    <span class="stock-unit">{{ item.unit }}</span>
                  </div>
                  <div class="stock-quantity" :class="{ 'critical': item.quantity < 5 }">
                    {{ item.quantity }} left
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="dashboard-column">
          <!-- Quick Actions -->
          <div class="dashboard-card quick-actions-card">
            <div class="card-header">
              <h2>⚡ Quick Actions</h2>
            </div>
            <div class="card-body">
              <div class="quick-actions-grid">
                <router-link to="/products" class="quick-action" v-if="canManageProducts">
                  <div class="action-icon">📦</div>
                  <span>Add Product</span>
                </router-link>
                <router-link to="/orders" class="quick-action" v-if="canManageOrders">
                  <div class="action-icon">🛒</div>
                  <span>New Order</span>
                </router-link>
                <router-link to="/employees" class="quick-action" v-if="canManageEmployees">
                  <div class="action-icon">👤</div>
                  <span>Add Employee</span>
                </router-link>
                <router-link to="/suppliers" class="quick-action" v-if="canManageSuppliers">
                  <div class="action-icon">🏢</div>
                  <span>Add Supplier</span>
                </router-link>
                <router-link to="/reports" class="quick-action">
                  <div class="action-icon">📊</div>
                  <span>View Reports</span>
                </router-link>
                <router-link to="/settings" class="quick-action">
                  <div class="action-icon">⚙️</div>
                  <span>Settings</span>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2>🕒 Recent Activity</h2>
            </div>
            <div class="card-body">
              <div v-if="recentActivity.length === 0" class="empty-state">
                <p>No recent activity</p>
              </div>
              <div v-else class="activity-list">
                <div 
                  v-for="(activity, index) in recentActivity" 
                  :key="index" 
                  class="activity-item"
                >
                  <div class="activity-icon">{{ activity.icon }}</div>
                  <div class="activity-details">
                    <strong>{{ activity.title }}</strong>
                    <p>{{ activity.description }}</p>
                    <span class="activity-meta">{{ formatDate(activity.timestamp) }} • {{ activity.user }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { useDashboardStore } from '../store/dashboard'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

// Computed properties
const stats = computed(() => dashboardStore.getStats)
const recentActivity = computed(() => dashboardStore.getRecentActivity)
const isLoading = computed(() => dashboardStore.isLoadingStats)

// Role-based permissions
const canManageProducts = computed(() => {
  const role = authStore.userRole
  return ['admin', 'responsable_stocks'].includes(role)
})

const canManageOrders = computed(() => {
  const role = authStore.userRole
  return ['admin', 'responsable_stocks', 'employe'].includes(role)
})

const canManageEmployees = computed(() => {
  const role = authStore.userRole
  return ['admin', 'responsable_employes'].includes(role)
})

const canManageSuppliers = computed(() => {
  const role = authStore.userRole
  return ['admin', 'responsable_stocks'].includes(role)
})

// Methods
const refreshDashboard = async () => {
  await dashboardStore.refreshDashboard()
}

const formatCurrency = (value) => {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatStatus = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'processing': 'Processing',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return statusMap[status] || status
}

// Lifecycle
onMounted(async () => {
  await dashboardStore.refreshDashboard()
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.subtitle {
  color: #6c757d;
  font-size: 1rem;
}

.btn-refresh {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

/* Statistics Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  min-width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.1);
}

.stat-card.primary .stat-icon {
  background: rgba(102, 126, 234, 0.1);
}

.stat-card.success .stat-icon {
  background: rgba(40, 167, 69, 0.1);
}

.stat-card.info .stat-icon {
  background: rgba(23, 162, 184, 0.1);
}

.stat-card.warning .stat-icon {
  background: rgba(255, 193, 7, 0.1);
}

.stat-details {
  flex: 1;
}

.stat-details h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.stat-details p {
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
}

.stat-alert {
  display: inline-block;
  background: #fff3cd;
  color: #856404;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.stat-badge {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Dashboard Cards */
.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.card-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.card-link:hover {
  color: #764ba2;
}

.card-body {
  padding: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-state.success {
  color: #28a745;
  font-weight: 500;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.2s;
}

.order-item:hover {
  background: #e9ecef;
}

.order-info strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.order-meta {
  font-size: 0.85rem;
  color: #6c757d;
}

.order-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #cfe2ff;
  color: #084298;
}

.status-completed {
  background: #d1e7dd;
  color: #0a3622;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-amount {
  font-weight: 600;
  color: #28a745;
}

/* Stock List */
.stock-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.stock-info strong {
  display: block;
  color: #2c3e50;
}

.stock-unit {
  font-size: 0.85rem;
  color: #6c757d;
}

.stock-quantity {
  font-weight: 600;
  color: #ffc107;
  padding: 0.35rem 0.75rem;
  background: #fff3cd;
  border-radius: 12px;
  font-size: 0.9rem;
}

.stock-quantity.critical {
  color: #dc3545;
  background: #f8d7da;
}

/* Quick Actions */
.quick-actions-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quick-actions-card .card-header {
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.quick-actions-card .card-header h2 {
  color: white;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.quick-action {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 1.5rem 1rem;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  color: white;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.quick-action:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.quick-action span {
  display: block;
  font-weight: 500;
  font-size: 0.95rem;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.activity-icon {
  font-size: 1.5rem;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
}

.activity-details {
  flex: 1;
}

.activity-details strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.activity-details p {
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.activity-meta {
  font-size: 0.8rem;
  color: #adb5bd;
}

/* Dark Mode Support */
.dark-mode .dashboard-header h1,
.dark-mode .stat-card,
.dark-mode .dashboard-card,
.dark-mode .order-item,
.dark-mode .stock-item,
.dark-mode .activity-item {
  background: #2d3748;
  color: #e2e8f0;
}

.dark-mode .stat-details h3,
.dark-mode .order-info strong,
.dark-mode .stock-info strong,
.dark-mode .activity-details strong {
  color: #e2e8f0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
