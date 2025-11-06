<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 pt-32">
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
        <span class="text-3xl">📈</span> Ringkasan Harian
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
        <span class="text-3xl">🍽️</span> Jurnal Makanan Harian
      </h2>

      <!-- Empty State: Ditampilkan jika belum ada makanan yang dicatat -->
      <div v-if="foodStore.foods.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🍴</div>
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
                  {{ Math.round((food.salt || 0) * 1000) }}mg
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
          <div class="text-6xl mb-4">⚠️</div>
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
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useFoodStore } from '@/stores/food'

// Inisialisasi store untuk autentikasi dan data makanan
const authStore = useAuthStore()
const foodStore = useFoodStore()

// State untuk modal konfirmasi delete
// Menyimpan status tampilan modal, data makanan yang akan dihapus, dan loading state
const deleteConfirm = ref({
  show: false,          // Status tampilan modal (true = tampil, false = tersembunyi)
  foodId: null,         // ID makanan yang akan dihapus
  foodName: '',         // Nama makanan untuk ditampilkan di modal
  loading: false        // Status loading saat proses delete sedang berjalan
})

// Lifecycle hook: Dijalankan saat komponen pertama kali di-mount
onMounted(async () => {
  try {
    // Pastikan session user sudah di-check terlebih dahulu
    if (!authStore.user) {
      await authStore.checkSession()
    }

    // Setelah session ter-verifikasi, ambil data makanan untuk hari ini
    if (authStore.isAuthenticated) {
      // Method yang benar adalah fetchTodaysFoods (bukan fetchFoodsForToday)
      await foodStore.fetchTodaysFoods()
    }
  } catch (error) {
    console.error('Error saat mount dashboard:', error)
    toast.error('Gagal memuat data', {
      description: 'Terjadi kesalahan saat mengambil data makanan'
    })
  }
})

/**
 * Computed Property: summaryData
 * Menghitung dan menyiapkan data ringkasan untuk setiap nutrisi
 * Data diambil dari foodStore (nilai saat ini) dan authStore (target harian)
 */
const summaryData = computed(() => ({
  kalori: {
    label: 'Kalori',
    value: Math.round(foodStore.totals.calories), // Total kalori yang sudah dikonsumsi
    max: authStore.user?.user_metadata?.dailyCalorieGoal || 2000, // Target kalori harian
    unit: 'kcal',
    class: 'kalori', // Digunakan untuk menentukan warna progress bar
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
    value: Math.round((foodStore.totals.salt || 0) * 1000), // Konversi dari gram ke miligram
    max: authStore.user?.user_metadata?.dailySodiumGoal || 2000,
    unit: 'mg',
    class: 'garam',
  },
}))

/**
 * Function: getBarColorClass
 * Menentukan warna progress bar berdasarkan jenis nutrisi
 * @param {string} className - Nama class nutrisi (kalori, karbo, protein, dll)
 * @returns {string} - Class Tailwind CSS untuk warna progress bar
 */
const getBarColorClass = (className) => {
  const colorMap = {
    kalori: 'bg-blue-600',
    karbo: 'bg-green-600',
    protein: 'bg-orange-600',
    lemak: 'bg-amber-600',
    gula: 'bg-purple-600',
    garam: 'bg-slate-600',
  }
  // Return warna sesuai nutrisi, default biru jika tidak ditemukan
  return colorMap[className] || 'bg-blue-600'
}

/**
 * Function: handleDelete
 * Menampilkan modal konfirmasi sebelum menghapus makanan
 * Dipanggil saat tombol hapus diklik
 * @param {string} foodId - ID makanan yang akan dihapus
 * @param {string} foodName - Nama makanan (untuk ditampilkan di modal)
 */
const handleDelete = (foodId, foodName) => {
  // Set data ke state deleteConfirm untuk ditampilkan di modal
  deleteConfirm.value = {
    show: true,        // Tampilkan modal
    foodId: foodId,    // Simpan ID makanan
    foodName: foodName, // Simpan nama makanan
    loading: false     // Reset loading state
  }
}

/**
 * Function: cancelDelete
 * Menutup modal konfirmasi dan membatalkan proses delete
 * Dipanggil saat tombol "Batal" diklik atau klik di luar modal
 */
const cancelDelete = () => {
  // Reset semua state ke nilai default
  deleteConfirm.value = {
    show: false,
    foodId: null,
    foodName: '',
    loading: false
  }
}

/**
 * Function: executeDelete
 * Menjalankan proses penghapusan makanan setelah konfirmasi
 * Dipanggil saat tombol "Ya, Hapus" diklik
 */
const executeDelete = async () => {
  // Set loading state agar tombol disabled dan tampil loading
  deleteConfirm.value.loading = true

  try {
    // Panggil fungsi delete dari foodStore
    await foodStore.deleteFood(deleteConfirm.value.foodId)

    // Tutup modal setelah berhasil
    cancelDelete()

    // Tampilkan notifikasi sukses
    // Toast sudah ditangani di dalam foodStore.deleteFood
  } catch (error) {
    // Jika terjadi error, tetap tutup modal
    cancelDelete()

    // Error toast sudah ditampilkan di foodStore, tapi kita log di sini
    console.error('Error saat menghapus:', error)
  }
}
</script>

<style scoped>
/* Animasi untuk smooth entrance effect saat kartu makanan ditampilkan */
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

/* Terapkan animasi slideIn ke semua kartu makanan */
.space-y-4 > * {
  animation: slideIn 0.3s ease-out;
}

/* Animasi scale untuk modal konfirmasi */
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

/* Terapkan animasi scale ke modal */
.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
</style>
