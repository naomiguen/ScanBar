<template>
  <section class="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24">

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
            Naomi Ratna Marisaha Guen
            <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block sm:inline mt-2 sm:mt-0">
              11231069
            </span>
          </h1>

          <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Saya adalah mahasiswa informatika angkatan 2023. Saya berkuliah di kampus perjuangan Institut Teknologi kalimantan yang berada di Balikpapan
          </p>
        </div>

          <div class="relative mt-8 lg:mt-0">
          <!-- Mobile & Tablet Image (visible on small screens) -->
          <div class="block lg:hidden relative">
            <img
              src="C:\Users\Administrator\ScanBar\frontend\pp github.jpg"
              alt="Barcode scanning"
              class="w-full h-[1800px] sm:h-[350px] md:h-[400px] object-cover rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl mx-auto max-w-md md:max-w-lg"
            />
          </div>

          <!-- Desktop Image (hidden on small screens) -->
          <div class="hidden lg:block relative">
            <div class="relative z-10">
              <img
                src="C:\Users\Administrator\ScanBar\frontend\pp github.jpg"
                alt="Barcode scanning"
                class="w-full h-[350px] xl:h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              <div class="absolute top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl opacity-20 blur-[40px]"></div>
            </div>
          </div>
        </div>
        </div>

        <!-- keahlian -->

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        <div
          v-for="tip in tips"
          :key="tip.id"
          class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 relative shadow-lg border border-slate-50 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 min-h-[170px] sm:min-h-[190px] group cursor-default overflow-hidden"
        >
          <div class="absolute top-2 right-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/5 blur-xl pointer-events-none"></div>

          <div class="flex gap-3 sm:gap-4 items-start relative z-10">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-white to-slate-50 shadow-lg shadow-blue-500/10 flex items-center justify-center text-slate-800 text-xl sm:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              {{ tip.icon }}
            </div>

            <div class="min-w-0">
              <h3 class="text-base sm:text-[1.05rem] font-extrabold text-slate-900 mb-1">
                {{ tip.title }}
              </h3>
              <p class="text-sm sm:text-[0.95rem] text-slate-700 leading-relaxed sm:leading-[1.65]">
                {{ tip.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

    <!-- Footer -->
    <Footer />

    </div>
  </section>
</template>

<script>
import HeroSection from '@/components/HeroSection.vue'

export default {
  name: 'TipsSection',
  data() {
    return {
      dots: [
        { style: 'top: 50%; left: 5%;' },
        { style: 'top: 60%; right: 10%;' },
        { style: 'bottom: 20%; left: 15%;' }
      ],
      tips: [
        {
          id: 1,
          icon: '🍎',
          title: 'Memasak',
          description: 'Dulu saya sering membantu mama saya memasak. karena itulah saya suka memasak. Saya paling suka memasak Kue, karena memasak kue menururt saya bisa jadi healing'
        },
        {
          id: 2,
          icon: '💖',
          title: 'Membaca Novel',
          description: 'Dari dulu saya sangat suka membaca novel. Saya bisa menghabiskan seluruh hari saya dengan membaca komik'
        },
        {
          id: 3,
          icon: '🌿',
          title: 'Public Speaking',
          description: 'Saya termasuk orang yang percaya diri dan bisa berbicara didepan umu. Saya beberapa kali pernaah jadi mc dan jadi pemateri di pelatihan LKMM.'
        },

      ]
    }
  }
}
</script>

