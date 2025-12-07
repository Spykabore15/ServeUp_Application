<template>
  <div v-if="isVisible" class="modal" @click.self="handleClose">
    <div class="modal-content modal-large" :class="{ 
      'product-modal': entityType === 'product',
      'user-modal': entityType === 'user',
      'employee-modal': entityType === 'employee',
      'selector-modal': !entityType
    }">
      <div class="modal-header" :class="{ 
        'gradient-header': !entityType || ['product', 'user', 'employee', 'access_request'].includes(entityType) 
      }">
        <div v-if="!entityType || ['product', 'user', 'employee', 'access_request'].includes(entityType)" class="header-left">
          <span class="header-icon">
            <template v-if="!entityType">➕</template>
            <template v-else-if="entityType === 'product'">📦</template>
            <template v-else-if="entityType === 'user'">👤</template>
            <template v-else-if="entityType === 'employee'">👥</template>
            <template v-else-if="entityType === 'access_request'">🚀</template>
          </span>
          <div class="header-text">
            <h2 class="modal-title">{{ modalTitle }}</h2>
            <p class="modal-subtitle">
              <template v-if="!entityType">
                Choose what you'd like to add to the system
              </template>
              <template v-else-if="entityType === 'product'">
                {{ isEditMode ? 'Update product information' : 'Add a new product to inventory' }}
              </template>
              <template v-else-if="entityType === 'user'">
                {{ isEditMode ? 'Update user account information' : 'Create a new user account' }}
              </template>
              <template v-else-if="entityType === 'employee'">
                {{ isEditMode ? 'Update employee information' : 'Add a new employee to the system' }}
              </template>
              <template v-else-if="entityType === 'access_request'">
                Request access to our restaurant platform
              </template>
            </p>
          </div>
        </div>
        <button @click="handleClose" class="close-button gradient-close">✕</button>
      </div>

      <!-- Entity Type Selector (only shown when entityType is not pre-selected) -->
      <div v-if="!entityType" class="entity-selector">
        <div class="entity-options">
          <button 
            v-for="option in entityOptions" 
            :key="option.type"
            @click="selectEntityType(option.type)"
            class="entity-option-btn"
            :class="{ disabled: option.disabled }"
          >
            <span class="entity-icon">{{ option.icon }}</span>
            <span class="entity-label">{{ option.label }}</span>
            <span v-if="option.disabled" class="entity-badge">Coming Soon</span>
          </button>
        </div>
      </div>

      <!-- Form Content -->
      <form v-else @submit.prevent="handleSubmit" class="universal-form">
        <!-- User Form -->
        <div v-if="entityType === 'user'" class="form-sections user-form-sections">
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
                <label for="password">Password {{ isEditMode ? '(leave blank to keep current)' : '*' }}</label>
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
            </div>
          </div>

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
            </div>
          </div>
        </div>

        <!-- Employee Form -->
        <div v-if="entityType === 'employee'" class="form-sections employee-form-sections">
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
                  placeholder="e.g., Chef, Waiter, Manager"
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
                <label for="salary">Salary (€)</label>
                <input
                  v-model.number="formData.salary"
                  id="salary"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-control"
                  placeholder="0.00"
                />
              </div>
              <div class="form-group">
                <label for="status">Status *</label>
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
        </div>

        <!-- Product Form -->
        <div v-if="entityType === 'product'" class="form-sections">
          <div class="form-section">
            <h3 class="section-title">📦 Product Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="name">Product Name *</label>
                <input
                  v-model="formData.name"
                  id="name"
                  type="text"
                  required
                  class="form-control"
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>
              <div class="form-group">
                <label for="sku">SKU / Product Code</label>
                <input
                  v-model="formData.sku"
                  id="sku"
                  type="text"
                  class="form-control"
                  placeholder="e.g., VEG001"
                />
                <small class="form-hint">Unique product identifier</small>
              </div>
            </div>
            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea
                v-model="formData.description"
                id="description"
                rows="3"
                class="form-control"
                placeholder="Product description, notes, or specifications"
              ></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">📊 Inventory & Stock Management</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="quantity">Current Stock *</label>
                <input
                  v-model.number="formData.quantity"
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="form-control"
                  placeholder="0.00"
                />
                <small class="form-hint">Current quantity in stock</small>
              </div>
              <div class="form-group">
                <label for="unit">Unit *</label>
                <select
                  v-model="formData.unit"
                  id="unit"
                  required
                  class="form-control"
                >
                  <option value="">Select unit</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="L">Liter (L)</option>
                  <option value="mL">Milliliter (mL)</option>
                  <option value="piece">Piece</option>
                  <option value="pack">Pack</option>
                  <option value="box">Box</option>
                  <option value="bottle">Bottle</option>
                  <option value="can">Can</option>
                  <option value="bag">Bag</option>
                  <option value="unit">Unit</option>
                </select>
                <small class="form-hint">Measurement unit</small>
              </div>
              <div class="form-group">
                <label for="threshold">Reorder Level / Minimum Stock *</label>
                <input
                  v-model.number="formData.threshold"
                  id="threshold"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="form-control"
                  placeholder="10.00"
                />
                <small class="form-hint">Alert when stock falls below this</small>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">💰 Pricing & Financial</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="price_per_unit">Selling Price per Unit (€)</label>
                <input
                  v-model.number="formData.price_per_unit"
                  id="price_per_unit"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-control"
                  placeholder="0.00"
                />
                <small class="form-hint">Price at which product is sold</small>
              </div>
              <div class="form-group">
                <label for="expiration_date">Expiration Date</label>
                <input
                  v-model="formData.expiration_date"
                  id="expiration_date"
                  type="date"
                  class="form-control"
                />
                <small class="form-hint">Optional: Product expiration date</small>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">🏷️ Classification & Supplier</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="category_id">Category <span class="optional">(Optional)</span></label>
                <div class="custom-dropdown" :class="{ 'is-open': categoryDropdownOpen }">
                  <div 
                    class="dropdown-trigger"
                    @click="toggleCategoryDropdown"
                    :class="{ 'has-value': formData.category_id }"
                  >
                    <span class="dropdown-icon">📁</span>
                    <span class="dropdown-text">
                      <template v-if="formData.category_id">
                        {{ getCategoryName(formData.category_id) }}
                      </template>
                      <template v-else>No category</template>
                    </span>
                    <span class="dropdown-caret">▼</span>
                  </div>
                  <div v-if="categoryDropdownOpen" class="dropdown-menu">
                    <div 
                      class="dropdown-option"
                      :class="{ 'is-selected': !formData.category_id }"
                      @click="selectCategory(null)"
                    >
                      No category
                    </div>
                    <div 
                      v-for="category in availableCategories" 
                      :key="category.id"
                      class="dropdown-option"
                      :class="{ 'is-selected': formData.category_id === category.id }"
                      @click="selectCategory(category.id)"
                    >
                      {{ category.name }}
                    </div>
                    <div 
                      class="dropdown-option dropdown-option-new"
                      @click="handleNewCategoryClick"
                    >
                      <span class="new-icon">➕</span>
                      <span>New Category</span>
                    </div>
                  </div>
                </div>
                <small class="form-hint">Product category for organization</small>
              </div>
              <div class="form-group">
                <label for="supplier_id">Supplier</label>
                <select
                  v-model="formData.supplier_id"
                  id="supplier_id"
                  class="form-control"
                >
                  <option :value="null">No supplier</option>
                  <option 
                    v-for="supplier in availableSuppliers" 
                    :key="supplier.id" 
                    :value="supplier.id"
                  >
                    {{ supplier.name }}
                  </option>
                </select>
                <small class="form-hint">Primary supplier for this product</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Access Request Form -->
        <div v-if="entityType === 'access_request'" class="form-sections">
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
                <label for="phone">Phone</label>
                <input
                  v-model="formData.phone"
                  id="phone"
                  type="tel"
                  class="form-control"
                  placeholder="+1 234 567 8900 (optional)"
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
                  placeholder="johndoe"
                />
                <small class="form-hint">Choose a unique username for login</small>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="password">Password *</label>
                <input
                  v-model="formData.password"
                  id="password"
                  type="password"
                  required
                  class="form-control"
                  placeholder="Enter your password"
                  minlength="6"
                />
                <small class="form-hint">Minimum 6 characters</small>
              </div>
              <div class="form-group">
                <label for="confirm_password">Confirm Password *</label>
                <input
                  v-model="formData.confirm_password"
                  id="confirm_password"
                  type="password"
                  required
                  class="form-control"
                  placeholder="Confirm your password"
                  minlength="6"
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">💼 Role Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="requested_role">Requested Role *</label>
                <select
                  v-model="formData.requested_role"
                  id="requested_role"
                  required
                  class="form-control"
                >
                  <option value="">Select a role</option>
                  <option value="employe">Employee</option>
                  <option value="responsable_stocks">Stock Manager</option>
                  <option value="responsable_employes">Employee Manager</option>
                </select>
                <small class="form-hint">Admin will review and may adjust your role</small>
              </div>
            </div>
            <div class="form-group full-width">
              <label for="reason">Why join us? (Optional)</label>
              <textarea
                v-model="formData.reason"
                id="reason"
                rows="3"
                class="form-control"
                placeholder="Tell us why you'd like to join our team..."
                maxlength="500"
              ></textarea>
              <small class="form-hint">{{ (formData.reason || '').length }}/500 characters</small>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" @click="handleClose" class="btn btn-secondary">
            ❌ Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? '⏳ Saving...' : submitButtonText }}
          </button>
        </div>
      </form>
    </div>

    <!-- Category Modal -->
    <CategoryModal
      :visible="showCategoryModal"
      @close="closeCategoryModal"
      @created="handleCategoryCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../store/users'
