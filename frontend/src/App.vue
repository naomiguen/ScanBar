<template>
  <header class="main-header">
    <div class="logo">
      <router-link to="/">
        <span class="logo-icon">SB</span>
        <span class="logo-text">ScanBar</span>
      </router-link>
    </div>

    <nav class="main-nav">
      <div v-if="!authStore.isAuthenticated" class="nav-links">
        <router-link to="/" class="nav-button">Home</router-link>
        <router-link to="/login" class="nav-button">Login</router-link>
        <router-link to="/register" class="nav-button">Register</router-link>
      </div>

      <div v-else class="nav-links">
        <span class="welcome-text">Halo, {{ authStore.user?.name }}</span>
        <router-link to="/" class="nav-button">Home</router-link>

        <router-link to="/dashboard" class="nav-button">Dashboard</router-link>
        <router-link to="/calculator" class="nav-button">Kalkulator</router-link>

        <router-link to="/profile" class="nav-button">Profil</router-link>
        <a @click="handleLogout" class="nav-button logout-button">Logout</a>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<style>
/* Reset dan Global Styles */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; }
main { padding: 0; }

/* Header Styling - STICKY NAVBAR */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background-color: #2563eb;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: 80px;
  z-index: 1000;
  transition: all 0.3s ease;
}

/* Animasi halus saat scroll */
.main-header.scrolled {
  box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.15);
}

.logo a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  color: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
}

.logo-text {
  font-weight: 700;
  font-size: 1.5rem;
  color: white;
}

.main-nav .nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Tombol Navigasi */
.nav-button {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background-color: transparent;
  color: white;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Gaya saat link aktif */
.nav-button.router-link-exact-active {
  background-color: white;
  color: #2563eb;
  border-color: white;
}

/* Tombol logout khusus */
.logout-button {
  background-color: #ef4444;
  border-color: #ef4444;
}
.logout-button:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}

.welcome-text {
  font-weight: 500;
  color: white;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  padding-right: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-header {
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
    height: auto;
    min-height: 80px;
  }

  .main-nav .nav-links {
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .nav-button {
    padding: 0.5rem 0.8rem;
    font-size: 0.875rem;
  }

  .welcome-text {
    font-size: 0.875rem;
    padding-right: 0.75rem;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.25rem;
  }

  .logo-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}
</style>
