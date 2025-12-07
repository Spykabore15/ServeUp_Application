<template>
  <div v-if="visible" class="modal" @click.self="handleClose">
    <div class="modal-content approval-modal">
      <div class="modal-header gradient-header">
        <div class="header-left">
          <span class="header-icon">🔔</span>
          <div class="header-text">
            <h2 class="modal-title">Review Access Request</h2>
            <p class="modal-subtitle">Review and approve or deny this access request</p>
          </div>
        </div>
        <button @click="handleClose" class="close-button gradient-close">✕</button>
      </div>

      <div class="modal-body" v-if="request">
        <!-- Request Information -->
        <div class="request-details">
          <div class="detail-section">
            <h3>👤 Personal Information</h3>
            <div class="detail-row">
              <span class="detail-label">Full Name:</span>
              <span class="detail-value">{{ request.full_name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{ request.email }}</span>
            </div>
            <div class="detail-row" v-if="request.username">
              <span class="detail-label">Username:</span>
              <span class="detail-value">{{ request.username }}</span>
            </div>
            <div class="detail-row" v-if="request.phone">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">{{ request.phone }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>💼 Role Information</h3>
            <div class="detail-row">
              <span class="detail-label">Requested Role:</span>
              <span class="role-badge requested">{{ formatRole(request.requested_role) }}</span>
            </div>
            <div class="form-group">
              <label for="assigned_role">Assign Role *</label>
              <select
                v-model="assignedRole"
                id="assigned_role"
                class="form-control"
                required
              >
                <option value="">Select role to assign</option>
                <option value="employe">Employee</option>
                <option value="responsable_stocks">Stock Manager</option>
                <option value="responsable_employes">Employee Manager</option>
                <option value="admin">Admin</option>
              </select>
              <small class="form-hint">You can change the role from what was requested</small>
            </div>
          </div>

          <div class="detail-section" v-if="request.reason">
            <h3>📝 Reason</h3>
            <p class="reason-text">{{ request.reason }}</p>
          </div>

          <div class="detail-section">
            <h3>📅 Request Details</h3>
            <div class="detail-row">
              <span class="detail-label">Submitted:</span>
              <span class="detail-value">{{ formatDate(request.created_at) }}</span>
            </div>
          </div>

          <div class="form-group" v-if="showReviewNotes">
            <label for="review_notes">Review Notes (Optional)</label>
            <textarea
              v-model="reviewNotes"
              id="review_notes"
              rows="3"
              class="form-control"
              placeholder="Add any notes about this approval..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="handleClose" class="btn btn-secondary">Cancel</button>
        <button @click="handleDeny" class="btn btn-deny" :disabled="isProcessing">
          {{ isProcessing ? '⏳' : '❌' }} Deny
        </button>
        <button @click="handleApprove" class="btn btn-approve" :disabled="isProcessing || !assignedRole">
          {{ isProcessing ? '⏳ Processing...' : '✅ Approve' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import accessRequestService from '../services/accessRequestService'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  request: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'approved', 'denied'])

const assignedRole = ref('')
const reviewNotes = ref('')
const isProcessing = ref(false)
const showReviewNotes = ref(false)

watch(() => props.request, (newRequest) => {
  if (newRequest) {
    // Default to requested role, but admin can change it
    assignedRole.value = newRequest.requested_role || ''
    reviewNotes.value = ''
    showReviewNotes.value = false
  }
}, { immediate: true })

const formatRole = (role) => {
  const roleMap = {
    'admin': 'Admin',
    'responsable_stocks': 'Stock Manager',
    'responsable_employes': 'Employee Manager',
    'employe': 'Employee'
  }
  return roleMap[role] || role
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const handleClose = () => {
  emit('close')
}

const handleApprove = async () => {
  if (!assignedRole.value) {
    alert('❌ Please select a role to assign')
    return
  }

  if (!confirm(`Are you sure you want to approve this request and assign the role "${formatRole(assignedRole.value)}"?`)) {
    return
  }

  isProcessing.value = true
  try {
    const response = await accessRequestService.approveAccessRequest(props.request.id, {
      assigned_role: assignedRole.value,
      review_notes: reviewNotes.value || null
    })
    
    if (response && response.success) {
      alert('✅ Access request approved! User account created.')
      emit('approved', props.request.id)
      handleClose()
    } else {
      alert('❌ Error: ' + (response?.message || 'Failed to approve request'))
    }
  } catch (error) {
    console.error('Approve error:', error)
    alert('❌ Error: ' + (error.response?.data?.message || error.message || 'Failed to approve request'))
  } finally {
    isProcessing.value = false
  }
}

const handleDeny = async () => {
  const notes = prompt('Please provide a reason for denial (optional):')
  if (notes === null) return // User cancelled

  isProcessing.value = true
  try {
    await accessRequestService.denyAccessRequest(props.request.id, notes || '')
    alert('✅ Access request denied.')
    emit('denied', props.request.id)
    handleClose()
  } catch (error) {
    alert('❌ Error: ' + (error.response?.data?.message || error.message || 'Failed to deny request'))
  } finally {
    isProcessing.value = false
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-title {
  color: white;
  font-size: 1.6rem;
  margin: 0;
}

.modal-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  margin: 0;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
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
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 2rem;
}

.request-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f7fafc;
}

.detail-label {
  font-weight: 500;
  color: #718096;
  font-size: 0.9rem;
}

.detail-value {
  color: #2d3748;
  font-weight: 500;
}

.role-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.role-badge.requested {
  background: #e3f2fd;
  color: #1976d2;
}

.form-group {
  margin-top: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
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
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #718096;
}

.reason-text {
  color: #4a5568;
  line-height: 1.6;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin: 0;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover:not(:disabled) {
  background: #cbd5e0;
}

.btn-approve {
  background: #28a745;
  color: white;
}

.btn-approve:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-deny {
  background: #dc3545;
  color: white;
}

.btn-deny:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}
</style>