import { useEmployeeStore } from '../store/employees'
import { useProductsStore } from '../store/products'
import { useSupplierStore } from '../store/suppliers'
import { useAuthStore } from '../store/auth'
import api from '../services/api'
import categoryService from '../services/categoryService'
import accessRequestService from '../services/accessRequestService'
import CategoryModal from './CategoryModal.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  entityType: {
    type: String,
    default: null,
    validator: (value) => !value || ['user', 'employee', 'product', 'access_request'].includes(value)
  },
  editData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit', 'success'])

const userStore = useUserStore()
const employeeStore = useEmployeeStore()
const productStore = useProductsStore()
const supplierStore = useSupplierStore()
const authStore = useAuthStore()

const isVisible = ref(false)
const isSubmitting = ref(false)
const isEditMode = ref(false)
const selectedEntityType = ref(null)

const availableEmployees = ref([])
const availableCategories = ref([])
const availableSuppliers = ref([])
const showCategoryModal = ref(false)
const categoryDropdownOpen = ref(false)

const entityOptions = [
  { type: 'user', label: 'Add User', icon: '👤', disabled: false },
  { type: 'employee', label: 'Add Employee', icon: '👥', disabled: false },
  { type: 'product', label: 'Add Product', icon: '📦', disabled: false },
  { type: 'access_request', label: 'Request Access', icon: '🔐', disabled: false }
]

