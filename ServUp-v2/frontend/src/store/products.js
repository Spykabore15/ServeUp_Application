import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import productService from '../services/productService'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref([])
  const currentProduct = ref(null)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  })
  const isLoading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    category_id: null,
    supplier_id: null,
    low_stock: false
  })

  // Getters
  const lowStockProducts = computed(() => {
    return products.value.filter(p => parseFloat(p.quantity) <= parseFloat(p.threshold))
  })

  const lowStockCount = computed(() => lowStockProducts.value.length)

  // Actions
  async function fetchProducts(params = {}) {
    isLoading.value = true
    error.value = null

    try {
      const queryParams = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...filters.value,
        ...params
      }

      const response = await productService.getAllProducts(queryParams)
      
      products.value = response.data.products
      pagination.value = response.data.pagination
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch products'
      console.error('Fetch products error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProductById(id) {
    isLoading.value = true
    error.value = null

    try {
      const response = await productService.getProductById(id)
      currentProduct.value = response.data.product
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch product'
      console.error('Fetch product error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function createProduct(productData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await productService.createProduct(productData)
      
      // Add new product to list
      products.value.unshift(response.data.product)
      pagination.value.total += 1
      
      return { success: true, product: response.data.product }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create product'
      console.error('Create product error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function updateProduct(id, productData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await productService.updateProduct(id, productData)
      
      // Update product in list
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = response.data.product
      }
      
      return { success: true, product: response.data.product }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update product'
      console.error('Update product error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function deleteProduct(id) {
    isLoading.value = true
    error.value = null

    try {
      await productService.deleteProduct(id)
      
      // Remove product from list
      products.value = products.value.filter(p => p.id !== id)
      pagination.value.total -= 1
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete product'
      console.error('Delete product error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset to first page
  }

  function setPage(page) {
    pagination.value.page = page
  }

  function clearFilters() {
    filters.value = {
      search: '',
      category_id: null,
      supplier_id: null,
      low_stock: false
    }
    pagination.value.page = 1
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    products,
    currentProduct,
    pagination,
    isLoading,
    error,
    filters,
    // Getters
    lowStockProducts,
    lowStockCount,
    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    setPage,
    clearFilters,
    clearError
  }
})

