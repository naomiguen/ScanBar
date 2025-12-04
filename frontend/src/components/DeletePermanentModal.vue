<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Background overlay -->
    <div class="flex items-center justify-center min-h-screen px-3 sm:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay background -->
      <div
        class="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <!-- Center modal vertically -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-[calc(100%-1.5rem)] sm:max-w-lg md:max-w-xl"
      >
        <!-- Modal Header with gradient -->
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 relative overflow-hidden">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
          <div class="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full -ml-8 sm:-ml-10 -mb-8 sm:-mb-10"></div>

          <div class="flex items-center gap-3 sm:gap-4 relative">
            <!-- Warning Icon -->
            <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-base sm:text-lg md:text-xl font-bold text-white" id="modal-title">
                Hapus Permanen
              </h3>
              <p class="text-[10px] sm:text-xs text-red-100 mt-0.5 sm:mt-1">
                Data pengguna akan dihapus secara permanen dari database dan tidak dapat dipulihkan kembali.
              </p>
            </div>

            <!-- Close button -->
            <button
              @click="$emit('close')"
              class="flex-shrink-0 p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/20 transition-colors duration-200 group touch-manipulation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="bg-white px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6">

          <!-- User Info Card -->
          <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-slate-200 mb-4 sm:mb-5 md:mb-6">
            <div class="flex items-center gap-2.5 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <div class="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-lg flex-shrink-0">
                {{ (userName || 'U').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm text-slate-500 mb-0.5 sm:mb-1">Akan menghapus permanen:</p>
                <p class="font-bold text-sm sm:text-base md:text-lg text-slate-800 truncate">{{ userName }}</p>
              </div>
            </div>

            <div class="space-y-1.5 sm:space-y-2">
              <div class="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="truncate">{{ userEmail }}</span>
              </div>
              <div class="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Dihapus: {{ deletedAt }}</span>
              </div>
            </div>
          </div>

          <!-- Confirmation Checklist -->
          <div class="space-y-2 sm:space-y-2.5 md:space-y-3 mb-4 sm:mb-5 md:mb-6">
            <p class="text-xs sm:text-sm md:text-base font-semibold text-slate-700 mb-2 sm:mb-3">
              Mohon konfirmasi bahwa Anda memahami:
            </p>
            <div class="space-y-1.5 sm:space-y-2">
              <label class="flex items-start gap-2 sm:gap-2.5 cursor-pointer group">
                <input
                  v-model="confirmations.understand"
                  type="checkbox"
                  class="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 text-red-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                />
                <span class="text-[10px] sm:text-xs md:text-sm text-slate-700 group-hover:text-slate-900 leading-relaxed flex-1">
                  Saya memahami bahwa data akan dihapus permanen
                </span>
              </label>
              <label class="flex items-start gap-2 sm:gap-2.5 cursor-pointer group">
                <input
                  v-model="confirmations.noRecover"
                  type="checkbox"
                  class="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 text-red-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                />
                <span class="text-[10px] sm:text-xs md:text-sm text-slate-700 group-hover:text-slate-900 leading-relaxed flex-1">
                  Saya memahami bahwa data tidak dapat dipulihkan kembali
                </span>
              </label>
              <label class="flex items-start gap-2 sm:gap-2.5 cursor-pointer group">
                <input
                  v-model="confirmations.responsible"
                  type="checkbox"
                  class="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 text-red-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                />
                <span class="text-[10px] sm:text-xs md:text-sm text-slate-700 group-hover:text-slate-900 leading-relaxed flex-1">
                  Saya bertanggung jawab atas tindakan ini
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-center items-center w-full">
          <button
            @click="$emit('close')"
            class="flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg sm:rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 active:scale-95 shadow-sm text-xs sm:text-sm md:text-base touch-manipulation"
          >
            Batal
          </button>
          <button
            @click="handleConfirm"
            :disabled="!allConfirmed"
            :class="[
              'flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 font-bold rounded-lg sm:rounded-xl transition-all duration-200 active:scale-95 shadow-lg text-xs sm:text-sm md:text-base inline-flex items-center justify-center gap-1.5 sm:gap-2 touch-manipulation',
              allConfirmed
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Ya, Hapus Permanen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  userName: {
    type: String,
    default: ''
  },
  userEmail: {
    type: String,
    default: ''
  },
  deletedAt: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);

const confirmations = ref({
  understand: false,
  noRecover: false,
  responsible: false
});

const allConfirmed = computed(() => {
  return confirmations.value.understand &&
         confirmations.value.noRecover &&
         confirmations.value.responsible;
});

const handleConfirm = () => {
  if (allConfirmed.value) {
    emit('confirm');
    // Reset confirmations after emit
    confirmations.value = {
      understand: false,
      noRecover: false,
      responsible: false
    };
  }
};

// Reset confirmations when modal closes
const resetConfirmations = () => {
  confirmations.value = {
    understand: false,
    noRecover: false,
    responsible: false
  };
};

// Watch for modal close
defineExpose({ resetConfirmations });
</script>
