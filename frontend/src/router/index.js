import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import CalculatorView from '../views/CalculatorView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guest: true } // Hanya untuk user yang belum login
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { guest: true } // Hanya untuk user yang belum login
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
    meta: { guest: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: CalculatorView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// --- NAVIGATION GUARD (IMPROVED) ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Cek session hanya sekali saat pertama kali load
  if (authStore.user === null) {
    await authStore.checkSession()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta.guest)
  const isAuthenticated = authStore.isAuthenticated

  // 1. Jika route butuh auth tapi user belum login → redirect ke login
  if (requiresAuth && !isAuthenticated) {
    console.log('❌ Butuh auth, redirect ke login')
    next({
      name: 'Login',
      query: { redirect: to.fullPath } // Save intended destination
    })
  }
  // 2. Jika route untuk guest (login/register) tapi user sudah login → redirect ke dashboard
  else if (isGuestRoute && isAuthenticated) {
    console.log('✅ Sudah login, redirect ke dashboard')
    next({ name: 'Dashboard' })
  }
  // 3. Selainnya, biarkan lewat
  else {
    console.log('✅ Route diizinkan:', to.name)
    next()
  }
})

export default router
