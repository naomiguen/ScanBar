<template>
  <section class="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24">
    <!-- Background Decorations -->
    <div class="absolute inset-0 overflow-hidden z-0">
      <div class="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-blue-500 rounded-full opacity-20 blur-[40px] sm:blur-[50px] lg:blur-[60px] -top-[150px] sm:-top-[200px] -right-[150px] sm:-right-[200px]"></div>
      <div class="absolute w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] bg-purple-500 rounded-full opacity-20 blur-[40px] sm:blur-[50px] lg:blur-[60px] top-[40%] -left-[200px] sm:-left-[250px]"></div>
      <div class="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] bg-indigo-500 rounded-full opacity-20 blur-[40px] sm:blur-[50px] lg:blur-[60px] bottom-[10%] right-[10%]"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center relative z-10">
        <!-- Hero Content -->
        <div class="flex flex-col gap-4 sm:gap-5 lg:gap-6 text-center lg:text-left">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight">
            Selamat datang di
            <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block sm:inline mt-2 sm:mt-0">
              ScanBar
            </span>
          </h1>

          <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Scan barcode pada kemasan makanan & minuman untuk mendapatkan informasi nutrisi lengkap. Pantau asupan harian dengan mudah dan capai target kesehatan Anda.
          </p>

          <div class="flex gap-3 sm:gap-4 flex-wrap justify-center lg:justify-start">
            <button
              @click="$emit('scroll-to-scanner')"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 inline-flex items-center gap-2"
            >
              <span class="hidden xs:inline">Mulai Pindai Sekarang</span>
              <span class="xs:hidden">Pindai Sekarang</span>
            </button>

            <router-link
              v-if="!isAuthenticated"
              to="/register"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-white/50 backdrop-blur-md text-slate-700 rounded-xl font-bold text-sm sm:text-base border-2 border-slate-300 hover:bg-white hover:border-blue-600 transition-all duration-300 inline-flex items-center gap-2"
            >
              <span class="hidden xs:inline">Daftar Gratis</span>
              <span class="xs:hidden">Daftar</span>
            </router-link>
          </div>
        </div>

        <!-- Hero Image -->
        <div class="relative mt-8 lg:mt-0">
          <!-- Mobile & Tablet Image (visible on small screens) -->
          <div class="block lg:hidden relative">
            <img
              src="https://flexypack.com/wp-content/uploads/2021/11/Contoh-Kemasan-Standing-Pouch-Snack-Makanan-Ringan-1024x627.jpg"
              alt="Barcode scanning"
              class="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl mx-auto max-w-md md:max-w-lg"
            />
          </div>

          <!-- Desktop Image (hidden on small screens) -->
          <div class="hidden lg:block relative">
            <div class="relative z-10">
              <img
                src="https://flexypack.com/wp-content/uploads/2021/11/Contoh-Kemasan-Standing-Pouch-Snack-Makanan-Ringan-1024x627.jpg"
                alt="Barcode scanning"
                class="w-full h-[400px] xl:h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              <div class="absolute top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl opacity-20 blur-[40px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false
  }
})

defineEmits(['scroll-to-scanner'])
</script>

<style scoped>
/* Custom breakpoint for very small screens */
@media (min-width: 375px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
}

/* Smooth transitions */
* {
  transition-property: transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Optimize for touch devices */
@media (hover: none) and (pointer: coarse) {
  button:hover,
  a:hover {
    transform: none;
  }
}
</style>
