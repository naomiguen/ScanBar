<template>
  <!-- Container Utama - Full height dengan padding untuk navbar -->
  <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 pt-18 pb-8">

    <!-- Card Login -->
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-10 text-center animate-fade-in">

      <!-- Logo Icon -->
      <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/30">
        SB
      </div>

      <!-- Header Title -->
      <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
        Login ke ScanBar
      </h1>

      <!-- Subtitle -->
      <p class="text-base text-slate-600 mb-8">
        Masuk untuk melacak nutrisi Anda
      </p>

      <!-- Form Login -->
      <div class="space-y-5">

        <!-- Input Email -->
        <div class="text-left">
          <label for="email" class="block mb-2 font-semibold text-slate-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="nama@email.com"
            required
            class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
          />
        </div>

        <!-- Input Password -->
        <div class="text-left">
          <label for="password" class="block mb-2 font-semibold text-slate-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Masukkan password"
            required
            class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl text-sm text-left">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          @click="handleLogin"
          :disabled="isLoading"
          :class="[
            'w-full px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2',
            isLoading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 shadow-lg shadow-blue-500/30'
          ]"
        >
          <!-- Loading State -->
          <span v-if="isLoading" class="animate-spin">⏳</span>
          {{ isLoading ? 'Memproses...' : 'Login' }}
        </button>
      </div>

      <!-- Extra Links -->
      <div class="mt-8 pt-6 border-t border-slate-200 space-y-3">
        <p class="text-slate-600">
          <RouterLink to="/forgot-password" class="text-blue-600 font-semibold hover:underline transition-all">
            Lupa Password?
          </RouterLink>
        </p>
        <p class="text-slate-600">
          <RouterLink to="/register" class="text-blue-600 font-semibold hover:underline transition-all">
            Belum punya akun? Daftar di sini
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Footer Text (Optional) -->
    <p class="text-sm text-slate-500 mt-6 text-center">
      © 2025 ScanBar. Pantau nutrisi Anda dengan mudah.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

// State Management
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref(null)

/**
 * Fungsi untuk menangani proses login
 * - Validasi input tidak boleh kosong
 * - Panggil authStore.login dengan credentials
 * - Jika berhasil: tampilkan toast sukses dan redirect ke home
 * - Jika gagal: tampilkan pesan error
 */
const handleLogin = async () => {
  // Validasi: pastikan email dan password tidak kosong
  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan password harus diisi.'
    toast.error('Email dan password harus diisi')
    return
  }

  // Set loading state
  isLoading.value = true
  errorMessage.value = null

  try {
    // Panggil fungsi login dari auth store
    const success = await authStore.login({
      email: email.value,
      password: password.value
    })

    if (success) {
      // Login berhasil: tampilkan notifikasi toast
      toast.success('Login Berhasil!', {
        description: 'Selamat datang kembali!',
        duration: 1500
      })


    } else {
      // Login gagal: tampilkan pesan error
      errorMessage.value = 'Email atau password salah. Silakan coba lagi.'
      toast.error('Login Gagal', {
        description: 'Email atau password salah'
      })
    }
  } catch (error) {
    // Handle error yang tidak terduga
    console.error('Login error:', error)
    errorMessage.value = 'Terjadi kesalahan. Silakan coba lagi.'
    toast.error('Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    // Reset loading state
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Animasi fade in dari bawah */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.5s ease-out;
}

/* Animasi spinning untuk loading icon */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus enhancement untuk accessibility */
input:focus {
  outline: none;
}

/* Hover effect untuk links  */
a {
  transition: all 0.3s ease;
}
</style>
