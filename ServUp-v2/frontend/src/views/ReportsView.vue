<template>
  <div class="reports-view">
    <div class="page-header">
      <div class="header-content">
        <h1>📊 Reports & Analytics</h1>
        <p class="page-subtitle">Insights and performance metrics</p>
      </div>
      <button @click="refreshAllData" class="btn-refresh" :disabled="isLoading">
        <span v-if="isLoading">🔄 Loading...</span>
        <span v-else>🔄 Refresh</span>
      </button>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert error">
      <span class="alert-icon">❌</span>
      <span>{{ errorMessage }}</span>
      <button @click="errorMessage = ''" class="close-btn">&times;</button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading analytics data...</p>
    </div>

    <!-- Sales Analytics -->
    <div v-else-if="activeTab === 'sales'" class="tab-content">
      <div class="date-filter">
        <div class="filter-group">
          <label>Start Date:</label>
          <input v-model="salesFilters.startDate" type="date" class="date-input" @change="loadSalesData" />
        </div>
        <div class="filter-group">
          <label>End Date:</label>
          <input v-model="salesFilters.endDate" type="date" class="date-input" @change="loadSalesData" />
        </div>
        <button @click="clearDateFilters" class="btn-clear">Clear Filters</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>{{ salesData.totalRevenue }} €</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div class="stat-card success">
          <div class="stat-icon">🛒</div>
          <div class="stat-content">
            <h3>{{ salesData.totalOrders }}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div class="stat-card info">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ salesData.avgOrderValue }} €</h3>
            <p>Avg Order Value</p>
          </div>
        </div>
      </div>

      <div class="chart-container">
        <h3>Daily Revenue Trend (Last 30 Days)</h3>
        <canvas ref="salesChart"></canvas>
      </div>
    </div>

    <!-- Inventory Analytics -->
    <div v-else-if="activeTab === 'inventory'" class="tab-content">
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h3>{{ inventoryData.totalProducts }}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div class="stat-card success">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ inventoryData.inStock }}</h3>
            <p>In Stock</p>
          </div>
        </div>
        <div class="stat-card warning">
          <div class="stat-icon">⚠️</div>
          <div class="stat-content">
            <h3>{{ inventoryData.lowStock }}</h3>
            <p>Low Stock</p>
          </div>
        </div>
        <div class="stat-card danger">
          <div class="stat-icon">🚫</div>
          <div class="stat-content">
            <h3>{{ inventoryData.outOfStock }}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <div class="chart-container half">
          <h3>Products by Category</h3>
          <canvas ref="categoryChart"></canvas>
        </div>
        <div class="chart-container half">
          <h3>Products by Supplier</h3>
          <canvas ref="supplierProductsChart"></canvas>
        </div>
      </div>

      <div class="stat-card info single">
        <div class="stat-icon">💵</div>
        <div class="stat-content">
          <h3>{{ inventoryData.inventoryValue }} €</h3>
          <p>Total Inventory Value</p>
        </div>
      </div>
    </div>

    <!-- Employee Analytics -->
    <div v-else-if="activeTab === 'employees'" class="tab-content">
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ employeeData.totalEmployees }}</h3>
            <p>Total Employees</p>
          </div>
        </div>
        <div class="stat-card success">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ employeeData.activeEmployees }}</h3>
            <p>Active</p>
          </div>
        </div>
        <div class="stat-card warning">
          <div class="stat-icon">🏖️</div>
          <div class="stat-content">
            <h3>{{ employeeData.onLeaveEmployees }}</h3>
            <p>On Leave</p>
          </div>
        </div>
        <div class="stat-card danger">
          <div class="stat-icon">❌</div>
          <div class="stat-content">
            <h3>{{ employeeData.inactiveEmployees }}</h3>
            <p>Inactive</p>
          </div>
        </div>
      </div>

      <div class="chart-container">
        <h3>Employees by Position</h3>
        <canvas ref="positionChart"></canvas>
      </div>

      <div class="stat-card info single">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>{{ employeeData.avgSalary }} €</h3>
          <p>Average Salary</p>
        </div>
      </div>
    </div>

    <!-- Supplier Analytics -->
    <div v-else-if="activeTab === 'suppliers'" class="tab-content">
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">🚚</div>
          <div class="stat-content">
            <h3>{{ supplierData.totalSuppliers }}</h3>
            <p>Total Suppliers</p>
          </div>
        </div>
        <div class="stat-card success">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ supplierData.activeSuppliers }}</h3>
            <p>Active</p>
          </div>
        </div>
        <div class="stat-card danger">
          <div class="stat-icon">❌</div>
          <div class="stat-content">
            <h3>{{ supplierData.inactiveSuppliers }}</h3>
            <p>Inactive</p>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <div class="chart-container half">
          <h3>Suppliers by Rating</h3>
          <canvas ref="ratingChart"></canvas>
        </div>
        <div class="chart-container half">
          <h3>Top 10 Suppliers by Products</h3>
          <canvas ref="topSuppliersChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import reportService from '../services/reportService';

