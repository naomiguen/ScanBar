<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Reset Password</h1>
      <p>Masukkan password baru Anda di bawah ini.</p>
      <form @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="password">Password Baru</label>
          <input type="password" id="password" v-model="password" required>
        </div>
         <div class="form-group">
          <label for="confirmPassword">Konfirmasi Password Baru</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required>
        </div>
        <button type="submit" class="submit-button">Simpan Password Baru</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

// Impor file CSS agar tampilannya bagus
import '@/assets/auth.css';

const password = ref('');
const confirmPassword = ref('');

const route = useRoute(); // Untuk mengakses parameter dari URL
const authStore = useAuthStore();

const handleResetPassword = () => {
  // 1. Validasi jika password tidak cocok
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: 'Password Tidak Cocok',
      text: 'Pastikan password baru dan konfirmasinya sama.'
    });
    return;
  }

  // 2. Ambil token dari URL
  const token = route.params.token;

  // 3. Panggil fungsi di store dengan token dan password baru
  authStore.resetPassword({ token, password: password.value });
};
</script>
