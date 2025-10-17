<template>
  <div class="register-page-container">
    <div class="register-card">
      <div class="logo-icon">SB</div>
      <h1>Buat Akun Baru</h1>
      <p class="subtitle">Daftar untuk mulai melacak nutrisi Anda</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nama</label>
          <input type="text" id="name" v-model="name" placeholder="Masukkan nama lengkap" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="nama@email.com" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Buat password yang kuat" required>
        </div>
        <button type="submit" class="submit-button">Register</button>
      </form>
    </div>

    <div class="extra-links-container">
      <p><RouterLink to="/login">Sudah punya akun? Login di sini</RouterLink></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleRegister = () => {
  authStore.register({
    name: name.value,
    email: email.value,
    password: password.value
  });
};
</script>

<style scoped>
/* Style ini sengaja dibuat identik dengan halaman login untuk konsistensi */
.register-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  background-color: #f8fafc;
  padding: 2rem;
}

.register-card {
  background: white;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background-color: #2563eb;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: bold;
  margin: 0 auto 1.5rem auto;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  margin-bottom: 2.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #475569;
}

.form-group input {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 0.9rem;
  border: none;
  background-color: #2563eb;
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.submit-button:hover {
  background-color: #1d4ed8;
}

.extra-links-container {
  text-align: center;
  margin-top: 2rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.extra-links-container a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.extra-links-container a:hover {
  text-decoration: underline;
}
</style>
