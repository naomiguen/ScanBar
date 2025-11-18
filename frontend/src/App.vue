<template>
  <!-- ✅ TAMBAHKAN TOASTER DI SINI -->
  <Toaster position="top-center" richColors expand :duration="3000" />

  <header class="fixed top-0 left-0 right-0 bg-blue-600 text-white shadow-md z-50">
    <div class="flex items-center justify-between px-6 py-7">
      <!-- Logo -->
      <div class="flex items-center space-x-3">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="bg-white text-blue-600 font-bold text-lg px-3 py-1 rounded-lg">
            SB
          </div>
          <span class="font-semibold text-xl">ScanBar</span>
        </router-link>
      </div>

      <!-- Tombol menu (mobile) -->
      <button
        class="md:hidden focus:outline-none"
        @click="toggleMenu"
      >
        <svg
          v-if="!isMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Navigasi Desktop -->
      <nav class="hidden md:flex items-center space-x-5">
        <div v-if="!authStore.isAuthenticated" class="flex space-x-3">
          <router-link
            to="/"
            class="px-4 py-2 rounded-md hover:bg-blue-500 transition"
            active-class="bg-white text-blue-600 font-semibold"
          >
            Home
          </router-link>
          <router-link
            to="/login"
            class="px-4 py-2 rounded-md hover:bg-blue-500 transition"
            active-class="bg-white text-blue-600 font-semibold"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="px-4 py-2 rounded-md hover:bg-blue-500 transition"
            active-class="bg-white text-blue-600 font-semibold"
          >
            Register
          </router-link>
        </div>

        <div v-else class="flex items-center space-x-3">
          <span class="pr-4 border-r border-white/30">
            Halo, {{ authStore.userFullName }}
          </span>
          <router-link
            to="/"
            class="px-4 py-2 rounded-md hover:bg-blue-500 transition"
            active-class="bg-white text-blue-600 font-semibold"
          >
            Home
          </router-link>
          <router-link
            to="/dashboard"
            class="px-4 py-2 rounded-md hover:bg-blue-500 transition"
            active-class="bg-white text-blue-600 font-semibold"
          >
            Dashboard
          </router-link>
          <router-link
            to="/calculator"
            class="px-4 py-2 rounded-md hover:bg-blue-500 transition"
            active-class="bg-white text-blue-600 font-semibold"
          >
            Kalkulator
          </router-link>
          <router-link
            to="/profile"
            class="px-4 py-2 rounded-md hover:bg-blue-500 transition"
            active-class="bg-white text-blue-600 font-semibold"
          >
            Profil
          </router-link>
          <a
            @click="handleLogout"
            class="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 cursor-pointer transition"
          >
            Logout
          </a>
        </div>
      </nav>
    </div>

    <!-- Navigasi Mobile -->
    <transition name="slide-fade">
      <div
        v-if="isMenuOpen"
        class="md:hidden bg-blue-600 border-t border-white/20 px-6 py-3 space-y-3"
      >
        <router-link
          to="/"
          class="block bg-white text-blue-600 font-semibold px-4 py-2 rounded-md"
          @click="closeMenu"
        >
          Home
        </router-link>

        <template v-if="authStore.isAuthenticated">
          <router-link
            to="/dashboard"
            class="block px-4 py-2 hover:bg-blue-500 rounded-md transition"
            @click="closeMenu"
          >
            Dashboard
          </router-link>
          <router-link
            to="/calculator"
            class="block px-4 py-2 hover:bg-blue-500 rounded-md transition"
            @click="closeMenu"
          >
            Kalkulator
          </router-link>
          <router-link
            to="/profile"
            class="block px-4 py-2 hover:bg-blue-500 rounded-md transition"
            @click="closeMenu"
          >
            Profil
          </router-link>
          <a
            @click="handleLogout"
            class="block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Logout
          </a>
        </template>

        <template v-else>
          <router-link
            to="/login"
            class="block px-4 py-2 hover:bg-blue-500 rounded-md transition"
            @click="closeMenu"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="block px-4 py-2 hover:bg-blue-500 rounded-md transition"
            @click="closeMenu"
          >
            Register
          </router-link>
        </template>
      </div>
    </transition>
  </header>

  <main class="pt-24">
    <RouterView />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Toaster } from 'vue-sonner' // ✅ Import Toaster

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
  isMenuOpen.value = false
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
