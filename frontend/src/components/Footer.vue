<template>
  <footer class="bg-blue-600 text-white py-12">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-16 mb-8 pb-8 border-b border-white/10">
        <!-- Brand -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-[50px] h-[50px] bg-white text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold">
              SB
            </div>
            <span class="text-[1.75rem] font-bold text-white">
              ScanBar
            </span>
          </div>

          <p class="text-white/80 leading-relaxed max-w-md">
            Pilih metode scan favorit Anda untuk mendapatkan informasi nutrisi dari kemasan makanan & minuman lengkap
          </p>
        </div>

        <!-- Contact -->
        <div class="flex flex-col gap-4">
          <h3 class="text-2xl font-bold mb-2 text-white">
            Kontak
          </h3>

          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3 text-white/90 text-[0.95rem]">
              <span class="text-xl w-[30px] text-center">📧</span>
              <span>Email: info@scanbar.com</span>
            </div>

            <div class="flex items-center gap-3 text-white/90 text-[0.95rem]">
              <span class="text-xl w-[30px] text-center">📞</span>
              <span>Telepon: (021) 1234 5678</span>
            </div>

            <div class="flex items-center gap-3 text-white/90 text-[0.95rem]">
              <span class="text-xl w-[30px] text-center">📍</span>
              <span>Alamat: Balikpapan, Indonesia</span>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center pt-6 text-white/70 text-sm">
        © {{ currentYear }} ScanBar. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// Dynamic year
const currentYear = computed(() => new Date().getFullYear())
</script>
