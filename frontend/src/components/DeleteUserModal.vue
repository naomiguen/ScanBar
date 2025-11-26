<template>
  <!-- Modal Overlay -->
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      @click.self="closeModal"
    >
      <!-- Modal Content -->
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all"
        @click.stop
      >
        <!-- Icon Section -->
        <div class="bg-gradient-to-br from-red-500 to-red-600 p-6 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-1">Hapus Pengguna?</h3>
          <p class="text-red-100 text-sm">Tindakan ini tidak dapat dibatalkan</p>
        </div>

        <!-- Content Section -->
        <div class="p-5 space-y-3">
          <!-- User Info Card -->
          <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 border border-slate-200">
            <div class="flex items-center gap-3 mb-2">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                {{ userName.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-slate-800 truncate text-sm">{{ userName }}</p>
                <p class="text-xs text-slate-500 truncate">{{ userEmail }}</p>
              </div>
            </div>

            <div class="space-y-1.5 text-sm">
              <div class="flex items-center justify-between py-1.5 border-t border-slate-200">
                <span class="text-slate-600 flex items-center gap-1.5 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  Role
                </span>
                <span class="font-semibold text-slate-800 uppercase text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {{ userRole }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-t border-slate-200">
                <span class="text-slate-600 flex items-center gap-1.5 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  Target
                </span>
                <span class="font-semibold text-slate-800 font-mono text-xs">
                  <span v-if="userCalorieGoal !== null && userCalorieGoal !== undefined">{{ userCalorieGoal }} kcal</span>
                  <span v-else>—</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Warning Message -->
          <div class="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-lg">
            <div class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-xs font-semibold text-amber-800 mb-1">Peringatan!</p>
                <p class="text-xs text-amber-700 leading-relaxed">
                  Semua data pengguna ini akan dihapus permanen termasuk riwayat makanan, target nutrisi, dan preferensi. Data yang dihapus <span class="font-bold">tidak dapat dikembalikan</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-5 pb-5 flex gap-2">
          <button
            @click="closeModal"
            class="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 active:scale-95 text-sm"
          >
            Batal
          </button>
          <button
            @click="confirmDelete"
            :disabled="isDeleting"
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <svg v-if="isDeleting" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  userName: {
    type: String,
    default: 'Tanpa Nama'
  },
  userEmail: {
    type: String,
    default: ''
  },
  userRole: {
    type: String,
    default: 'user'
  },
  userCalorieGoal: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['close', 'confirm']);

const isDeleting = ref(false);

const closeModal = () => {
  if (!isDeleting.value) {
    emit('close');
  }
};

const confirmDelete = async () => {
  isDeleting.value = true;
  emit('confirm');
  // The parent component should handle closing the modal after delete is complete
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: all 0.3s ease;
}

.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}
</style>
