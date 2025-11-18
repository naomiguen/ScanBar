<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>🛡️ Admin Panel</h1>
      <div class="header-actions">
        <span>Halo, Boss!</span>
        <button @click="handleLogout" class="logout-btn">Keluar</button>
      </div>
    </header>

    <main class="admin-content">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Pengguna</h3>
          <p class="stat-number">Loading...</p>
        </div>
        <div class="stat-card">
          <h3>Total Produk</h3>
          <p class="stat-number">4 Juta+</p>
        </div>
        <div class="stat-card">
          <h3>Artikel</h3>
          <p class="stat-number">Loading...</p>
        </div>
      </div>

      <div class="section-title">
        <h2>Manajemen Pengguna</h2>
      </div>

      <div class="user-table-placeholder">
        <p>Tabel pengguna akan muncul di sini...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  // Router push ke login sudah ditangani di authStore
};
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: 'Inter', sans-serif;
}

.admin-header {
  background-color: #1e293b; /* Warna Gelap untuk Admin */
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 15px;
}

.admin-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
  margin-top: 0.5rem;
}

.user-table-placeholder {
  background: white;
  padding: 3rem;
  text-align: center;
  border-radius: 10px;
  border: 2px dashed #cbd5e1;
  color: #64748b;
}
</style>
