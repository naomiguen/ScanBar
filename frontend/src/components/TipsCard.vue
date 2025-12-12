<template>
  <section class="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
    <!-- Dot decorations -->
    <div class="absolute inset-0 z-0">
      <div class="absolute w-1.5 h-1.5 bg-slate-300 rounded-full opacity-40" style="top: 10%; left: 5%;"></div>
      <div class="absolute w-1.5 h-1.5 bg-slate-300 rounded-full opacity-40" style="top: 60%; right: 10%;"></div>
      <div class="absolute w-1.5 h-1.5 bg-slate-300 rounded-full opacity-40" style="bottom: 20%; left: 15%;"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-8 sm:mb-12 lg:mb-16">
        <span class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/30 mb-3 sm:mb-4">
          Edukasi Gizi
        </span>

        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mb-3 sm:mb-4 px-4">
          Tips & Fakta Gizi
        </h2>

        <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
          Pelajari cara membaca label nutrisi dengan benar untuk pilihan makanan yang lebih sehat
        </p>
      </div>

      <!-- Tips Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        <div
          v-for="tip in tips"
          :key="tip.id"
          class="rounded-xl sm:rounded-2xl p-5 sm:p-6 relative
                 bg-white
                 border border-blue-200 shadow-md
                 hover:border-blue-400 hover:shadow-blue-200
                 hover:-translate-y-1 transition-all duration-300
                 min-h-[180px] group cursor-pointer overflow-hidden flex flex-col items-center text-center"
        >
          <!-- Judul di Tengah -->
          <h3 class="text-lg sm:text-xl font-bold text-blue-700 mb-3">
            {{ tip.title }}
          </h3>

          <!-- Deskripsi -->
          <p class="text-sm sm:text-[0.95rem] text-slate-700 leading-relaxed sm:leading-[1.65]">
            {{ tip.description }}
          </p>

          <!-- Accent line -->
          <div class="absolute bottom-0 left-0 h-1 w-0 bg-blue-500/80 group-hover:w-full transition-all duration-300"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TipsSection',
  data() {
    return {
      tips: [
        {
          id: 1,
          title: 'Protein: Fondasi Kesehatan',
          description: 'Perhatikan kandungan protein dalam label makanan kemasan. Pilih produk dengan protein minimal 5g per 100g untuk nutrisi optimal.'
        },
        {
          id: 2,
          title: 'Lemak yang Sehat',
          description: 'Periksa jenis lemak pada kemasan: total lemak, lemak jenuh, dan lemak trans. Pilih produk dengan lemak jenuh kurang dari 10% per sajian.'
        },
        {
          id: 3,
          title: 'Karbohidrat Cerdas',
          description: 'Cek total karbohidrat dan serat pada label informasi nilai gizi. Pilih produk dengan "whole grain" sebagai bahan utama.'
        },
        {
          id: 4,
          title: 'Pentingnya Serat',
          description: 'Perhatikan kandungan "Dietary Fiber" pada label. Pilih produk minimal 3g serat per sajian untuk camilan sehat.'
        },
        {
          id: 5,
          title: 'Bijak dengan Gula',
          description: 'Cek daftar gula pada ingredient list. Waspadai nama lain gula seperti syrup, dextrose, dan sucrose.'
        },
        {
          id: 6,
          title: 'Kendali Asupan Garam',
          description: 'Perhatikan kandungan "Sodium" atau "Garam" pada label. Pilih produk dengan sodium kurang dari 20% Daily Value per sajian.'
        }
      ]
    }
  }
}
</script>
