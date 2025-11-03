<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 pt-32">
    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2">
        Dashboard Nutrisi
      </h1>
      <p class="text-lg text-slate-600">
        Pantau konsumsi harian Anda
      </p>
    </div>

    <!-- Ringkasan Harian -->
    <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10 max-w-7xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
        <span class="text-3xl">📈</span> Ringkasan Harian
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div
          v-for="(goal, key) in summaryData"
          :key="key"
          class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Top: Label & Value -->
          <div class="flex justify-between items-center mb-3">
            <span class="font-bold text-slate-800 text-base">{{ goal.label }}</span>
            <span class="font-semibold text-slate-700 text-sm">
              {{ goal.value }} / {{ goal.max }} {{ goal.unit }}
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="bg-slate-200 rounded-full h-3 overflow-hidden mb-3">
            <div
              :class="getBarColorClass(goal.class)"
              class="h-3 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${Math.min((goal.value / goal.max) * 100, 100)}%` }"
            ></div>
          </div>

          <!-- Sisa -->
          <p class="text-sm text-slate-600">
            Sisa: <span class="font-semibold">{{ Math.max(0, goal.max - goal.value) }} {{ goal.unit }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Jurnal Makanan Harian -->
    <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-7xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
        <span class="text-3xl">🍽️</span> Jurnal Makanan Harian
      </h2>

      <!-- Empty State -->
      <div v-if="foodStore.foods.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🍴</div>
        <p class="text-lg text-slate-500">
          Anda belum mencatat makanan apa pun hari ini.
        </p>
      </div>

      <!-- Food List -->
      <div v-else class="space-y-4">
        <div
          v-for="food in foodStore.foods"
          :key="food._id"
          class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Header: Nama & Waktu -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl md:text-2xl font-bold text-blue-900">
              {{ food.productName }}
            </h3>
            <span class="text-sm text-slate-600 font-medium">
              {{ new Date(food.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>

          <!-- Body: Nutrients & Delete Button -->
          <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <!-- Nutrients Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 flex-1">
              <!-- Kalori -->
              <div class="bg-blue-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-blue-600">
                  {{ Math.round(food.calories) }}
                </div>
                <div class="text-xs font-medium text-blue-700 mt-1">
                  kcal
                </div>
              </div>

              <!-- Karbohidrat -->
              <div class="bg-green-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-green-600">
                  {{ Math.round(food.carbs) }}g
                </div>
                <div class="text-xs font-medium text-green-700 mt-1">
                  karbo
                </div>
              </div>

              <!-- Protein -->
              <div class="bg-orange-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-orange-600">
                  {{ Math.round(food.protein) }}g
                </div>
                <div class="text-xs font-medium text-orange-700 mt-1">
                  protein
                </div>
              </div>

              <!-- Lemak -->
              <div class="bg-amber-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-amber-600">
                  {{ Math.round(food.fat) }}g
                </div>
                <div class="text-xs font-medium text-amber-700 mt-1">
                  lemak
                </div>
              </div>

              <!-- Gula -->
              <div class="bg-purple-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-purple-600">
                  {{ Math.round(food.sugar || 0) }}g
                </div>
                <div class="text-xs font-medium text-purple-700 mt-1">
                  gula
                </div>
              </div>

              <!-- Garam -->
              <div class="bg-slate-100 rounded-xl p-3 text-center">
                <div class="text-xl md:text-2xl font-bold text-slate-600">
                  {{ Math.round((food.salt || 0) * 1000) }}mg
                </div>
                <div class="text-xs font-medium text-slate-700 mt-1">
                  garam
                </div>
              </div>
            </div>

            <!-- Delete Button -->
            <button
              @click="confirmDelete(food._id, food.productName)"
              class="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl px-6 py-3 md:py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-2 text-base"
            >
              <span class="text-xl">🗑️</span> Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
import { useFoodStore } from '@/stores/food'

const authStore = useAuthStore()
const foodStore = useFoodStore()

onMounted(() => {
  foodStore.fetchTodaysFoods()
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
    value: Math.round((foodStore.totals.salt || 0) * 1000),
    max: authStore.user?.user_metadata?.dailySodiumGoal || 2000,
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

const confirmDelete = (foodId, foodName) => {
  Swal.fire({
    title: `Yakin ingin menghapus ${foodName}?`,
    text: 'Tindakan ini tidak dapat dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      foodStore.deleteFood(foodId)
      Swal.fire({
        icon: 'success',
        title: 'Dihapus!',
        text: `${foodName} telah dihapus dari jurnal Anda.`,
        timer: 2000,
        showConfirmButton: false,
      })
    }
  })
}
</script>

<style scoped>
/* Smooth animations */
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
</style>
