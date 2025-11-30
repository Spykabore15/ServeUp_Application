import api from './api'

const productService = {
  // Get all products with optional filters
  async getAllProducts(params = {}) {
    const response = await api.get('/products', { params })
    return response
  },

  // Get single product by ID
  async getProductById(id) {
    const response = await api.get(`/products/${id}`)
    return response
  },

  // Get low stock products
  async getLowStockProducts() {
    const response = await api.get('/products/low-stock')
    return response
  },

  // Create new product
  async createProduct(productData) {
    const response = await api.post('/products', productData)
    return response
  },

  // Update product
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData)
    return response
  },

  // Delete product
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`)
    return response
  }
}

export default productService

