<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-lg">
    <div class="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3">
      <div class="flex justify-between items-center">
        <!-- Logo Section -->
        <div
          class="flex items-center gap-2 cursor-pointer group"
          @click="$router.push('/admin')"
        >
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-800 dark:text-white leading-tight">Admin Panel</h1>
            <p class="text-slate-500 dark:text-slate-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">Dashboard Management</p>
          </div>
        </div>

        <!-- Tablet Navigation (md-lg) -->
        <div class="hidden md:flex lg:hidden items-center gap-3">
          <nav class="flex gap-1">
            <router-link
              to="/admin"
              active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              class="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Dashboard
            </router-link>

            <router-link
              to="/admin/add-product"
              active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              class="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Tambah
            </router-link>

            <router-link
              to="/admin/trash"
              active-class="bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400"
              class="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Sampah
            </router-link>
          </nav>

          <button
            @click="handleLogout"
            class="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95"
          >
            <span>Keluar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>

        <!-- Desktop Navigation (lg+) -->
        <div class="hidden lg:flex items-center gap-4 xl:gap-6">
          <nav class="flex gap-1">
            <router-link
              to="/admin"
              active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              class="px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Dashboard
            </router-link>

            <router-link
              to="/admin/add-product"
              active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              class="px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Tambah Produk
            </router-link>

            <router-link
              to="/admin/trash"
              active-class="bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400"
              class="px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Sampah
            </router-link>
          </nav>

          <div class="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>

          <div class="flex items-center gap-2 xl:gap-3">
            <div class="text-right">
              <p class="text-xs xl:text-sm font-semibold text-slate-800 dark:text-white leading-tight">Hayy, Yang Mulia!</p>
              <p class="text-[10px] xl:text-xs text-slate-500 dark:text-slate-400 leading-tight">Selamat datang kembali</p>
            </div>
            <button
              @click="handleLogout"
              class="flex items-center gap-1.5 xl:gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 xl:px-4 py-2 xl:py-2.5 rounded-lg xl:rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
            >
              <span>Keluar</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 xl:w-4 xl:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button & Logout (sm and below) -->
        <div class="flex md:hidden items-center gap-1.5 sm:gap-2">
          <button
            @click="handleLogout"
            class="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-200 active:scale-95"
          >
            <span class="hidden xs:inline">Keluar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav v-if="mobileMenuOpen" class="md:hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700 space-y-1">
          <router-link
            to="/admin"
            active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
            class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            @click="mobileMenuOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </router-link>

          <router-link
            to="/admin/add-product"
            active-class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
            class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            @click="mobileMenuOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Produk</span>
          </router-link>

          <router-link
            to="/admin/trash"
            active-class="bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 font-semibold"
            class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            @click="mobileMenuOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Tempat Sampah</span>
          </router-link>

          <div class="pt-2 sm:pt-3 px-3 sm:px-4">
            <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-0.5 sm:mb-1">Logged in as</p>
            <p class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">Admin</p>
          </div>
        </nav>
      </Transition>
    </div>
  </header>

  <!-- Spacer to prevent content from going under fixed header -->
  <div class="h-[60px] sm:h-[68px] md:h-[72px] lg:h-[76px]"></div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();
const router = useRouter();
const mobileMenuOpen = ref(false);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
  toast.success('Berhasil Keluar');
};
</script>
