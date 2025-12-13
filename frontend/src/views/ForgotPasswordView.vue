<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="forgot-password-title">Lupa Password</h1>
      <p>Masukkan email Anda untuk menerima link reset password.</p>

      <div v-if="emailSent" class="success-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h2>Link Reset Berhasil Dikirim!</h2>
        <p>Kami telah mengirimkan link reset password ke email <strong>{{ sentEmail }}</strong>. Silakan periksa inbox atau folder spam Anda.</p>
        <RouterLink to="/login" class="back-to-login">Kembali ke Login</RouterLink>
      </div>

      <form v-else @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Masukkan email Anda"
            required
          />
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Mengirim...' : 'Kirim Link Reset' }}
        </button>
      </form>

      <div v-if="!emailSent" class="extra-links">
        <RouterLink to="/login">Kembali ke Login</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

// Impor file CSS yang sama
import '@/assets/auth.css'

const email = ref('')
const authStore = useAuthStore()
const isLoading = ref(false)
const emailSent = ref(false)
const sentEmail = ref('')

const handleForgotPassword = async () => {
  if (!email.value) {
    toast.warning('Email Kosong', {
      description: 'Silakan masukkan email anda terlebih dahulu.'
    })
    return
  }

  isLoading.value = true

  try {
    await authStore.forgotPassword(email.value)
    sentEmail.value = email.value
    emailSent.value = true
    toast.success('Link Reset Dikirim!', {
      description: 'Periksa email anda untuk melanjutkan proses reset password.'
    })
  } catch (error) {
    toast.error('Gagal Mengirim Link', {
      description: error.message || 'Terjadi kesalahan saat mengirim email reset password.'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.forgot-password-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.success-message {
  text-align: center;
  padding: 2rem 0;
}

.success-message svg {
  color: #10b981;
  margin: 0 auto 1.5rem;
}

.success-message h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 1rem;
}

.success-message p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.success-message strong {
  color: #1f2937;
  font-weight: 600;
}

.back-to-login {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.back-to-login:hover {
  background-color: #2563eb;
}
</style>
