<template>
  <div class="products-view">
    <!-- Header -->
    <div class="page-header">
      <h1>Stock Management</h1>
      <button 
        v-if="canManage" 
        @click="openAddModal" 
        class="btn btn-success"
      >
        ➕ Add Product
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-card">
        <h3>{{ pagination.total }}</h3>
        <p>Total Products</p>
      </div>
      <div class="stat-card alert">
        <h3>{{ lowStockCount }}</h3>
        <p>Low Stock</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <input
        v-model="searchQuery"
        @input="debounceSearch"
        type="text"
        placeholder="🔍 Search for a product..."
        class="search-input"
      />
      
      <label class="checkbox-label">
        <input 
          v-model="showLowStockOnly" 
          @change="applyFilters"
          type="checkbox"
        />
        Show only low stock items
      </label>

      <button @click="clearAllFilters" class="btn-clear">
        Clear filters
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="clearError">✕</button>
    </div>

    <!-- Products Table -->
    <div v-if="!isLoading" class="table-container">
      <table v-if="products.length > 0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Threshold</th>
            <th>Unit</th>
            <th>Price/Unit</th>
            <th>Supplier</th>
            <th>SKU</th>
            <th v-if="canManage">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in products" 
            :key="product.id"
            :class="{ 'low-stock': isLowStock(product) }"
          >
            <td>
              <strong>{{ product.name }}</strong>
              <span v-if="isLowStock(product)" class="low-stock-badge">⚠️ Low stock</span>
            </td>
            <td>{{ product.category?.name || 'N/A' }}</td>
            <td :class="{ 'low-stock-alert': isLowStock(product) }">
              {{ product.quantity }}
            </td>
            <td>{{ product.threshold }}</td>
            <td>{{ product.unit }}</td>
            <td>{{ formatPrice(product.price_per_unit) }}</td>
            <td>{{ product.supplier?.name || 'N/A' }}</td>
            <td><code>{{ product.sku || '-' }}</code></td>
            <td v-if="canManage" class="actions-cell">
              <button 
                @click="openEditModal(product)" 
                class="btn-icon edit-btn"
                title="Edit"
              >
                ✏️
              </button>
              <button 
                @click="confirmDelete(product)" 
                class="btn-icon delete-btn"
                title="Delete"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <p>📦 No products found</p>
        <button v-if="canManage" @click="openAddModal" class="btn btn-primary">
          Add first product
        </button>
      </div>
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
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit Product' : 'Add Product' }}</h2>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>

        <form @submit.prevent="handleSubmit" class="product-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Product Name *</label>
              <input
                v-model="formData.name"
                id="name"
                type="text"
                required
                class="form-control"
                placeholder="e.g., Tomatoes"
              />
            </div>

            <div class="form-group">
              <label for="sku">SKU</label>
              <input
                v-model="formData.sku"
                id="sku"
                type="text"
                class="form-control"
                placeholder="e.g., VEG001"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              v-model="formData.description"
              id="description"
              rows="3"
              class="form-control"
              placeholder="Product description"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="quantity">Quantity *</label>
              <input
                v-model.number="formData.quantity"
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="unit">Unit *</label>
              <input
                v-model="formData.unit"
                id="unit"
                type="text"
                required
                class="form-control"
                placeholder="kg, liters, pieces..."
              />
            </div>

            <div class="form-group">
              <label for="threshold">Alert Threshold *</label>
              <input
                v-model.number="formData.threshold"
                id="threshold"
                type="number"
                step="0.01"
                min="0"
                required
                class="form-control"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price_per_unit">Price per Unit (€)</label>
              <input
                v-model.number="formData.price_per_unit"
                id="price_per_unit"
                type="number"
                step="0.01"
                min="0"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="expiration_date">Expiration Date</label>
              <input
                v-model="formData.expiration_date"
                id="expiration_date"
                type="date"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Add') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal" @click.self="showDeleteModal = false">
      <div class="modal-content modal-small">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete the product <strong>{{ productToDelete?.name }}</strong>?</p>
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
import { useProductsStore } from '../store/products'
import { useAuthStore } from '../store/auth'

