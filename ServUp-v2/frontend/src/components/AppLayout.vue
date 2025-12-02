<template>
  <div class="app-layout">
    <!-- Sidebar Navigation -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo-container">
          <img 
            :src="logoImage" 
            alt="ServUp Logo" 
            class="app-logo"
            :class="{ 'logo-collapsed': sidebarCollapsed }"
          />
        </div>
        <button @click="toggleSidebar" class="toggle-btn">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>

      <nav class="nav-menu">
        <router-link 
          v-for="item in visibleMenuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useSettingsStore } from '../store/settings'
import logoImage from '../assets/logo.png'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const sidebarCollapsed = ref(false)

// Load user and preferences on mount
onMounted(async () => {
  // If user has a token but user data isn't loaded, fetch it
  if (authStore.token && !authStore.user) {
    await authStore.fetchCurrentUser()
  } else if (authStore.user) {
    // If user is already loaded, just load their preferences
    settingsStore.loadUserPreferences()
  }
})

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

// Filter menu items based on user role - hide inaccessible items
const visibleMenuItems = computed(() => {
  return menuItems.filter(item => canAccessRoute(item.roles))
})

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
  padding: 2.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 0 0 16px 16px;
  margin-bottom: 0.5rem;
  min-height: 160px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  padding: 1rem;
  width: 100%;
}

.app-logo {
  height: 140px;
  width: 140px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 6px 16px rgba(102, 126, 234, 0.3));
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.app-logo:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 8px 20px rgba(102, 126, 234, 0.5));
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}

.app-logo.logo-collapsed {
  height: 55px;
  width: 55px;
  padding: 8px;
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

