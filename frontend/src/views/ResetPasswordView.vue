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
            minlength = "6"
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
import { useRouter} from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
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
    Swal.fire({
      icon: 'error',
      title: 'Link Tidak Valid',
      text: 'Link reset password tidak valid atau sudah kadaluarsa. Silakan minta link baru.',
      confirmButtonText: 'OK'
    }).then(() => {
      router.push('/forgot-password')
    })
  }
})

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: 'Password Tidak Cocok',
      text: 'Pastikan password dan konfirmasi password sama.',
    })
    return
  }

  // Validasi panjang password
  if (password.value.length < 6) {
    Swal.fire({
      icon: 'error',
      title: 'Password Terlalu Pendek',
      text: 'Password minimal harus 6 karakter.',
    })
    return
  }

  isLoading.value = true

  try {
    // Supabase otomatis memvalidasi token dari URL
    await authStore.resetPassword(password.value)

    Swal.fire({
      icon: 'success',
      title: 'Password Berhasil Diubah!',
      text: 'Silakan login dengan password baru Anda.',
    }).then(() => router.push('/login'))
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Reset Password',
      text: error.message || 'Token mungkin sudah kadaluarsa. Coba kirim ulang link reset.',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
