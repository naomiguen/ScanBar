<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/40 to-slate-200">
    <AdminNavbar />

    <!-- Restore Confirmation Modal -->
    <RestoreUserModal
      :is-open="restoreModal.isOpen"
      :user-name="restoreModal.userName"
      :user-email="restoreModal.userEmail"
      :deleted-at="restoreModal.deletedAt"
      @close="closeRestoreModal"
      @confirm="confirmRestore"
    />

    <!-- Delete Permanent Modal -->
    <DeletePermanentModal
      :is-open="deleteModal.isOpen"
      :user-name="deleteModal.userName"
      :user-email="deleteModal.userEmail"
      :deleted-at="deleteModal.deletedAt"
      @close="closeDeleteModal"
      @confirm="confirmDeletePermanent"
    />

    <main class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">

      <!-- Stats Card - Responsive -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border border-blue-400/20 mb-4 sm:mb-6 md:mb-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
        <div class="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12"></div>
        <div class="relative">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] sm:text-xs md:text-sm font-semibold text-blue-100 uppercase tracking-wide mb-0.5 sm:mb-1">Total Pengguna Dihapus</p>
              <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                {{ isLoadingTrash ? '...' : trashedUsers.length }}
              </p>
              <p class="text-[10px] sm:text-xs text-blue-200">Siap untuk dipulihkan kapan saja</p>
            </div>
            <div class="p-2.5 sm:p-3 md:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Trash Table -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
        <!-- Table Header -->
        <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div>
              <h2 class="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Daftar Sampah</h2>
              <p class="text-[10px] sm:text-xs md:text-sm text-slate-600 mt-0.5 sm:mt-1">Pengguna yang dapat dipulihkan</p>
            </div>

            <div class="flex gap-2">
              <button
                @click="fetchTrashedUsers"
                class="bg-white border-2 border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95"
                :class="{ 'animate-spin': isLoadingTrash }"
                title="Muat Ulang Data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Table Content - Full responsive -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gradient-to-r from-slate-50 to-slate-100/50 text-slate-700 text-[10px] sm:text-xs md:text-sm uppercase border-b border-slate-200">
                <th class="p-2 sm:p-3 md:p-4 pl-3 sm:pl-4 md:pl-6 font-semibold text-left">Nama Pengguna</th>
                <th class="p-2 sm:p-3 md:p-4 font-semibold text-center hidden md:table-cell">Role</th>
                <th class="p-2 sm:p-3 md:p-4 font-semibold text-center hidden lg:table-cell">Dihapus Pada</th>
                <th class="p-2 sm:p-3 md:p-4 pr-3 sm:pr-4 md:pr-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="isLoadingTrash" class="hover:bg-slate-50/50">
                <td colspan="4" class="p-6 sm:p-8 text-center">
                  <div class="flex flex-col items-center gap-2 sm:gap-3">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-xs sm:text-sm text-slate-600">Memuat data sampah...</p>
                  </div>
                </td>
              </tr>
              <tr v-else-if="trashedUsers.length === 0" class="hover:bg-slate-50/50">
                <td colspan="4" class="p-6 sm:p-8 text-center">
                  <div class="flex flex-col items-center gap-2 sm:gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 sm:w-16 sm:h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-xs sm:text-sm text-slate-500">Tempat sampah kosong</p>
                  </div>
                </td>
              </tr>
              <template v-else v-for="user in trashedUsers" :key="user.id">
                <tr class="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-slate-100/30 transition-all duration-150 group">
                  <td class="p-2 sm:p-3 md:p-4 pl-3 sm:pl-4 md:pl-6 align-middle">
                    <div class="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <div class="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs md:text-sm shadow-lg flex-shrink-0 opacity-60">
                        {{ (user.name || user.first_name || user.email || 'U').charAt(0).toUpperCase() }}
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="font-semibold text-xs sm:text-sm md:text-base text-slate-800 truncate">
                          {{ user.name || user.first_name || 'Tanpa Nama' }} {{ user.last_name || '' }}
                        </div>
                        <div class="text-[10px] sm:text-xs md:text-sm text-slate-500 truncate">{{ user.email }}</div>
                        <!-- Mobile: Show role badge and expand toggle -->
                        <div class="md:hidden mt-1 flex items-center gap-1.5">
                          <span class="inline-block px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-200">
                            {{ (user.role || 'USER').toUpperCase() }}
                          </span>
                          <button @click.stop="toggleRow(user.id)" class="p-0.5 sm:p-1 rounded-md text-slate-500 hover:bg-slate-100 touch-manipulation">
                            <svg v-if="!isRowExpanded(user.id)" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="p-2 sm:p-3 md:p-4 align-middle text-center hidden md:table-cell">
                    <span class="inline-block px-2 sm:px-2.5 md:px-3 py-1 sm:py-1 md:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold shadow-sm uppercase tracking-wide bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-200">
                      {{ (user.role || 'USER').toUpperCase() }}
                    </span>
                  </td>
                  <td class="p-2 sm:p-3 md:p-4 text-xs sm:text-sm align-middle text-center hidden lg:table-cell">
                    <div class="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="font-medium">{{ formatDate(user.deleted_at) }}</span>
                    </div>
                  </td>
                  <td class="p-2 sm:p-3 md:p-4 pr-3 sm:pr-4 md:pr-6 text-center align-middle">
                    <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                      <button
                        @click="openRestoreModal(user)"
                        class="text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-600 text-[10px] sm:text-xs font-semibold border-2 border-emerald-200 hover:border-emerald-500 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md inline-flex items-center gap-1 sm:gap-1.5 touch-manipulation"
                        title="Pulihkan Pengguna"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                        </svg>
                        <span class="hidden sm:inline">Pulihkan</span>
                      </button>
                      <button
                        @click="openDeleteModal(user)"
                        class="text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 text-[10px] sm:text-xs font-semibold border-2 border-red-200 hover:border-red-500 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md inline-flex items-center gap-1 sm:gap-1.5 touch-manipulation"
                        title="Hapus Permanen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        <span class="hidden sm:inline">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Mobile expandable details row -->
                <tr v-if="isRowExpanded(user.id)" class="lg:hidden bg-slate-50/50">
                  <td colspan="4" class="p-2.5 sm:p-3 md:p-4">
                    <div class="grid grid-cols-1 gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-700">
                      <div class="flex justify-between items-center py-1">
                        <div class="font-semibold">Role</div>
                        <div class="text-xs">{{ (user.role || 'USER').toUpperCase() }}</div>
                      </div>
                      <div class="flex justify-between items-center py-1">
                        <div class="font-semibold">Dihapus Pada</div>
                        <div class="text-xs">{{ formatDate(user.deleted_at) }}</div>
                      </div>
                      <div class="flex justify-between items-center py-1 pt-2 border-t border-slate-200">
                        <div class="font-semibold">Aksi</div>
                        <div class="flex gap-1.5">
                          <button
                            @click="openRestoreModal(user)"
                            class="text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-600 text-[10px] sm:text-xs font-semibold border-2 border-emerald-200 hover:border-emerald-500 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md inline-flex items-center gap-1 touch-manipulation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                            </svg>
                            Pulihkan
                          </button>
                          <button
                            @click="openDeleteModal(user)"
                            class="text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 text-[10px] sm:text-xs font-semibold border-2 border-red-200 hover:border-red-500 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md inline-flex items-center gap-1 touch-manipulation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Table Footer -->
        <div class="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
          <p class="text-[10px] sm:text-xs md:text-sm text-slate-600">
            Menampilkan <span class="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ trashedUsers.length }}</span> pengguna terhapus
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminNavbar from '@/components/AdminNavbar.vue';
import RestoreUserModal from '@/components/RestoreUserModal.vue';
import DeletePermanentModal from '@/components/DeletePermanentModal.vue';
import { ref, onMounted } from 'vue';
import apiClient from '@/axios-config';
import { toast } from 'vue-sonner';

