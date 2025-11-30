import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

// Import views
import LoginView from '../views/LoginView.vue'
import AppLayout from '../components/AppLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductsView from '../views/ProductsView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import OrdersView from '../views/OrdersView.vue'
import SuppliersView from '../views/SuppliersView.vue'
import UsersView from '../views/UsersView.vue'
import ReportsView from '../views/ReportsView.vue'
import SettingsView from '../views/SettingsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
      },
      {
        path: 'products',
        name: 'products',
        component: ProductsView,
        meta: { 
          requiresAuth: true,
          roles: ['admin', 'responsable_stocks']
        }
      },
      {
        path: 'employees',
        name: 'employees',
        component: EmployeesView,
        meta: { 
          requiresAuth: true,
          roles: ['admin', 'responsable_employes']
        }
      },
      {
        path: 'orders',
        name: 'orders',
        component: OrdersView,
        meta: { requiresAuth: true }
      },
      {
        path: 'suppliers',
        name: 'suppliers',
        component: SuppliersView,
        meta: { 
          requiresAuth: true,
          roles: ['admin', 'responsable_stocks']
        }
      },
      {
        path: 'users',
        name: 'users',
        component: UsersView,
        meta: { 
          requiresAuth: true,
          roles: ['admin']
        }
      },
      {
        path: 'reports',
        name: 'reports',
        component: ReportsView,
        meta: { 
          requiresAuth: true,
          roles: ['admin', 'responsable_stocks', 'responsable_employes']
        }
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsView,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const allowedRoles = to.meta.roles

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    // Redirect to dashboard if already logged in
    next({ name: 'dashboard' })
  } else if (allowedRoles && !allowedRoles.includes(authStore.user?.role)) {
    // Redirect to dashboard if user doesn't have required role
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router

