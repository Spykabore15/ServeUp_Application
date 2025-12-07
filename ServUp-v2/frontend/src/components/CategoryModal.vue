<template>
  <div v-if="visible" class="category-modal-overlay" @click.self="handleClose">
    <div class="category-modal">
      <!-- Header -->
      <div class="category-modal-header">
        <div class="header-left">
          <span class="header-icon">📁</span>
          <div class="header-text">
            <h2 class="modal-title">Add New Category</h2>
            <p class="modal-subtitle">Create a product category</p>
          </div>
        </div>
        <button @click="handleClose" class="close-icon">✕</button>
      </div>

      <!-- Content -->
      <div class="category-modal-content">
        <form @submit.prevent="handleSubmit">
          <!-- Category Name -->
          <div class="form-group">
            <label for="category-name" class="form-label">
              Category Name <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <span class="input-icon">📁</span>
              <input
                v-model="categoryName"
                id="category-name"
                type="text"
                class="form-input"
                placeholder="Enter category name"
                required
                maxlength="100"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="category-description" class="form-label">
              Description <span class="optional">(Optional)</span>
            </label>
            <div class="textarea-wrapper">
              <textarea
                v-model="categoryDescription"
                id="category-description"
                class="form-textarea"
                placeholder="Brief description of this category..."
                rows="4"
                maxlength="500"
                @input="updateCharCount"
              ></textarea>
              <div class="char-counter">{{ charCount }}/500</div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-alert">
            <span class="error-icon">⚠️</span>
            <span class="error-text">{{ errorMessage }}</span>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <button type="button" @click="handleClose" class="btn-cancel">
              Cancel
            </button>
            <button type="submit" class="btn-create" :disabled="isSubmitting || !categoryName.trim()">
              {{ isSubmitting ? 'Creating...' : 'Create Category →' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import categoryService from '../services/categoryService'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

const categoryName = ref('')
const categoryDescription = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const charCount = ref(0)

watch(() => props.visible, (newVal) => {
  if (newVal) {
    // Reset form when modal opens
    categoryName.value = ''
    categoryDescription.value = ''
    errorMessage.value = ''
    charCount.value = 0
    isSubmitting.value = false
  }
})

const updateCharCount = () => {
  charCount.value = categoryDescription.value.length
}

const handleClose = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!categoryName.value || !categoryName.value.trim()) {
    errorMessage.value = 'Category name is required'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await categoryService.createCategory({
      name: categoryName.value.trim(),
      description: categoryDescription.value.trim() || null
    })

    // Handle different response formats
    const category = result.data || result
    if (result.success && category) {
      emit('created', category)
      handleClose()
    } else {
      errorMessage.value = result.message || 'Failed to create category'
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || 'Failed to create category'
    errorMessage.value = errorMsg
    console.error('Create category error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.category-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.category-modal {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.category-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2rem;
  line-height: 1;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
}

.modal-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(26, 32, 44, 0.8);
  font-weight: 400;
}

.close-icon {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #1a202c;
  font-size: 1.5rem;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-weight: 600;
}

.close-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Content */
.category-modal-content {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.required {
  color: #e53e3e;
}

.optional {
  color: #718096;
  font-weight: 400;
  font-size: 0.85rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
  color: #2d3748;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.textarea-wrapper {
  position: relative;
}

.form-textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;
  background: white;
  color: #2d3748;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea::placeholder {
  color: #a0aec0;
}

.char-counter {
  position: absolute;
  bottom: 0.75rem;
  right: 1rem;
  font-size: 0.85rem;
  color: #718096;
  background: white;
  padding: 0 0.25rem;
}

/* Error Alert */
.error-alert {
  background: #fed7d7;
  border: 1px solid #fc8181;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.error-text {
  color: #c53030;
  font-weight: 500;
  font-size: 0.95rem;
}

/* Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  padding: 0.85rem 2rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-create {
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-create:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-create:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 640px) {
  .category-modal {
    max-width: 100%;
    margin: 1rem;
  }

  .category-modal-header {
    padding: 1.25rem 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .category-modal-content {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-create {
    width: 100%;
  }
}
</style>

