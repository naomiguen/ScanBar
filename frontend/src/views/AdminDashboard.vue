<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 toast-center">
    <header class="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl">
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
              <thead>
                <tr class="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                  <th class="p-4 pl-6 font-semibold">Nama Pengguna</th>
                  <th class="p-4 font-semibold">Role</th>
                  <th class="p-4 font-semibold">Target Nutrisi</th>
                  <th class="p-4 pr-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="p-4 pl-6 font-medium text-gray-800">
                    <div class="flex items-center gap-3">
                      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {{ user.first_name ? user.first_name[0] : 'U' }}
                      </div>
                      {{ user.first_name }} {{ user.last_name }}
                    </div>
                  </td>
                  <td class="p-4">
                    <span :class="`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`">
                      {{ user.role ? user.role.toUpperCase() : 'USER' }}
                    </span>
                  </td>
                  <td class="p-4 text-gray-600 text-sm">
                    <div class="flex items-center gap-1">
                      <span>🔥</span> {{ user.dailyCalorieGoal || 2000 }} kcal
                    </div>
                  </td>
                  <td class="p-4 pr-6 text-right">
                    <button class="text-red-500 hover:text-red-700 text-sm font-semibold hover:bg-red-50 px-3 py-1 rounded transition">
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