const formData = ref({})

const dataLoaded = ref(false)

watch(() => props.visible, async (newVal, oldVal) => {
  // Only update if value actually changed
  if (newVal === oldVal) return
  
  isVisible.value = newVal
  if (newVal) {
    initializeForm()
    // Load reference data only when modal opens (and only once) and only for entity types that need it
    const currentEntityType = selectedEntityType.value || props.entityType
    if (!dataLoaded.value && currentEntityType && ['user', 'employee', 'product'].includes(currentEntityType)) {
      await loadReferenceData()
      dataLoaded.value = true
    }
  } else {
    // Reset form when modal closes
    formData.value = {}
    isEditMode.value = false
    selectedEntityType.value = null
    categoryDropdownOpen.value = false
    showCategoryModal.value = false
    // Reset dataLoaded flag so data can be reloaded next time
    dataLoaded.value = false
  }
})

watch(() => props.entityType, (newVal) => {
  if (newVal !== selectedEntityType.value) {
    selectedEntityType.value = newVal
    if (isVisible.value) {
      initializeForm()
    }
  }
}, { immediate: true })

watch(() => props.editData, (newVal) => {
  if (newVal) {
    isEditMode.value = true
    loadEditData()
  } else {
    isEditMode.value = false
  }
}, { deep: true })

const entityType = computed(() => selectedEntityType.value || props.entityType)

