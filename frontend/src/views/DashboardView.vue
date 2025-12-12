<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
    <!-- Header Utama Dashboard -->
    <div class="text-center mb-10">
      <h1 class="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2">
        Dashboard Nutrisi
      </h1>
      <p class="text-lg text-slate-600">
        Pantau konsumsi harian Anda
      </p>
    </div>

    <!-- Section Ringkasan Harian: Menampilkan progress bar untuk setiap nutrisi -->
    <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10 max-w-7xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
      Ringkasan Harian
      </h2>

      <!-- Grid untuk menampilkan kartu-kartu nutrisi -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Loop untuk setiap nutrisi (kalori, karbo, protein, dll) -->
        <div
          v-for="(goal, key) in summaryData"
          :key="key"
          class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Bagian Atas: Label Nutrisi & Nilai Saat Ini / Target -->
          <div class="flex justify-between items-center mb-3">
            <span class="font-bold text-slate-800 text-base">{{ goal.label }}</span>
            <span class="font-semibold text-slate-700 text-sm">
              {{ goal.value }} / {{ goal.max }} {{ goal.unit }}
            </span>
          </div>

          <!-- Progress Bar: Visualisasi pencapaian nutrisi -->
          <div class="bg-slate-200 rounded-full h-3 overflow-hidden mb-3">
            <div
              :class="getBarColorClass(goal.class)"
              class="h-3 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${Math.min((goal.value / goal.max) * 100, 100)}%` }"
            ></div>
          </div>

          <!-- Sisa Nutrisi yang Masih Bisa Dikonsumsi -->
          <p class="text-sm text-slate-600">
            Sisa: <span class="font-semibold">{{ Math.max(0, goal.max - goal.value) }} {{ goal.unit }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Section Jurnal Makanan: Daftar semua makanan yang sudah dicatat hari ini -->
    <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-7xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
      Jurnal Makanan Harian
      </h2>

      <!-- Empty State: Ditampilkan jika belum ada makanan yang dicatat -->
      <div v-if="foodStore.foods.length === 0" class="text-center py-16">
        <p class="text-lg text-slate-500">
          Anda belum mencatat makanan apa pun hari ini.
        </p>
      </div>

      <!-- Daftar Makanan: Ditampilkan jika sudah ada makanan yang dicatat -->
      <div v-else class="space-y-4">
        <!-- Loop untuk setiap makanan yang sudah dicatat -->
        <div
          v-for="food in foodStore.foods"
          :key="food._id"
          class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Header Kartu Makanan: Nama Produk & Waktu Pencatatan -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl md:text-2xl font-bold text-blue-900">
              {{ food.productName }}
            </h3>
            <span class="text-sm text-slate-600 font-medium">
              {{ new Date(food.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>

          <!-- Body Kartu: Informasi Nutrisi & Tombol Hapus -->
          <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <!-- Grid untuk menampilkan semua nutrisi makanan -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 flex-1">

              <!-- Kartu Kalori -->
              <div class="bg-blue-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-blue-600">
                  {{ Math.round(food.calories) }}
                </div>
                <div class="text-xs font-medium text-blue-700 mt-1">
                  kcal
                </div>
              </div>

              <!-- Kartu Karbohidrat -->
              <div class="bg-green-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-green-600">
                  {{ Math.round(food.carbs) }}g
                </div>
                <div class="text-xs font-medium text-green-700 mt-1">
                  karbo
                </div>
              </div>

              <!-- Kartu Protein -->
              <div class="bg-orange-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-orange-600">
                  {{ Math.round(food.protein) }}g
                </div>
                <div class="text-xs font-medium text-orange-700 mt-1">
                  protein
                </div>
              </div>

              <!-- Kartu Lemak -->
              <div class="bg-amber-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-amber-600">
                  {{ Math.round(food.fat) }}g
                </div>
                <div class="text-xs font-medium text-amber-700 mt-1">
                  lemak
                </div>
              </div>

              <!-- Kartu Gula -->
              <div class="bg-purple-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-purple-600">
                  {{ Math.round(food.sugar || 0) }}g
                </div>
                <div class="text-xs font-medium text-purple-700 mt-1">
                  gula
                </div>
              </div>

              <!-- Kartu Garam (ditampilkan dalam mg) -->
              <div class="bg-slate-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-slate-600">
                  {{ normalizeSaltDisplay(food.salt || 0).value }}{{ normalizeSaltDisplay(food.salt || 0).unit }}
                </div>
                <div class="text-xs font-medium text-slate-700 mt-1">
                  garam
                </div>
              </div>
            </div>

            <!-- Tombol Hapus: Untuk menghapus makanan dari jurnal -->
            <button
              @click="handleDelete(food._id, food.productName)"
              class="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl px-6 py-3 md:py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-2 text-base"
            >
              <span class="text-xl">🗑️</span> Hapus
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Konfirmasi Hapus: Ditampilkan sebagai overlay saat akan menghapus -->
    <div
      v-if="deleteConfirm.show"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in">
        <!-- Icon Warning -->
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-slate-900 mb-2">
            Hapus Makanan?
          </h3>
          <p class="text-slate-600">
            Yakin ingin menghapus <span class="font-bold text-blue-900">{{ deleteConfirm.foodName }}</span> dari jurnal Anda?
          </p>
          <p class="text-sm text-red-600 mt-2">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex gap-3">
          <!-- Tombol Batal -->
          <button
            @click="cancelDelete"
            class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Batal
          </button>

          <!-- Tombol Hapus -->
          <button
            @click="executeDelete"
            :disabled="deleteConfirm.loading"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!deleteConfirm.loading">Ya, Hapus</span>
            <span v-else>Menghapus...</span>
          </button>
        </div>
      </div>
    </div>

     <!-- Favorites -->
      <FavoritesList class="mt-10"/>

  <!--  SECTION BARU: Analisis AI Harian -->
    <div class="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 mt-10 max-w-7xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
      Analisis Jurnal Harian
      </h2>

      <!-- Loading State -->
      <div v-if="foodStore.dailyAnalysisLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p class="text-lg text-slate-600">Menganalisis pola makan Anda...</p>
        <p class="text-sm text-slate-500 mt-2">Proses ini mungkin memakan waktu 5-10 detik</p>
      </div>

      <!-- Error State -->
      <div v-else-if="foodStore.dailyAnalysisError" class="text-center py-12">
        <p class="text-lg text-red-600 font-semibold mb-2">Gagal Memuat Analisis</p>
        <p class="text-sm text-slate-600 mb-4">{{ foodStore.dailyAnalysisError }}</p>
        <button
          @click="foodStore.fetchDailyAnalysis()"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Analysis Content -->
      <div v-else-if="foodStore.dailyAnalysis" class="space-y-6">
        <!-- Summary -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
          Ringkasan
          </h3>
          <p class="text-slate-700 leading-relaxed">
            {{ foodStore.dailyAnalysis.summary || 'Tidak ada ringkasan tersedia' }}
          </p>
        </div>

        <!-- Risks -->
        <div v-if="foodStore.dailyAnalysis.risks && foodStore.dailyAnalysis.risks.length > 0"
             class="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
          Risiko Kesehatan
          </h3>
          <ul class="space-y-2">
            <li v-for="(risk, index) in foodStore.dailyAnalysis.risks" :key="index"
                class="flex items-start gap-2 text-slate-700">
              <span class="text-red-600 font-bold">•</span>
              <span>{{ risk }}</span>
            </li>
          </ul>
        </div>

        <!-- Warnings -->
        <div v-if="foodStore.dailyAnalysis.warnings && foodStore.dailyAnalysis.warnings.length > 0"
             class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
          Peringatan
          </h3>
          <ul class="space-y-2">
            <li v-for="(warning, index) in foodStore.dailyAnalysis.warnings" :key="index"
                class="flex items-start gap-2 text-slate-700">
              <span class="text-amber-600 font-bold">•</span>
              <span>{{ warning }}</span>
            </li>
          </ul>
        </div>

        <!-- Diet Suitability -->
        <div v-if="foodStore.dailyAnalysis.dietSuitability"
             class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
          Kesesuaian Diet
          </h3>
          <p class="text-slate-700 leading-relaxed">
            {{ foodStore.dailyAnalysis.dietSuitability }}
          </p>
        </div>

        <!-- Recommendations -->
        <div v-if="foodStore.dailyAnalysis.recommendations && foodStore.dailyAnalysis.recommendations.length > 0"
             class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
          Rekomendasi
          </h3>
          <ul class="space-y-2">
            <li v-for="(rec, index) in foodStore.dailyAnalysis.recommendations" :key="index"
                class="flex items-start gap-2 text-slate-700">
              <span class="text-green-600 font-bold">✓</span>
              <span>{{ rec }}</span>
            </li>
          </ul>
        </div>

        <!-- Disclaimer -->
        <div v-if="foodStore.dailyAnalysis.disclaimer"
             class="bg-slate-100 rounded-2xl p-4 border-l-4 border-slate-400">
          <p class="text-sm text-slate-600 italic">
            <span class="font-semibold">Disclaimer:</span> {{ foodStore.dailyAnalysis.disclaimer }}
          </p>
        </div>
      </div>

      <!-- Empty State (belum ada analisis) -->
      <div v-else class="text-center py-12">
        <p class="text-lg text-slate-600">
          Belum ada analisis untuk hari ini
        </p>
        <p class="text-sm text-slate-500 mt-2">
          Tambahkan makanan ke jurnal Anda untuk mendapatkan analisis AI
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useFoodStore } from '@/stores/food'
import FavoritesList from '@/components/FavoritesList.vue'
import { normalizeSaltDisplay } from '@/utils/units'

// Inisialisasi store untuk autentikasi dan data makanan
const authStore = useAuthStore()
const foodStore = useFoodStore()

// State untuk modal konfirmasi delete
const deleteConfirm = ref({
  show: false,
  foodId: null,
  foodName: '',
  loading: false
})

// Lifecycle hook: Dijalankan saat komponen pertama kali di-mount
onMounted(async () => {
  try {
    // Pastikan session user sudah di-check terlebih dahulu
    if (!authStore.user) {
      await authStore.checkSession()
    }

    // Setelah session ter-verifikasi, ambil data makanan dan analisis
    if (authStore.isAuthenticated) {
      await foodStore.fetchTodaysFoods()

      // ✨ PANGGIL FUNGSI BARU: Ambil analisis AI harian
      await foodStore.fetchDailyAnalysis()
    }
  } catch (error) {
    console.error('Error saat mount dashboard:', error)
    toast.error('Gagal memuat data', {
      description: 'Terjadi kesalahan saat mengambil data'
    })
  }
})

const summaryData = computed(() => ({
  kalori: {
    label: 'Kalori',
    value: Math.round(foodStore.totals.calories),
    max: authStore.user?.user_metadata?.dailyCalorieGoal || 2000,
    unit: 'kcal',
    class: 'kalori',
  },
  karbo: {
    label: 'Karbohidrat',
    value: Math.round(foodStore.totals.carbs),
    max: authStore.user?.user_metadata?.dailyCarbsGoal || 300,
    unit: 'g',
    class: 'karbo',
  },
  protein: {
    label: 'Protein',
    value: Math.round(foodStore.totals.protein),
    max: authStore.user?.user_metadata?.dailyProteinGoal || 50,
    unit: 'g',
    class: 'protein',
  },
  lemak: {
    label: 'Lemak',
    value: Math.round(foodStore.totals.fat),
    max: authStore.user?.user_metadata?.dailyFatGoal || 70,
    unit: 'g',
    class: 'lemak',
  },
  gula: {
    label: 'Gula',
    value: Math.round(foodStore.totals.sugar || 0),
    max: authStore.user?.user_metadata?.dailySugarGoal || 50,
    unit: 'g',
    class: 'gula',
  },
  garam: {
    label: 'Garam',
    value: normalizeSaltDisplay(foodStore.totals.salt || 0).value,
    max: (() => {
      const meta = authStore.user?.user_metadata || {}
      const pref = meta.dailySodiumGoal || meta.dailySaltGoal || 2000
      return normalizeSaltDisplay(pref).value
    })(),
    unit: 'mg',
    class: 'garam',
  },
}))

const getBarColorClass = (className) => {
  const colorMap = {
    kalori: 'bg-blue-600',
    karbo: 'bg-green-600',
    protein: 'bg-orange-600',
    lemak: 'bg-amber-600',
    gula: 'bg-purple-600',
    garam: 'bg-slate-600',
  }
  return colorMap[className] || 'bg-blue-600'
}

const handleDelete = (foodId, foodName) => {
  deleteConfirm.value = {
    show: true,
    foodId: foodId,
    foodName: foodName,
    loading: false
  }
}

const cancelDelete = () => {
  deleteConfirm.value = {
    show: false,
    foodId: null,
    foodName: '',
    loading: false
  }
}

const executeDelete = async () => {
  deleteConfirm.value.loading = true

  try {
    await foodStore.deleteFood(deleteConfirm.value.foodId)
    cancelDelete()

    // REFRESH ANALISIS setelah delete (karena cache akan di-invalidate di backend)
    // Kita tunggu sebentar biar backend sempat delete cache dulu
    setTimeout(async () => {
      await foodStore.fetchDailyAnalysis()
    }, 500)

  } catch (error) {
    cancelDelete()
    console.error('Error saat menghapus:', error)
  }
}
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-4 > * {
  animation: slideIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
</style>