// Register Chart.js components
Chart.register(...registerables);

// Tab configuration
const tabs = [
  { id: 'sales', label: 'Sales', icon: '💰' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'employees', label: 'Employees', icon: '👥' },
  { id: 'suppliers', label: 'Suppliers', icon: '🚚' }
];

// State
const activeTab = ref('sales');
const isLoading = ref(false);
const errorMessage = ref('');

// Sales data
const salesData = ref({
  totalRevenue: '0.00',
  totalOrders: 0,
  avgOrderValue: '0.00',
  revenueData: []
});

const salesFilters = ref({
  startDate: '',
  endDate: ''
});

// Inventory data
const inventoryData = ref({
  totalProducts: 0,
  inStock: 0,
  lowStock: 0,
  outOfStock: 0,
  categoryData: [],
  supplierData: [],
  inventoryValue: '0.00'
});

// Employee data
const employeeData = ref({
  totalEmployees: 0,
  activeEmployees: 0,
  inactiveEmployees: 0,
  onLeaveEmployees: 0,
  positionData: [],
  avgSalary: '0.00'
});

// Supplier data
const supplierData = ref({
  totalSuppliers: 0,
  activeSuppliers: 0,
  inactiveSuppliers: 0,
  ratingData: [],
  topSuppliers: []
});

// Chart refs
const salesChart = ref(null);
const categoryChart = ref(null);
const supplierProductsChart = ref(null);
const positionChart = ref(null);
const ratingChart = ref(null);
const topSuppliersChart = ref(null);

// Chart instances
let salesChartInstance = null;
let categoryChartInstance = null;
let supplierProductsChartInstance = null;
let positionChartInstance = null;
let ratingChartInstance = null;
let topSuppliersChartInstance = null;

// Load sales data
const loadSalesData = async () => {
  try {
    const response = await reportService.getSalesAnalytics(
      salesFilters.value.startDate || null,
      salesFilters.value.endDate || null
    );
    
    if (response.success) {
      salesData.value = response.data;
      await nextTick();
      renderSalesChart();
    }
  } catch (error) {
    console.error('Error loading sales data:', error);
    errorMessage.value = 'Failed to load sales analytics. Please try again.';
  }
};

// Load inventory data
const loadInventoryData = async () => {
  try {
    const response = await reportService.getInventoryAnalytics();
    
    if (response.success) {
      inventoryData.value = response.data;
      await nextTick();
      renderInventoryCharts();
    }
  } catch (error) {
    console.error('Error loading inventory data:', error);
    errorMessage.value = 'Failed to load inventory analytics. Please try again.';
  }
};

// Load employee data
const loadEmployeeData = async () => {
  try {
    const response = await reportService.getEmployeeAnalytics();
    
    if (response.success) {
      employeeData.value = response.data;
      await nextTick();
      renderEmployeeCharts();
    }
  } catch (error) {
    console.error('Error loading employee data:', error);
    errorMessage.value = 'Failed to load employee analytics. Please try again.';
  }
};

// Load supplier data
const loadSupplierData = async () => {
  try {
    const response = await reportService.getSupplierAnalytics();
    
    if (response.success) {
      supplierData.value = response.data;
      await nextTick();
      renderSupplierCharts();
    }
  } catch (error) {
    console.error('Error loading supplier data:', error);
    errorMessage.value = 'Failed to load supplier analytics. Please try again.';
  }
};

// Load data based on active tab
const loadData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    switch (activeTab.value) {
      case 'sales':
        await loadSalesData();
        break;
      case 'inventory':
        await loadInventoryData();
        break;
      case 'employees':
        await loadEmployeeData();
        break;
      case 'suppliers':
        await loadSupplierData();
        break;
    }
  } finally {
    isLoading.value = false;
  }
};

// Refresh all data
const refreshAllData = async () => {
  await loadData();
};

// Clear date filters
const clearDateFilters = () => {
  salesFilters.value.startDate = '';
  salesFilters.value.endDate = '';
  loadSalesData();
};