const modalTitle = computed(() => {
  if (!entityType.value) return '➕ Add New Item'
  const titles = {
    user: isEditMode.value ? '✏️ Edit User' : '➕ Add New User',
    employee: isEditMode.value ? '✏️ Edit Employee' : '➕ Add New Employee',
    product: isEditMode.value ? '✏️ Edit Product' : '➕ Add New Product',
    access_request: 'Join ServUp'
  }
  return titles[entityType.value] || '➕ Add New Item'
})

const submitButtonText = computed(() => {
  if (!entityType.value) return 'Continue'
  const texts = {
    user: isEditMode.value ? '💾 Update User' : '✅ Add User',
    employee: isEditMode.value ? '💾 Update Employee' : '✅ Add Employee',
    product: isEditMode.value ? '💾 Update Product' : '✅ Add Product',
    access_request: '📤 Submit Request'
  }
  return texts[entityType.value] || 'Submit'
})

// Data is now loaded lazily when modal opens (see watch on props.visible)

const loadReferenceData = async () => {
  try {
    // Load employees for user form (employees API allows up to 1000)
    await employeeStore.fetchEmployees({ limit: 1000 })
    availableEmployees.value = employeeStore.getEmployees

    // Load suppliers for product form (suppliers API has max limit of 100)
    try {
      await supplierStore.fetchSuppliers({ limit: 100 })
      availableSuppliers.value = supplierStore.getSuppliers
    } catch (supplierError) {
      // If error occurs, continue without suppliers
      console.warn('Error loading suppliers:', supplierError)
      availableSuppliers.value = []
    }

    // Load categories for product form
    try {
      const categoriesResponse = await categoryService.getAllCategories()
      if (categoriesResponse.success && categoriesResponse.data) {
        availableCategories.value = Array.isArray(categoriesResponse.data) 
          ? categoriesResponse.data 
          : []
      }
    } catch (catError) {
      console.warn('Categories endpoint not available:', catError)
      availableCategories.value = []
    }
  } catch (error) {
    console.error('Error loading reference data:', error)
  }
}

const initializeForm = () => {
  if (!entityType.value) {
    formData.value = {}
    return
  }

  if (isEditMode.value && props.editData) {
    loadEditData()
    return
  }

  // Initialize empty form based on entity type
  switch (entityType.value) {
    case 'user':
      formData.value = {
        username: '',
        email: '',
        password: '',
        role: '',
        employee_id: null,
        is_active: true
      }
      break
    case 'employee':
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
      break
    case 'product':
      formData.value = {
        name: '',
        sku: '',
        description: '',
        quantity: 0,
        unit: '',
        threshold: 0,
        price_per_unit: null,
        category_id: null,
        supplier_id: null,
        expiration_date: null
      }
      break
    case 'access_request':
      formData.value = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        confirm_password: '',
        requested_role: '',
        reason: ''
      }
      break
    default:
      formData.value = {}
  }
}

const loadEditData = () => {
  if (!props.editData) return
  formData.value = { ...props.editData }
}

const selectEntityType = (type) => {
  selectedEntityType.value = type
  initializeForm()
}


const handleClose = () => {
  // Don't update isVisible here - let the parent control it via props
  // Just emit the close event and reset state
  selectedEntityType.value = null
  formData.value = {}
  isEditMode.value = false
  showCategoryModal.value = false
  categoryDropdownOpen.value = false
  emit('close')
}

const toggleCategoryDropdown = () => {
  categoryDropdownOpen.value = !categoryDropdownOpen.value
}

const selectCategory = (categoryId) => {
  formData.value.category_id = categoryId
  categoryDropdownOpen.value = false
}

const handleNewCategoryClick = () => {
  categoryDropdownOpen.value = false
  openCategoryModal()
}

const openCategoryModal = () => {
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
}

const handleCategoryCreated = (category) => {
  // Add new category to the list
  availableCategories.value.push(category)
  // Select the newly created category
  formData.value.category_id = category.id
  closeCategoryModal()
}

