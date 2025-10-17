import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Impor semua komponen View Anda
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ProfileView from '@/views/ProfileView.vue';
import CalculatorView from '@/views/CalculatorView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';

const routes = [
  // Rute Publik
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
  { path: '/resetpassword/:token', name: 'reset-password', component: ResetPasswordView },

  // Rute yang Membutuhkan Login
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/calculator',
    name: 'calculator',
    component: CalculatorView,
    meta: { requiresAuth: true }
  },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// "Penjaga Keamanan" (Navigation Guard)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Cek apakah rute butuh login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' });
  }

  // Cek apakah rute butuh status admin
  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    // Jika bukan admin, lempar ke dashboard atau halaman lain
    return next({ name: 'dashboard' });
  }

  // Jika semua aman, lanjutkan
  next();
});

export default router;
