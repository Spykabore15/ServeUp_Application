import api from './api'

const categoryService = {
  // Get all categories
  async getAllCategories() {
    const response = await api.get('/categories')
    return response
  },

  // Get single category by ID
  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`)
    return response
  },

  // Create new category
  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData)
    return response
  },

  // Update category
  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response
  },

  // Delete category
  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`)
    return response
  }
}

export default categoryService

