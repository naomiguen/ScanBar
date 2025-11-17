<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <footer class="bg-blue-600 text-white py-16 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div class="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-20 md:gap-32 mb-12 pb-12 border-b border-white/20">
        <!-- Brand -->
        <div class="flex flex-col gap-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/20">
              SB
            </div>
            <span class="text-3xl font-bold text-white tracking-tight">
              ScanBar
            </span>
          </div>

          <p class="text-white/90 leading-relaxed max-w-sm text-base">
            Pilih metode scan favorit Anda untuk mendapatkan informasi nutrisi dari kemasan makanan & minuman lengkap
          </p>

          <!-- Social Media -->
          <div class="flex gap-3 mt-2">
            <a href="#" class="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm">
              <span class="text-xl">📘</span>
            </a>
            <a href="#" class="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm">
              <span class="text-xl">📷</span>
            </a>
            <a href="#" class="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm">
              <span class="text-xl">🐦</span>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-col gap-5">
          <h3 class="text-xl font-bold text-white mb-1">
            Navigasi Cepat
          </h3>

          <nav class="flex flex-col gap-3">
            <a href="#" class="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
              Tentang Kami
            </a>
            <a href="#" class="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
              Fitur
            </a>
            <a href="#" class="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
              Cara Kerja
            </a>
            <a href="#" class="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
              FAQ
            </a>
          </nav>
        </div>

        <!-- Contact -->
        <div class="flex flex-col gap-5">
          <h3 class="text-xl font-bold text-white mb-1">
            Hubungi Kami
          </h3>

          <div class="flex flex-col gap-4">
            <a href="mailto:info@scanbar.com" class="group flex items-start gap-3 text-white/80 hover:text-white transition-colors duration-200">
              <span class="text-lg mt-0.5 w-[26px] text-center group-hover:scale-110 transition-transform duration-200">📧</span>
              <span class="text-sm leading-relaxed">info@scanbar.com</span>
            </a>

            <a href="tel:02112345678" class="group flex items-start gap-3 text-white/80 hover:text-white transition-colors duration-200">
              <span class="text-lg mt-0.5 w-[26px] text-center group-hover:scale-110 transition-transform duration-200">📞</span>
              <span class="text-sm leading-relaxed">(021) 1234 5678</span>
            </a>

            <div class="group flex items-start gap-3 text-white/80">
              <span class="text-lg mt-0.5 w-[26px] text-center">📍</span>
              <span class="text-sm leading-relaxed">Balikpapan, Indonesia</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
        <div class="text-white/70 text-sm">
          © {{ currentYear }} ScanBar. All rights reserved.
        </div>

        <div class="flex gap-6 text-sm">
          <a href="#" class="text-white/70 hover:text-white transition-colors duration-200">
            Kebijakan Privasi
          </a>
          <a href="#" class="text-white/70 hover:text-white transition-colors duration-200">
            Syarat & Ketentuan
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
