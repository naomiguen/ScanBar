<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Lupa Password</h1>
      <p>Masukkan email Anda untuk menerima link reset password.</p>
      <form @submit.prevent="handleForgotPassword">
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

      <div class="extra-links">
        <RouterLink to="/login">Kembali ke Login</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Impor file CSS yang sama
import '@/assets/auth.css';

const email = ref('');
const authStore = useAuthStore();
const isLoading = ref(false)

const handleForgotPassword = async () => {
  if (!email.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Email Kosong',
      text: 'Silakan masukkan email anda terlebih dahulu.'

    });
    return;
  }

  isLoading.value = true;

  try {
    await authStore.forgotPassword(email.value);
    Swal.fire({
      icon: 'success',
      title: 'Link Reset Dikirim!',
      text: 'Periksa email anda untuk melanjutkan proses reset password.'

    });
    email.value = '';
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Mengirim Link',
      text: error.message || 'Terjadi kesalahan saat mengirim email reset password.'
    });
  } finally {
    isLoading.value = false;
  }

};
</script>