// Render sales chart
const renderSalesChart = () => {
  if (salesChartInstance) {
    salesChartInstance.destroy();
  }

  if (!salesChart.value || !salesData.value.revenueData.length) return;

  const ctx = salesChart.value.getContext('2d');
  salesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: salesData.value.revenueData.map(item => item.date),
      datasets: [
        {
          label: 'Revenue (€)',
          data: salesData.value.revenueData.map(item => item.revenue),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Orders',
          data: salesData.value.revenueData.map(item => item.orderCount),
          borderColor: '#48bb78',
          backgroundColor: 'rgba(72, 187, 120, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Revenue (€)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Orders'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
};

// Render inventory charts
const renderInventoryCharts = () => {
  // Destroy existing charts
  if (categoryChartInstance) categoryChartInstance.destroy();
  if (supplierProductsChartInstance) supplierProductsChartInstance.destroy();

  // Category chart
  if (categoryChart.value && inventoryData.value.categoryData.length) {
    const ctx = categoryChart.value.getContext('2d');
    categoryChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: inventoryData.value.categoryData.map(item => item.category),
        datasets: [{
          data: inventoryData.value.categoryData.map(item => item.count),
          backgroundColor: [
            '#667eea', '#48bb78', '#f6ad55', '#fc8181', '#63b3ed', '#9f7aea'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Supplier products chart
  if (supplierProductsChart.value && inventoryData.value.supplierData.length) {
    const ctx = supplierProductsChart.value.getContext('2d');
    supplierProductsChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: inventoryData.value.supplierData.map(item => item.supplier),
        datasets: [{
          label: 'Products',
          data: inventoryData.value.supplierData.map(item => item.count),
          backgroundColor: '#667eea'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};

// Render employee charts
const renderEmployeeCharts = () => {
  if (positionChartInstance) positionChartInstance.destroy();

  if (positionChart.value && employeeData.value.positionData.length) {
    const ctx = positionChart.value.getContext('2d');
    positionChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: employeeData.value.positionData.map(item => item.position),
        datasets: [{
          label: 'Employees',
          data: employeeData.value.positionData.map(item => item.count),
          backgroundColor: '#667eea'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};

// Render supplier charts
const renderSupplierCharts = () => {
  if (ratingChartInstance) ratingChartInstance.destroy();
  if (topSuppliersChartInstance) topSuppliersChartInstance.destroy();

  // Rating chart
  if (ratingChart.value && supplierData.value.ratingData.length) {
    const ctx = ratingChart.value.getContext('2d');
    ratingChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: supplierData.value.ratingData.map(item => `${item.rating} ⭐`),
        datasets: [{
          data: supplierData.value.ratingData.map(item => item.count),
          backgroundColor: [
            '#48bb78', '#68d391', '#9ae6b4', '#c6f6d5', '#f0fff4'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Top suppliers chart
  if (topSuppliersChart.value && supplierData.value.topSuppliers.length) {
    const ctx = topSuppliersChart.value.getContext('2d');
    topSuppliersChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: supplierData.value.topSuppliers.map(item => item.supplier),
        datasets: [{
          label: 'Products Supplied',
          data: supplierData.value.topSuppliers.map(item => item.productCount),
          backgroundColor: '#667eea'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }
};

// Watch active tab changes
watch(activeTab, () => {
  loadData();
});

// Initialize on mount
onMounted(() => {
  // Load data for the first tab after a short delay
  setTimeout(() => {
    loadData();
  }, 300);
});
</script>

<style scoped>
.reports-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
}

.header-content h1 {
  font-size: 2.5rem;
  color: var(--text-color-primary);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: var(--text-color-secondary);
  font-size: 1.1rem;
  margin: 0;
}

.btn-refresh {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-refresh:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: var(--bg-secondary);
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-button {
  flex: 1;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background: var(--bg-hover);
  color: var(--text-color-primary);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #667eea;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.alert.error {
  background-color: #fff5f5;
  border: 1px solid #fc8181;
  color: #c53030;
}

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
}

.close-btn:hover {
  opacity: 1;
}

/* Date Filter */
.date-filter {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--text-color-primary);
  font-size: 0.9rem;
}

.date-input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--bg-input);
  color: var(--text-color-primary);
}

.btn-clear {
  padding: 0.75rem 1.5rem;
  background: #e2e8f0;
  color: #2d3748;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: #cbd5e0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.stat-card.single {
  grid-column: 1 / -1;
  max-width: 500px;
  margin: 2rem auto 0;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.1);
}

.stat-card.success .stat-icon {
  background: rgba(72, 187, 120, 0.1);
}

.stat-card.warning .stat-icon {
  background: rgba(246, 173, 85, 0.1);
}

.stat-card.danger .stat-icon {
  background: rgba(252, 129, 129, 0.1);
}

.stat-card.info .stat-icon {
  background: rgba(99, 179, 237, 0.1);
}

.stat-content h3 {
  font-size: 2rem;
  margin: 0 0 0.25rem 0;
  color: var(--text-color-primary);
  font-weight: 700;
}

.stat-content p {
  font-size: 0.95rem;
  color: var(--text-color-secondary);
  margin: 0;
}

/* Charts */
.chart-container {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.chart-container h3 {
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  color: var(--text-color-primary);
  font-weight: 600;
}

.chart-container canvas {
  max-height: 400px;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-container.half canvas {
  max-height: 300px;
}

/* Responsive */
@media (max-width: 768px) {
  .reports-view {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-refresh {
    width: 100%;
  }

  .tab-navigation {
    flex-direction: column;
  }

  .date-filter {
    flex-direction: column;
  }

  .charts-row {
    grid-template-columns: 1fr;
  }

  .stat-card h3 {
    font-size: 1.5rem;
  }

  .stat-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }
}

/* Dark Mode Support */
body.dark .date-input,
body.dark .btn-clear {
  background: var(--dark-bg-input);
  border-color: var(--dark-border-color);
  color: var(--dark-text-color-primary);
}

body.dark .alert.error {
  background-color: rgba(252, 129, 129, 0.1);
  border-color: #fc8181;
  color: #fc8181;
}
</style>