const productsStore = useProductsStore()
const authStore = useAuthStore()

// Computed
const products = computed(() => productsStore.products)
const pagination = computed(() => productsStore.pagination)
const isLoading = computed(() => productsStore.isLoading)
const error = computed(() => productsStore.error)
const lowStockCount = computed(() => productsStore.lowStockCount)

const canManage = computed(() => {
  return authStore.hasRole(['admin', 'responsable_stocks'])
})

// State
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const productToDelete = ref(null)
const searchQuery = ref('')
const showLowStockOnly = ref(false)

const formData = ref({
  name: '',
  description: '',
  quantity: 0,
  unit: 'units',
  threshold: 10,
  price_per_unit: null,
  sku: '',
  expiration_date: null
})

// Search debounce
let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Methods
const isLowStock = (product) => {
  return parseFloat(product.quantity) <= parseFloat(product.threshold)
}

const formatPrice = (price) => {
  return price ? `${parseFloat(price).toFixed(2)} €` : 'N/A'
}

const applyFilters = async () => {
  productsStore.setFilters({
    search: searchQuery.value,
    low_stock: showLowStockOnly.value
  })
  await productsStore.fetchProducts()
}

const clearAllFilters = async () => {
  searchQuery.value = ''
  showLowStockOnly.value = false
  productsStore.clearFilters()
  await productsStore.fetchProducts()
}

const clearError = () => {
  productsStore.clearError()
}

const goToPage = async (page) => {
  productsStore.setPage(page)
  await productsStore.fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openAddModal = () => {
  isEditMode.value = false
  formData.value = {
    name: '',
    description: '',
    quantity: 0,
    unit: 'units',
    threshold: 10,
    price_per_unit: null,
    sku: '',
    expiration_date: null
  }
  showModal.value = true
}

const openEditModal = (product) => {
  isEditMode.value = true
  formData.value = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    quantity: parseFloat(product.quantity),
    unit: product.unit,
    threshold: parseFloat(product.threshold),
    price_per_unit: product.price_per_unit ? parseFloat(product.price_per_unit) : null,
    sku: product.sku || '',
    expiration_date: product.expiration_date || null
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSubmit = async () => {
  const result = isEditMode.value
    ? await productsStore.updateProduct(formData.value.id, formData.value)
    : await productsStore.createProduct(formData.value)

  if (result.success) {
    closeModal()
    // Refresh list if needed
    if (!isEditMode.value) {
      await productsStore.fetchProducts()
    }
  }
}

const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const handleDelete = async () => {
  const result = await productsStore.deleteProduct(productToDelete.value.id)
  if (result.success) {
    showDeleteModal.value = false
    productToDelete.value = null
  }
}

// Lifecycle
onMounted(async () => {
  await productsStore.fetchProducts()
})
</script>

<style scoped>
.products-view {
  padding: 2rem;
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
  margin: 0;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card.alert {
  border-left: 4px solid #dc3545;
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.stat-card.alert h3 {
  color: #dc3545;
}

.stat-card p {
  margin: 0;
  color: #666;
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-clear {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-clear:hover {
  background: #5a6268;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

tr.low-stock {
  background-color: #fff3cd;
}

tr:hover {
  background-color: #f8f9fa;
}

.low-stock-alert {
  color: #dc3545;
  font-weight: bold;
}

.low-stock-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #dc3545;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #e9ecef;
}

.edit-btn:hover {
  background: #fff3cd;
}

.delete-btn:hover {
  background: #f8d7da;
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #6c757d;
}

.empty-state p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.btn-pagination:hover:not(:disabled) {
  background: #f8f9fa;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6c757d;
}

.product-form .form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

code {
  background: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}
</style>
