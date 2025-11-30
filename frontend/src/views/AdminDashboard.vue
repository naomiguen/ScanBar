<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/40 to-purple-50">
    <AdminNavbar />

    <!-- Delete Confirmation Modal -->
    <DeleteUserModal
      :is-open="deleteModal.isOpen"
      :user-name="deleteModal.userName"
      :user-email="deleteModal.userEmail"
      :user-role="deleteModal.userRole"
      :user-calorie-goal="deleteModal.userCalorieGoal"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />

    <main class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <!-- Page Header -->
      <div class="mb-4 sm:mb-6 md:mb-8">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">Dashboard Admin</h1>
        <p class="text-slate-600 text-xs sm:text-sm md:text-base">Kelola data pengguna dan statistik aplikasi</p>
      </div>

      <!-- Stats Cards - Responsive Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <!-- Total Users Card -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border border-blue-400/20 group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
          <div class="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <div class="p-2 sm:p-2.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span class="text-[10px] sm:text-xs font-semibold text-blue-100 bg-white/20 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Live</span>
            </div>
            <p class="text-[10px] sm:text-xs md:text-sm font-semibold text-blue-100 uppercase tracking-wide mb-0.5 sm:mb-1">Total Pengguna</p>
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              {{ isLoadingStats ? '...' : stats.totalUsers }}
            </p>
            <div class="flex items-center text-[10px] sm:text-xs text-blue-100 font-medium bg-white/10 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-4 sm:h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
              </svg>
              <span>+12% bulan ini</span>
            </div>
          </div>
        </div>

        <!-- Total Products Card -->
        <div class="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border border-emerald-400/20 group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
          <div class="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <div class="p-2 sm:p-2.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span class="text-[10px] sm:text-xs font-semibold text-emerald-100 bg-white/20 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Active</span>
            </div>
            <p class="text-[10px] sm:text-xs md:text-sm font-semibold text-emerald-100 uppercase tracking-wide mb-0.5 sm:mb-1">Total Produk</p>
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">{{ stats.totalProducts }}</p>
            <div class="flex items-center text-[10px] sm:text-xs text-emerald-100 font-medium bg-white/10 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-4 sm:h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <span>Database lengkap</span>
            </div>
          </div>
        </div>

        <!-- Total Articles Card -->
        <div class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border border-purple-400/20 group sm:col-span-2 lg:col-span-1 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
          <div class="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <div class="p-2 sm:p-2.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span class="text-[10px] sm:text-xs font-semibold text-purple-100 bg-white/20 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Updated</span>
            </div>
            <p class="text-[10px] sm:text-xs md:text-sm font-semibold text-purple-100 uppercase tracking-wide mb-0.5 sm:mb-1">Artikel</p>
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              {{ isLoadingStats ? '...' : stats.totalArticles }}
            </p>
            <div class="flex items-center text-[10px] sm:text-xs text-purple-100 font-medium bg-white/10 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-4 sm:h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
              <span>Konten edukasi</span>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management Table -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
        <!-- Table Header -->
        <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div>
              <h2 class="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Manajemen Pengguna</h2>
              <p class="text-[10px] sm:text-xs md:text-sm text-slate-600 mt-0.5 sm:mt-1">Daftar semua pengguna terdaftar</p>
            </div>

            <div class="flex gap-1.5 sm:gap-2 md:gap-3">
              <!-- Tombol Tambah Produk -->
              <button
                @click="$router.push('/admin/add-product')"
                class="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-200 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 active:scale-95 touch-manipulation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span class="hidden xs:inline sm:hidden md:inline">Tambah Produk</span>
                <span class="xs:hidden sm:inline md:hidden">Produk</span>
              </button>

              <!-- Tempat Sampah -->
              <button
                @click="$router.push('/admin/trash')"
                class="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-200 shadow-md shadow-slate-500/30 hover:shadow-lg hover:shadow-slate-500/40 active:scale-95 touch-manipulation"
                title="Lihat Pengguna Terhapus"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>

              <!-- Tombol Refresh -->
              <button
                @click="fetchUsers"
                class="bg-white border-2 border-indigo-200 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-200 active:scale-95 touch-manipulation"
                :class="{ 'animate-spin': isLoadingUsers }"
                title="Muat Ulang Data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Table Content -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gradient-to-r from-slate-50 to-slate-100/50 text-slate-700 text-[10px] sm:text-xs md:text-sm uppercase border-b border-slate-200">
                <th class="p-2 sm:p-3 md:p-4 pl-3 sm:pl-4 md:pl-6 font-semibold text-left">Nama Pengguna</th>
                <th class="p-2 sm:p-3 md:p-4 font-semibold text-center hidden md:table-cell">Role</th>
                <th class="p-2 sm:p-3 md:p-4 font-semibold text-center hidden lg:table-cell">Kalori</th>
                <th class="p-2 sm:p-3 md:p-4 font-semibold text-center hidden lg:table-cell">Protein</th>
                <th class="p-2 sm:p-3 md:p-4 font-semibold text-center hidden lg:table-cell">Karbohidrat</th>
                <th class="p-2 sm:p-3 md:p-4 font-semibold text-center hidden lg:table-cell">Lemak</th>
                <th class="p-2 sm:p-3 md:p-4 pr-3 sm:pr-4 md:pr-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr v-if="isLoadingUsers" class="hover:bg-slate-50/50">
                <td colspan="7" class="p-6 sm:p-8 text-center">
                  <div class="flex flex-col items-center gap-2 sm:gap-3">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-xs sm:text-sm text-slate-600">Memuat data pengguna...</p>
                  </div>
                </td>
              </tr>
              <tr v-else-if="users.length === 0" class="hover:bg-slate-50/50">
                <td colspan="7" class="p-6 sm:p-8 text-center">
                  <div class="flex flex-col items-center gap-2 sm:gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 sm:w-16 sm:h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p class="text-xs sm:text-sm text-slate-500">Belum ada data pengguna</p>
                  </div>
                </td>
              </tr>
              <template v-else v-for="user in users" :key="user.id">
              <tr class="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-150 group">
                <td class="p-2 sm:p-3 md:p-4 pl-3 sm:pl-4 md:pl-6 align-middle">
                  <div class="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    <div class="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs md:text-sm shadow-lg flex-shrink-0">
                      {{ (user.name || user.first_name || user.email || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="font-semibold text-xs sm:text-sm md:text-base text-slate-800 truncate">
                        {{ user.name || user.first_name || 'Tanpa Nama' }} {{ user.last_name || '' }}
                      </div>
                      <div class="text-[10px] sm:text-xs md:text-sm text-slate-500 truncate">{{ user.email }}</div>
                      <!-- Mobile: Show role badge and expand toggle -->
                      <div class="lg:hidden mt-0.5 sm:mt-1 flex items-center gap-1.5">
                        <span :class="`inline-block px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wide ${String((user.cleanedRole||'')).toLowerCase()==='admin'?'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200':'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'}`">
                          {{ (String(user.cleanedRole || user.role || 'USER').replace(/^['"]|['"]$/g, '')).toUpperCase() }}
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
                  <span :class="`inline-block px-2 sm:px-2.5 md:px-3 py-1 sm:py-1 md:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold shadow-sm uppercase tracking-wide ${String((user.role||'')).toLowerCase()==='admin'?'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200':'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'}`">
                    {{ (String(user.role || 'USER').replace(/^['"]|['"]$/g, '')).toUpperCase() }}
                  </span>
                </td>

                <!-- KALORI -->
                <td class="p-2 sm:p-3 md:p-4 text-xs sm:text-sm align-middle text-center hidden lg:table-cell">
                  <span v-if="user.daily_calorie_goal" class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1 md:py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 font-semibold rounded-lg border border-emerald-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="font-mono text-[10px] sm:text-xs">{{ user.daily_calorie_goal }} kcal</span>
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs text-slate-500 bg-slate-50 border border-slate-100" title="Target belum tersedia">Tidak ada</span>
                </td>

                <!-- PROTEIN -->
                <td class="p-2 sm:p-3 md:p-4 text-xs sm:text-sm align-middle text-center hidden lg:table-cell">
                  <span v-if="user.daily_protein_goal" class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1 md:py-1.5 bg-gradient-to-r from-orange-50 to-orange-50 text-orange-700 font-semibold rounded-lg border border-orange-200">
                    <span class="font-mono text-[10px] sm:text-xs">{{ user.daily_protein_goal }} g</span>
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs text-slate-500 bg-slate-50 border border-slate-100" title="Target protein belum tersedia">Tidak ada</span>
                </td>

                <!-- KARBOHIDRAT -->
                <td class="p-2 sm:p-3 md:p-4 text-xs sm:text-sm align-middle text-center hidden lg:table-cell">
                  <span v-if="user.daily_carbs_goal" class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1 md:py-1.5 bg-gradient-to-r from-green-50 to-green-50 text-green-700 font-semibold rounded-lg border border-green-200">
                    <span class="font-mono text-[10px] sm:text-xs">{{ user.daily_carbs_goal }} g</span>
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs text-slate-500 bg-slate-50 border border-slate-100" title="Target karbohidrat belum tersedia">Tidak ada</span>
                </td>

                <!-- LEMAK -->
                <td class="p-2 sm:p-3 md:p-4 text-xs sm:text-sm align-middle text-center hidden lg:table-cell">
                  <span v-if="user.daily_fat_goal" class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1 md:py-1.5 bg-gradient-to-r from-amber-50 to-amber-50 text-amber-700 font-semibold rounded-lg border border-amber-200">
                    <span class="font-mono text-[10px] sm:text-xs">{{ user.daily_fat_goal }} g</span>
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs text-slate-500 bg-slate-50 border border-slate-100" title="Target lemak belum tersedia">Tidak ada</span>
                </td>
                <td class="p-2 sm:p-3 md:p-4 pr-3 sm:pr-4 md:pr-6 text-center align-middle">
                  <button
                    v-if="user.role !== 'admin'"
                    @click="openDeleteModal(user)"
                    class="text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 text-[10px] sm:text-xs font-semibold border-2 border-red-200 hover:border-red-500 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md touch-manipulation"
                  >
                    <span class="hidden sm:inline">Hapus</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:hidden" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <span v-else class="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-500 font-medium bg-slate-100 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border border-slate-200 cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="hidden sm:inline">Protected</span>
                  </span>
                </td>
              </tr>

              <!-- Mobile expandable details row -->
              <tr v-if="isRowExpanded(user.id)" class="lg:hidden bg-slate-50/50">
                <td colspan="7" class="p-2.5 sm:p-3 md:p-4">
                  <div class="grid grid-cols-1 gap-2 text-xs sm:text-sm text-slate-700">
                    <!-- Role (for md screens where it's hidden) -->
                    <div class="md:hidden flex justify-between items-center py-1.5 border-b border-slate-200">
                      <div class="font-semibold text-slate-600">Role</div>
                      <span :class="`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${String((user.role||'')).toLowerCase()==='admin'?'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200':'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'}`">
                        {{ (String(user.role || 'USER').replace(/^['"]|['"]$/g, '')).toUpperCase() }}
                      </span>
                    </div>

                    <!-- Nutrition Goals -->
                    <div class="flex justify-between items-center py-1.5 border-b border-slate-200">
                      <div class="font-semibold text-slate-600">Target Kalori</div>
                      <span v-if="user.daily_calorie_goal" class="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 font-semibold rounded-md border border-emerald-200 text-[10px]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        {{ user.daily_calorie_goal }} kcal
                      </span>
                      <span v-else class="text-slate-400 text-[10px]">Tidak ada</span>
                    </div>

                    <div class="flex justify-between items-center py-1.5 border-b border-slate-200">
                      <div class="font-semibold text-slate-600">Target Protein</div>
                      <span v-if="user.daily_protein_goal" class="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-50 to-orange-50 text-orange-700 font-semibold rounded-md border border-orange-200 text-[10px]">
                        {{ user.daily_protein_goal }} g
                      </span>
                      <span v-else class="text-slate-400 text-[10px]">Tidak ada</span>
                    </div>

                    <div class="flex justify-between items-center py-1.5 border-b border-slate-200">
                      <div class="font-semibold text-slate-600">Target Karbohidrat</div>
                      <span v-if="user.daily_carbs_goal" class="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-50 to-green-50 text-green-700 font-semibold rounded-md border border-green-200 text-[10px]">
                        {{ user.daily_carbs_goal }} g
                      </span>
                      <span v-else class="text-slate-400 text-[10px]">Tidak ada</span>
                    </div>

                    <div class="flex justify-between items-center py-1.5">
                      <div class="font-semibold text-slate-600">Target Lemak</div>
                      <span v-if="user.daily_fat_goal" class="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-50 to-amber-50 text-amber-700 font-semibold rounded-md border border-amber-200 text-[10px]">
                        {{ user.daily_fat_goal }} g
                      </span>
                      <span v-else class="text-slate-400 text-[10px]">Tidak ada</span>
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
            Menampilkan <span class="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ users.length }}</span> pengguna
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminNavbar from '@/components/AdminNavbar.vue';
import DeleteUserModal from '@/components/DeleteUserModal.vue';
import { ref, onMounted, computed } from 'vue';
import apiClient from '@/axios-config';
import { toast } from 'vue-sonner';

const stats = ref({ totalUsers: 0, totalProducts: '4 Juta+', totalArticles: 0 });
const users = ref([]);
const isLoadingStats = ref(true);
const isLoadingUsers = ref(true);

const deleteModal = ref({
  isOpen: false,
  userId: null,
  userName: '',
  userEmail: '',
  userRole: '',
  userCalorieGoal: null
});

// Track expanded rows for mobile details view
const expandedRows = ref([]);

const isRowExpanded = (id) => expandedRows.value.includes(id);

const toggleRow = (id) => {
  const idx = expandedRows.value.indexOf(id);
  if (idx === -1) {
    expandedRows.value.push(id);
  } else {
    expandedRows.value.splice(idx, 1);
  }
};

const fetchStats = async () => {
  try {
    isLoadingStats.value = true;
    const { data } = await apiClient.get('/api/admin/stats');
    stats.value = data;
  } catch (error) {
    console.error('Gagal ambil stats:', error);
    toast.error('Gagal memuat statistik');
  } finally {
    isLoadingStats.value = false;
  }
};

const fetchUsers = async () => {
  try {
    isLoadingUsers.value = true;
    const { data } = await apiClient.get('/api/admin/users');

    // DEBUGGING: Cek data yang diterima
    console.log('=== DEBUG FETCH USERS ===');
    console.log(' Total users received:', data?.length);
    console.log(' Raw data:', data);

    if (data && data.length > 0) {
      console.log(' First user full object:', data[0]);
      console.log('First user nutrition goals:', {
        calories: data[0].daily_calorie_goal,
        protein: data[0].daily_protein_goal,
        carbs: data[0].daily_carbs_goal,
        fat: data[0].daily_fat_goal
      });
      console.log(' Keys in first user:', Object.keys(data[0]));
    }

    //mengurutkan admin di atas
    users.value = Array.isArray(data)
      ? data.sort((a, b) => {
          const aIsAdmin = String((a.role || '')).toLowerCase() === 'admin';
          const bIsAdmin = String((b.role || '')).toLowerCase() === 'admin';
          if (aIsAdmin && !bIsAdmin) return -1;
          if (bIsAdmin && !aIsAdmin) return 1;
          return 0;
        })
      : (data || []);

    console.log(' Users array after sort:', users.value);
  } catch (error) {
    console.error('❌ Gagal ambil users:', error);
    toast.error('Gagal memuat data pengguna');
  } finally {
    isLoadingUsers.value = false;
  }
};

const openDeleteModal = (user) => {
  deleteModal.value = {
    isOpen: true,
    userId: user.id,
    userName: user.name || 'Tanpa Nama',
    userEmail: user.email,
    userRole: (user.role || 'user').toUpperCase(),
    userCalorieGoal: user.daily_calorie_goal || null
  };
};

const closeDeleteModal = () => {
  deleteModal.value.isOpen = false;
};

const confirmDelete = async () => {
  try {
    await apiClient.delete(`/api/admin/users/${deleteModal.value.userId}`);

    // Update UI optimistically
    users.value = users.value.filter(user => user.id !== deleteModal.value.userId);

    // Update stats
    if (stats.value.totalUsers > 0) stats.value.totalUsers--;

    closeDeleteModal();

    toast.success('Berhasil!', {
      description: 'Pengguna berhasil dihapus dari sistem.'
    });
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.msg || 'Gagal menghapus pengguna.';
    toast.error('Gagal Menghapus', { description: msg });
    closeDeleteModal();
  }
};

onMounted(() => {
  fetchStats();
  fetchUsers();
});
</script>