const trashedUsers = ref([]);
const isLoadingTrash = ref(true);

// mobile row expansion
const expandedRows = ref([]);
const isRowExpanded = (id) => expandedRows.value.includes(id);
const toggleRow = (id) => {
  const idx = expandedRows.value.indexOf(id);
  if (idx === -1) expandedRows.value.push(id);
  else expandedRows.value.splice(idx, 1);
};

const restoreModal = ref({
  isOpen: false,
  userId: null,
  userName: '',
  userEmail: '',
  deletedAt: ''
});

const deleteModal = ref({
  isOpen: false,
  userId: null,
  userName: '',
  userEmail: '',
  deletedAt: ''
});

const fetchTrashedUsers = async () => {
  try {
    isLoadingTrash.value = true;
    const { data } = await apiClient.get('/api/admin/users/trash');
    trashedUsers.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Gagal ambil trash:', error);
    toast.error('Gagal memuat data sampah');
  } finally {
    isLoadingTrash.value = false;
  }
};

const openRestoreModal = (user) => {
  restoreModal.value = {
    isOpen: true,
    userId: user.id,
    userName: user.name || 'Tanpa Nama',
    userEmail: user.email,
    deletedAt: formatDate(user.deleted_at)
  };
};

const closeRestoreModal = () => {
  restoreModal.value.isOpen = false;
};

const confirmRestore = async () => {
  try {
    await apiClient.put(`/api/admin/users/${restoreModal.value.userId}/restore`);

    trashedUsers.value = trashedUsers.value.filter(
      user => user.id !== restoreModal.value.userId
    );

    closeRestoreModal();

    toast.success('Berhasil!', {
      description: 'Pengguna berhasil dipulihkan.'
    });
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.msg || 'Gagal memulihkan pengguna.';
    toast.error('Gagal Memulihkan', { description: msg });
    closeRestoreModal();
  }
};

const openDeleteModal = (user) => {
  deleteModal.value = {
    isOpen: true,
    userId: user.id,
    userName: user.name || 'Tanpa Nama',
    userEmail: user.email,
    deletedAt: formatDate(user.deleted_at)
  };
};

const closeDeleteModal = () => {
  deleteModal.value.isOpen = false;
};

const confirmDeletePermanent = async () => {
  try {
    await apiClient.delete(`/api/admin/users/${deleteModal.value.userId}/permanent`);

    trashedUsers.value = trashedUsers.value.filter(
      user => user.id !== deleteModal.value.userId
    );

    closeDeleteModal();

    toast.success('Berhasil Dihapus!', {
      description: 'Pengguna telah dihapus secara permanen dari database.'
    });
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.msg || 'Gagal menghapus pengguna secara permanen.';
    toast.error('Gagal Menghapus', { description: msg });
    closeDeleteModal();
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

onMounted(() => {
  fetchTrashedUsers();
});
</script>
