<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Reset Password</h1>
      <p>Masukkan password baru Anda di bawah ini.</p>

      <form @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="password">Password Baru</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Masukkan password baru (min. 6 karakter)"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Konfirmasi Password Baru</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Ulangi password baru"
            required
          />
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Menyimpan...' : 'Simpan Password Baru' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import '@/assets/auth.css'

const router = useRouter()
const authStore = useAuthStore()
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

// Validasi token saat halaman dimuat
onMounted(async () => {
  // Cek apakah ada session recovery (dari link email)
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const accessToken = hashParams.get('access_token')
  const type = hashParams.get('type')

  // Jika tidak ada token atau bukan tipe recovery, redirect ke login
  if (!accessToken || type !== 'recovery') {
    toast.error('Link Tidak Valid', {
      description: 'Link reset password tidak valid atau sudah kadaluarsa. Silakan minta link baru.',
      duration: 3000
    })
    setTimeout(() => {
      router.push('/forgot-password')
    }, 3000)
  }
})

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error('Password Tidak Cocok', {
      description: 'Pastikan password dan konfirmasi password sama.'
    })
    return
  }

  // Validasi panjang password
  if (password.value.length < 6) {
    toast.error('Password Terlalu Pendek', {
      description: 'Password minimal harus 6 karakter.'
    })
    return
  }

  isLoading.value = true

  try {
    // Supabase otomatis memvalidasi token dari URL
    await authStore.resetPassword(password.value)

    toast.success('Password Berhasil Diubah!', {
      description: 'Silakan login dengan password baru Anda.',
      duration: 2000
    })

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    toast.error('Gagal Reset Password', {
      description: error.message || 'Token mungkin sudah kadaluarsa. Coba kirim ulang link reset.'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