const getCategoryName = (categoryId) => {
  const category = availableCategories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Unknown'
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (categoryDropdownOpen.value && !event.target.closest('.custom-dropdown')) {
    categoryDropdownOpen.value = false
  }
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleSubmit = async () => {
  if (!entityType.value) {
    return
  }

  isSubmitting.value = true

  try {
    let result

    switch (entityType.value) {
      case 'user':
        if (isEditMode.value) {
          const updateData = { ...formData.value }
          if (!updateData.password) delete updateData.password
          result = await userStore.updateUser(formData.value.id, updateData)
        } else {
          if (!formData.value.password) {
            alert('❌ Password is required for new users')
            isSubmitting.value = false
            return
          }
          result = await userStore.createUser(formData.value)
        }
        break

      case 'employee':
        if (isEditMode.value) {
          result = await employeeStore.updateEmployee(formData.value.id, formData.value)
        } else {
          result = await employeeStore.createEmployee(formData.value)
        }
        break

      case 'product':
        // Ensure category_id is null if not set (not empty string)
        const productData = {
          ...formData.value,
          category_id: formData.value.category_id || null,
          supplier_id: formData.value.supplier_id || null
        }
        if (isEditMode.value) {
          result = await productStore.updateProduct(formData.value.id, productData)
        } else {
          result = await productStore.createProduct(productData)
        }
        break

      case 'access_request':
        // Validate required fields
        if (!formData.value.first_name || !formData.value.last_name) {
          alert('❌ First name and last name are required')
          isSubmitting.value = false
          return
        }
        if (!formData.value.email) {
          alert('❌ Email is required')
          isSubmitting.value = false
          return
        }
        if (!formData.value.username) {
          alert('❌ Username is required')
          isSubmitting.value = false
          return
        }
        if (!formData.value.password) {
          alert('❌ Password is required')
          isSubmitting.value = false
          return
        }
        if (formData.value.password.length < 6) {
          alert('❌ Password must be at least 6 characters long')
          isSubmitting.value = false
          return
        }
        if (formData.value.password !== formData.value.confirm_password) {
          alert('❌ Passwords do not match')
          isSubmitting.value = false
          return
        }
        if (!formData.value.requested_role) {
          alert('❌ Please select a requested role')
          isSubmitting.value = false
          return
        }
        
        // Submit access request to backend
        const accessRequestData = {
          full_name: `${formData.value.first_name} ${formData.value.last_name}`.trim(),
          email: formData.value.email.trim(),
          username: formData.value.username.trim(),
          password: formData.value.password,
          phone: formData.value.phone ? formData.value.phone.trim() : null,
          requested_role: formData.value.requested_role,
          reason: formData.value.reason ? formData.value.reason.trim() : null
        }
        
        try {
          result = await accessRequestService.createAccessRequest(accessRequestData)
          
          // API interceptor returns response.data directly
          // Backend returns: {success: true, message: '...', data: {...}}
          // So result should be: {success: true, message: '...', data: {...}}
          if (result && result.success === true) {
            emit('success', { type: entityType.value, data: result })
            alert('✅ Access request submitted! An administrator will review your request.')
            handleClose()
            isSubmitting.value = false
            return
          } else {
            // If success is false, null, or undefined, show error
            const errorMsg = result?.message || result?.error || 'Failed to submit access request'
            console.error('Access request failed - result:', result)
            alert('❌ Error: ' + errorMsg)
            isSubmitting.value = false
            return
          }
        } catch (requestError) {
          console.error('Access request exception:', requestError)
          // Handle axios error structure
          const errorMsg = requestError?.response?.data?.message 
            || requestError?.response?.data?.error
            || requestError?.message 
            || 'Failed to submit access request'
          alert('❌ Error: ' + errorMsg)
          isSubmitting.value = false
          return
        }

      default:
        throw new Error(`Unknown entity type: ${entityType.value}`)
    }

    emit('success', { type: entityType.value, data: result })
    handleClose()
    
    const successMessage = isEditMode.value 
      ? `✅ ${entityType.value} updated successfully!`
      : `✅ ${entityType.value} created successfully!`
    alert(successMessage)

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    alert('❌ Error: ' + errorMessage)
    console.error('Submit error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
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

.selector-modal.modal-content {
  background: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.product-modal.modal-content,
.user-modal.modal-content,
.employee-modal.modal-content {
  background: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-large {
  max-width: 900px;
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

.modal-header.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  color: white;
}

.modal-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
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
  font-weight: 600;
}

.close-button:hover {
  background: var(--danger-color);
  color: white;
  transform: scale(1.1);
}

.close-button.gradient-close {
  background: rgba(255, 255, 255, 0.2);
  color: #1a202c;
}

.close-button.gradient-close:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #1a202c;
  transform: scale(1.1);
}

/* Entity Selector */
.entity-selector {
  padding: 2rem;
  background: white;
}

.entity-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.entity-option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.entity-option-btn:hover:not(.disabled) {
  border-color: #667eea;
  background: #f7fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.entity-option-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.entity-icon {
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.entity-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.entity-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ffc107;
  color: #1a202c;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Form Styles */
.universal-form {
  padding: 2rem;
}

.product-modal .universal-form,
.user-modal .universal-form,
.employee-modal .universal-form {
  background: white;
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.product-modal .form-section,
.user-modal .form-section,
.employee-modal .form-section {
  border-bottom: 1px solid #e2e8f0;
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

.product-modal .section-title,
.user-modal .section-title,
.employee-modal .section-title {
  color: #667eea;
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
  color: #2d3748;
  font-size: 0.95rem;
}

.product-modal .form-group label,
.user-modal .form-group label,
.employee-modal .form-group label {
  color: #2d3748;
}

/* Style asterisk in product form labels */
.product-modal .form-group label {
  position: relative;
}

.product-modal .form-group label:has-text("*") {
  color: #2d3748;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  transition: all 0.2s;
  font-family: inherit;
}

.product-modal .form-control,
.user-modal .form-control,
.employee-modal .form-control {
  border-color: #e2e8f0;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.product-modal .form-control:focus,
.user-modal .form-control:focus,
.employee-modal .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
  border: 2px solid #e2e8f0;
}

.product-modal textarea.form-control,
.user-modal textarea.form-control,
.employee-modal textarea.form-control {
  border-color: #e2e8f0;
}

.product-modal textarea.form-control:focus,
.user-modal textarea.form-control:focus,
.employee-modal textarea.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

select.form-control {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.product-modal select.form-control,
.user-modal select.form-control,
.employee-modal select.form-control {
  border-color: #e2e8f0;
}

.product-modal select.form-control:focus,
.user-modal select.form-control:focus,
.employee-modal select.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #718096;
}

.product-modal .form-hint,
.user-modal .form-hint,
.employee-modal .form-hint {
  color: #718096;
}

/* Custom Dropdown */
.custom-dropdown {
  position: relative;
  margin-bottom: 0.5rem;
}

.dropdown-trigger {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
  position: relative;
}

.dropdown-trigger:hover {
  border-color: #cbd5e0;
}

.dropdown-trigger:focus,
.custom-dropdown.is-open .dropdown-trigger {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.dropdown-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  line-height: 1;
}

.dropdown-text {
  flex: 1;
  text-align: left;
}

.dropdown-caret {
  font-size: 0.75rem;
  color: #718096;
  transition: transform 0.2s;
}

.custom-dropdown.is-open .dropdown-caret {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.25rem;
}

.dropdown-option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.15s;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dropdown-option:hover {
  background: #f7fafc;
}

.dropdown-option.is-selected {
  background: #edf2f7;
  color: #2d3748;
  font-weight: 500;
}

.dropdown-option-new {
  border-top: 1px solid #e2e8f0;
  margin-top: 0.25rem;
  padding-top: 0.75rem;
  color: #667eea;
  font-weight: 500;
}

.dropdown-option-new:hover {
  background: #f0f4ff;
  color: #5568d3;
}

.new-icon {
  font-size: 1rem;
  line-height: 1;
}

.optional {
  color: #718096;
  font-weight: 400;
  font-size: 0.85rem;
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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.product-modal .form-actions,
.user-modal .form-actions,
.employee-modal .form-actions {
  border-top: 1px solid #e2e8f0;
}

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

.product-modal .btn-primary,
.user-modal .btn-primary,
.employee-modal .btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.product-modal .btn-primary:hover:not(:disabled),
.user-modal .btn-primary:hover:not(:disabled),
.employee-modal .btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .entity-options {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .entity-option-btn {
    padding: 1.5rem 1rem;
  }

  .entity-icon {
    font-size: 2.5rem;
  }

  .entity-label {
    font-size: 1rem;
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
</style>

