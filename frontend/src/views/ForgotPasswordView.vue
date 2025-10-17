<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Lupa Password</h1>
      <p>Masukkan email Anda untuk menerima link reset password.</p>
      <form @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <button type="submit" class="submit-button">Kirim Link</button>
      </form>

      <div class="extra-links">
        <RouterLink to="/login">Kembali ke Login</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Impor file CSS yang sama
import '@/assets/auth.css';

const email = ref('');
const authStore = useAuthStore();

const handleForgotPassword = () => {
  authStore.forgotPassword(email.value);
};
</script>
