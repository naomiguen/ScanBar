<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 toast-center">
    <header class="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl sticky top-0 z-50">
      <div class="w-full px-6 sm:px-8 lg:px-12 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="bg-blue-500 p-2 rounded-lg">
              <span class="text-2xl">🛡️</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold">Admin Panel</h1>
              <p class="text-slate-300 text-sm">Dashboard Management</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span class="hidden sm:block text-slate-200 font-medium">Halo, Yang Mulia!</span>
            <button
              @click="handleLogout"
              class="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              <span class="hidden sm:inline">Keluar</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-blue-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Live</span>
            </div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Pengguna</h3>
            <p class="text-3xl font-bold text-blue-600">
              {{ isLoadingStats ? '...' : stats.totalUsers }}
            </p>
          </div>
          <div class="bg-blue-50 px-6 py-3">
            <p class="text-xs text-gray-600">Data real-time pengguna terdaftar</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-green-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">4M+</span>
            </div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Produk</h3>
            <p class="text-3xl font-bold text-green-600">
              {{ stats.totalProducts }}
            </p>
          </div>
          <div class="bg-green-50 px-6 py-3">
            <p class="text-xs text-gray-600">Produk tersedia di platform</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-purple-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span class="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">New</span>
            </div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Artikel</h3>
            <p class="text-3xl font-bold text-purple-600">
              {{ isLoadingStats ? '...' : stats.totalArticles }}
            </p>
          </div>
          <div class="bg-purple-50 px-6 py-3">
            <p class="text-xs text-gray-600">Total artikel dipublikasikan</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-800">Manajemen Pengguna</h2>
              <p class="text-sm text-gray-500 mt-1">Kelola data pengguna sistem</p>
            </div>
            <div class="flex gap-2">
               <button @click="fetchUsers" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2">
                 🔄
               </button>
               <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah User
              </button>
            </div>
          </div>
        </div>

        <div class="p-0">

          <div v-if="isLoadingUsers" class="p-12 text-center">
             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
             <p class="text-gray-500">Memuat data pengguna...</p>
          </div>

          <div v-else-if="users.length === 0" class="p-12 text-center">
            <div class="max-w-md mx-auto">
              <div class="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Belum Ada Data</h3>
              <p class="text-gray-500">Klik tombol refresh untuk memuat ulang data dari server.</p>
              <button @click="fetchUsers" class="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                Muat Data
              </button>
            </div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="sticky top-0 z-10">
                <tr class="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-sm uppercase tracking-wider border-b-2 border-gray-300 shadow-sm">
                  <th class="p-5 pl-6 font-bold text-left" style="min-width: 250px;">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Nama Pengguna
                    </div>
                  </th>
                  <th class="p-5 font-bold text-left" style="min-width: 120px;">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Role
                    </div>
                  </th>
                  <th class="p-5 font-bold text-left" style="min-width: 160px;">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Target Nutrisi
                    </div>
                  </th>
                  <th class="p-5 pr-6 font-bold text-center" style="min-width: 120px;">
                    <div class="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      Aksi
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="user in users" :key="user.id" class="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100">
                  <td class="p-5 pl-6 font-medium text-gray-800 align-middle">
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                        {{ (user.name || user.first_name || user.email || 'U').charAt(0).toUpperCase() }}
                      </div>
                      <div class="flex flex-col min-w-0">
                        <span class="font-bold text-gray-900 text-base truncate">
                          {{ user.name || user.first_name || 'Tanpa Nama' }} {{ user.last_name || '' }}
                        </span>
                        <span class="text-sm text-gray-500 truncate flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {{ user.email || 'Email tidak tersedia' }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td class="p-5 align-middle">
                    <span :class="`px-4 py-2 rounded-lg text-xs font-extrabold inline-flex items-center gap-2 ${user.role === 'admin' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-2 border-purple-300' : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300'}`">
                      <span class="h-2 w-2 rounded-full" :class="user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'"></span>
                      {{ user.role ? user.role.toUpperCase() : 'USER' }}
                    </span>
                  </td>

                  <td class="p-5 align-middle">
                    <div class="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-4 py-2 w-fit">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span class="font-bold text-green-700 text-sm">{{ user.dailyCalorieGoal || 2000 }}</span>
                      <span class="text-green-600 text-xs font-semibold">kcal</span>
                    </div>
                  </td>

                  <td class="p-5 pr-6 text-center align-middle">
                    <button class="text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-300 hover:border-red-600 text-xs font-bold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 inline-flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Hapus
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <transition name="fade">
      <div
        v-if="showNotification"
        class="fixed inset-0 flex items-center justify-center notification-overlay"
        @click="closeNotification"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all relative"
          @click.stop
        >
          <div class="flex justify-center mb-6">
            <div
              :class="[
                'w-20 h-20 rounded-full flex items-center justify-center',
                notificationData.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              ]"
            >
              <svg
                v-if="notificationData.type === 'success'"
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>

              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-gray-800 text-center mb-3">
            {{ notificationData.title }}
          </h3>

          <p class="text-gray-600 text-center mb-8">
            {{ notificationData.message }}
          </p>

          <button
            @click="closeNotification"
            :class="[
              'w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg active:scale-95',
              notificationData.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            ]"
          >
            OK
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import apiClient from '@/axios-config'; // Import API Client

const authStore = useAuthStore();
const router = useRouter();


const stats = ref({ totalUsers: 0, totalProducts: '4 Juta+', totalArticles: 0 });
const users = ref([]);
const isLoadingStats = ref(true);
const isLoadingUsers = ref(true);

// --- NOTIFIKASI ---
const showNotification = ref(false);
const notificationData = ref({
  type: 'success',
  title: '',
  message: ''
});

const showNotif = (type, title, message) => {
  notificationData.value = { type, title, message };
  showNotification.value = true;
};

const closeNotification = () => {
  showNotification.value = false;
};

// fungsi fetch data

// Ambil Statistik
const fetchStats = async () => {
  isLoadingStats.value = true;
  try {
    const { data } = await apiClient.get('/api/admin/stats');
    stats.value = data;
  } catch (error) {
    console.error('Gagal ambil stats:', error);
    // Jangan tampilkan error notif di sini agar tidak mengganggu, cukup di console
  } finally {
    isLoadingStats.value = false;
  }
};

// Ambil Daftar User
const fetchUsers = async () => {
  isLoadingUsers.value = true;
  try {
    const { data } = await apiClient.get('/api/admin/users');
    users.value = data;
  } catch (error) {
    console.error('Gagal ambil users:', error);
    showNotif('error', 'Gagal Memuat Data', 'Tidak dapat mengambil daftar pengguna dari server.');
  } finally {
    isLoadingUsers.value = false;
  }
};

// logout
const handleLogout = async () => {
  try {
    await authStore.logout();
    showNotif('success', 'Berhasil Keluar', 'Anda telah logout dari sistem');
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (error) {
    console.error('Logout Gagal:', error);
    showNotif('error', 'Gagal Keluar', 'Terjadi kesalahan saat logout');
  }
};

// jalankan saat dimuat
onMounted(() => {
  fetchStats();
  fetchUsers();
});
</script>

<style scoped>
/* Notification overlay dengan z-index tertinggi */
.notification-overlay {
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

/* Fade transition untuk modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active > div,
.fade-leave-active > div {
  transition: transform 0.3s ease;
}

.fade-enter-from > div {
  transform: scale(0.9);
}

.fade-leave-to > div {
  transform: scale(0.9);
}
</style>
