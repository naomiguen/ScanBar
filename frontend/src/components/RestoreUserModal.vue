<template>
  <!-- Overlay backdrop dengan efek blur -->
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <!-- Modal Card dengan animasi slide & scale -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="isOpen"
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-emerald-100"
        >
          <!-- Header dengan gradient hijau -->
          <div class="bg-gradient-to-r from-emerald-500 to-green-600 p-6 relative overflow-hidden">
            <!-- Dekorasi lingkaran background -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div class="relative flex items-start gap-4">
              <!-- Icon Restore -->
              <div class="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white mb-1">Pulihkan Pengguna</h3>
                <p class="text-sm text-emerald-50">Konfirmasi untuk mengembalikan akses</p>
              </div>
            </div>
          </div>

          <!-- Body konten -->
          <div class="p-6 space-y-4">
            <!-- Peringatan info -->
            <div class="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-emerald-800 leading-relaxed">
                  Pengguna akan <strong>dipulihkan</strong> dan dapat mengakses akun mereka kembali.
                </p>
              </div>
            </div>

            <!-- Detail user yang akan dipulihkan -->
            <div class="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
              <!-- Nama -->
              <div class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Nama Lengkap</p>
                  <p class="text-sm font-semibold text-slate-800 truncate">{{ userName }}</p>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Email</p>
                  <p class="text-sm font-semibold text-slate-800 truncate">{{ userEmail }}</p>
                </div>
              </div>

              <!-- Tanggal dihapus -->
              <div class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Dihapus Pada</p>
                  <p class="text-sm font-semibold text-slate-800">{{ deletedAt }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer dengan tombol aksi -->
          <div class="bg-slate-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-slate-200">
            <!-- Tombol Batal -->
            <button
              @click="$emit('close')"
              class="w-full sm:w-auto px-5 py-2.5 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 active:scale-95 text-sm"
            >
              Batal
            </button>

            <!-- Tombol Pulihkan (hijau) -->
            <button
              @click="$emit('confirm')"
              class="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Ya, Pulihkan Pengguna</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
// Props yang diterima dari parent component
defineProps({
  isOpen: Boolean,
  userName: String,
  userEmail: String,
  deletedAt: String
});

// Events yang bisa dipanggil oleh parent
defineEmits(['close', 'confirm']);
</script>
