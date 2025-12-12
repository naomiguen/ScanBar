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
import PhotoScanView from '../views/PhotoScan.vue'
import AdminDashboardView from '../views/AdminDashboard.vue'
import AdminAddProductView from '@/views/AdminAddProductView.vue'
import AdminTrashView from '@/views/AdminTrashView.vue';
import CvView from '@/views/cvView.vue'

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
    path: '/photo-scan',
    name: 'PhotoScan',
    component: PhotoScanView,
    meta: { requiresAuth: true } // Butuh login untuk simpan ke jurnal
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about-me',
    name: 'AboutMe',
    component: CvView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
  path: '/admin/add-product',
  name: 'AdminAddProduct',
  component: AdminAddProductView,
  meta: { requiresAuth: true, requiresAdmin: true }
},

  {
    path: '/admin/trash',
    name: 'AdminTrash',
    component: AdminTrashView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Selalu cek session jika user ada DAN profile belum di-load
  if (authStore.user && !authStore.isProfileLoaded) {
    console.log('⏳ Menunggu profile di-load...')
    await authStore.checkSession()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const isGuestRoute = to.matched.some(record => record.meta.guest)
  const isAuthenticated = authStore.isAuthenticated

  console.log('🔍 Router Guard:', {
    to: to.name,
    from: from.name,
    isAuthenticated,
    isAdmin: authStore.isAdmin,
    role: authStore.role,
    requiresAdmin,
    isProfileLoaded: authStore.isProfileLoaded
  })

  // Cek Rute Khusus Admin
  if (requiresAdmin) {
    console.log('🔐 Checking admin access...')

    // Kalau belum login, suruh login dulu
    if (!isAuthenticated) {
      console.log('❌ Admin route: User belum login')
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    // Tunggu profile loaded dulu sebelum cek isAdmin
    if (!authStore.isProfileLoaded) {
      console.log('⏳ Admin route: Menunggu profile loaded...')
      await authStore.fetchUserProfile()
    }

    console.log('👤 Final check - isAdmin:', authStore.isAdmin, 'role:', authStore.role)

    // Kalau sudah login TAPI BUKAN ADMIN → Tendang ke Dashboard biasa
    if (!authStore.isAdmin) {
      console.warn('⛔ Akses Ditolak: User biasa mencoba masuk Admin Panel')
      next({ name: 'Dashboard' })
      return
    }

    console.log('✅ Admin akses diberikan - allowing navigation')
    next()
    return
  }

  // Jika route butuh auth tapi user belum login → redirect ke login
  if (requiresAuth && !isAuthenticated) {
    console.log('❌ Butuh auth, redirect ke login')
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Jika route untuk guest (login/register) tapi user sudah login → redirect ke dashboard
  if (isGuestRoute && isAuthenticated) {
    console.log('✅ Sudah login, redirect ke dashboard yang sesuai')

    // Tunggu profile loaded dulu
    if (!authStore.isProfileLoaded) {
      await authStore.fetchUserProfile()
    }

    if (authStore.isAdmin) {
      next({ name: 'AdminDashboard' })
    } else {
      next({ name: 'Dashboard' })
    }
    return
  }

  next()
})

export default router
