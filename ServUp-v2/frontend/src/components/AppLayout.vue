<template>
  <div class="app-layout">
    <!-- Sidebar Navigation -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <h2 class="app-title">🍽️ ServUp</h2>
        <button @click="toggleSidebar" class="toggle-btn">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>

      <nav class="nav-menu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ disabled: !canAccessRoute(item.roles) }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div v-if="!sidebarCollapsed" class="user-info">
          <p class="user-name">{{ authStore.userName }}</p>
          <p class="user-role">{{ authStore.userRole }}</p>
        </div>
        <button @click="handleLogout" class="logout-btn">
          <span class="nav-icon">🚪</span>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()
const sidebarCollapsed = ref(false)

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: null },
  { path: '/products', label: 'Stock Management', icon: '📦', roles: ['admin', 'responsable_stocks'] },
  { path: '/employees', label: 'Employee Management', icon: '👥', roles: ['admin', 'responsable_employes'] },
  { path: '/orders', label: 'Orders', icon: '🛒', roles: null },
  { path: '/suppliers', label: 'Suppliers', icon: '🏭', roles: ['admin', 'responsable_stocks'] },
  { path: '/users', label: 'User Management', icon: '👤', roles: ['admin'] },
  { path: '/reports', label: 'Reports & Analytics', icon: '📈', roles: ['admin', 'responsable_stocks', 'responsable_employes'] },
  { path: '/settings', label: 'Settings', icon: '⚙️', roles: null }
]

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const canAccessRoute = (roles) => {
  if (!roles) return true
  return roles.includes(authStore.user?.role)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}

.collapsed .app-title {
  font-size: 1.5rem;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-color);
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toggle-btn:hover {
  opacity: 1;
}

/* Navigation Menu */
.nav-menu {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.9rem 1.2rem;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  gap: 0.8rem;
}

.collapsed .nav-item {
  justify-content: center;
  padding: 0.9rem 0.5rem;
}

.nav-item:hover {
  background: var(--bg-hover);
  border-left-color: var(--primary-color);
}

.nav-item.router-link-active {
  background: var(--primary-light);
  border-left-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
}

.nav-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.nav-icon {
  font-size: 1.3rem;
  min-width: 24px;
  text-align: center;
}

.nav-label {
  white-space: nowrap;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.user-info {
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.user-name {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
  text-transform: capitalize;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: var(--danger-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s;
}

.collapsed .logout-btn {
  justify-content: center;
  padding: 0.8rem 0.5rem;
}

.logout-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.logout-btn:active {
  transform: translateY(0);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  background: var(--bg-primary);
  min-height: 100vh;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }
  
  .sidebar.collapsed {
    width: 0;
    overflow: hidden;
  }
  
  .main-content {
    padding: 1rem;
  }
}

/* Dark mode adjustments */
:global(.dark-mode) .sidebar {
  background: #1e1e1e;
  border-right-color: #333;
}

:global(.dark-mode) .sidebar-header,
:global(.dark-mode) .sidebar-footer {
  border-color: #333;
}

:global(.dark-mode) .nav-item:hover {
  background: #2a2a2a;
}

:global(.dark-mode) .nav-item.router-link-active {
  background: rgba(52, 152, 219, 0.15);
}
</style>

