<template>
  <!-- Container Utama - Full height dengan padding untuk navbar -->
  <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 pt-18 pb-8">

    <!-- Card Register -->
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-10 text-center animate-fade-in">

      <!-- Logo Icon -->
      <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/30">
        SB
      </div>

      <!-- Header Title -->
      <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
        Buat Akun Baru
      </h1>

      <!-- Subtitle -->
      <p class="text-base text-slate-600 mb-8">
        Daftar untuk mulai melacak nutrisi Anda
      </p>

      <!-- Form Register -->
      <div class="space-y-5">

        <!-- Input Nama -->
        <div class="text-left">
          <label for="name" class="block mb-2 font-semibold text-slate-700">
            Nama
          </label>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="Masukkan nama lengkap"
            required
            class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
          />
        </div>

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
            placeholder="Buat password yang kuat"
            required
            class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
          />
          <!-- Password hint -->
          <p class="text-xs text-slate-500 mt-2">
            Minimal 6 karakter untuk keamanan yang lebih baik
          </p>
        </div>

        <!-- Error Message (jika ada) -->
        <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl text-sm text-left">
          {{ errorMessage }}
        </div>

        <!-- Success Message (jika ada) -->
        <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-xl text-sm text-left">
          {{ successMessage }}
        </div>

        <!-- Submit Button -->
        <button
          @click="handleRegister"
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
          {{ isLoading ? 'Memproses...' : 'Register' }}
        </button>
      </div>

      <!-- Extra Links -->
      <div class="mt-6 pt-6 border-t border-slate-200">
        <p class="text-slate-600">
          <RouterLink to="/login" class="text-blue-600 font-semibold hover:underline transition-all">
            Sudah punya akun? Login di sini
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
const name = ref('')
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref(null)
const successMessage = ref(null)

/**
 * Fungsi untuk menangani proses registrasi
 * - Validasi input (nama, email, password tidak boleh kosong)
 * - Validasi panjang password minimal 6 karakter
 * - Panggil authStore.register dengan data user
 * - Jika berhasil: tampilkan toast sukses dan redirect ke login
 * - Jika gagal: tampilkan pesan error
 */
const handleRegister = async () => {
  // Reset pesan error/success sebelumnya
  errorMessage.value = null
  successMessage.value = null

  // Validasi: pastikan semua field terisi
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Semua field harus diisi.'
    toast.error('Semua field harus diisi')
    return
  }

  // Validasi: password minimal 6 karakter
  if (password.value.length < 6) {
    errorMessage.value = 'Password minimal 6 karakter.'
    toast.error('Password minimal 6 karakter')
    return
  }

  // Validasi: format email valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Format email tidak valid.'
    toast.error('Format email tidak valid')
    return
  }

  // Set loading state
  isLoading.value = true

  try {
    // Panggil fungsi register dari auth store
    const success = await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    })

    if (success) {
      // Registrasi berhasil: tampilkan notifikasi sukses
      toast.success('Registrasi Berhasil!', {
        description: 'Akun Anda telah dibuat. Silakan login.',
        duration: 2000
      })

      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      // Registrasi gagal: tampilkan pesan error
      errorMessage.value = 'Email sudah terdaftar atau terjadi kesalahan. Silakan coba lagi.'
      toast.error('Registrasi Gagal', {
        description: 'Email sudah terdaftar atau terjadi kesalahan'
      })
    }
  } catch (error) {
    // Handle error yang tidak terduga
    console.error('Register error:', error)
    errorMessage.value = 'Terjadi kesalahan saat registrasi. Silakan coba lagi.'
    toast.error('Terjadi kesalahan saat registrasi')
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

/* Hover effect untuk links */
a {
  transition: all 0.3s ease;
}
</style>
