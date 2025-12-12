<template>
  <div class="min-h-screen bg-slate-50 py-10 px-4">
    <!-- Menampilkan konten hanya jika data user tersedia -->
    <div v-if="user" class="max-w-7xl mx-auto">

      <!-- Profile Banner Card -->
      <div class="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-8 shadow-xl shadow-blue-500/30">
        <!-- Avatar Component (dengan foto upload) -->
        <div class="flex-shrink-0">
          <ProfileAvatar />
        </div>

        <!-- User Info -->
        <div class="flex-grow text-center md:text-left">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1">
            {{ user.user_metadata?.name || 'Pengguna' }}
          </h1>
          <p class="text-base md:text-lg opacity-90">
            {{ user.email }}
          </p>
        </div>

        <!-- Statistik pengguna (umur, berat, tinggi, BMI) -->
        <div class="flex gap-4 md:gap-5 bg-black/10 backdrop-blur-sm px-6 py-4 rounded-2xl">
          <div class="text-center">
            <div class="text-2xl md:text-3xl font-bold">{{ user.user_metadata?.age || 'N/A' }}</div>
            <div class="text-xs md:text-sm opacity-80">tahun</div>
          </div>
          <div class="text-center">
            <div class="text-2xl md:text-3xl font-bold">{{ user.user_metadata?.weight || 'N/A' }}</div>
            <div class="text-xs md:text-sm opacity-80">kg</div>
          </div>
          <div class="text-center">
            <div class="text-2xl md:text-3xl font-bold">{{ user.user_metadata?.height || 'N/A' }}</div>
            <div class="text-xs md:text-sm opacity-80">cm</div>
          </div>
          <div class="text-center">
            <div class="text-2xl md:text-3xl font-bold">{{ bmi.value || 'N/A' }}</div>
            <div class="text-xs md:text-sm opacity-80">BMI</div>
          </div>
        </div>
      </div>

      <!-- Profile Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        <!-- Ringkasan Aktivitas Card -->
        <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
            <i class="fa-solid fa-chart-line text-2xl text-blue-600"></i>
            <h3 class="text-xl md:text-2xl font-bold text-blue-900">Ringkasan Aktivitas</h3>
          </div>

          <!-- Period Tabs -->
          <div class="flex gap-2 mb-6">
            <button
              v-for="period in periods"
              :key="period.value"
              @click="changePeriod(period.value)"
              :disabled="loadingSummary"
              :class="[
                'flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300',
                selectedPeriod === period.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                loadingSummary ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              ]"
            >
              {{ period.label }}
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loadingSummary" class="text-center py-8 text-slate-500">
            <div class="text-4xl mb-2">⏳</div>
            <p>Memuat data...</p>
          </div>

          <!-- Summary Content -->
          <div v-else class="space-y-3">
            <!-- Kalori -->
            <div class="flex justify-between items-center bg-slate-50 px-4 py-4 rounded-xl">
              <span class="text-slate-600 font-medium">Total Kalori</span>
              <strong class="text-xl md:text-2xl font-bold text-blue-600">{{ summaryData.calories || 0 }} kcal</strong>
            </div>

            <!-- Karbohidrat -->
            <div class="flex justify-between items-center bg-slate-50 px-4 py-4 rounded-xl">
              <span class="text-slate-600 font-medium">Karbohidrat</span>
              <strong class="text-xl md:text-2xl font-bold text-green-600">{{ summaryData.carbs || 0 }} g</strong>
            </div>

            <!-- Protein -->
            <div class="flex justify-between items-center bg-slate-50 px-4 py-4 rounded-xl">
              <span class="text-slate-600 font-medium">Protein</span>
              <strong class="text-xl md:text-2xl font-bold text-orange-600">{{ summaryData.protein || 0 }} g</strong>
            </div>

            <!-- Lemak -->
            <div class="flex justify-between items-center bg-slate-50 px-4 py-4 rounded-xl">
              <span class="text-slate-600 font-medium">Lemak</span>
              <strong class="text-xl md:text-2xl font-bold text-amber-600">{{ summaryData.fat || 0 }} g</strong>
            </div>

            <!-- Gula -->
            <div class="flex justify-between items-center bg-slate-50 px-4 py-4 rounded-xl">
              <span class="text-slate-600 font-medium">Gula</span>
              <strong class="text-xl md:text-2xl font-bold text-purple-600">{{ summaryData.sugar || 0 }} g</strong>
            </div>

            <!-- Garam -->
            <div class="flex justify-between items-center bg-slate-50 px-4 py-4 rounded-xl">
              <span class="text-slate-600 font-medium">Garam</span>
              <strong class="text-xl md:text-2xl font-bold text-cyan-600">{{ summaryData.sodium || 0 }} mg</strong>
            </div>
          </div>
        </div>

        <!-- BMI Status Card -->
        <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
            <i class="fa-solid fa-weight-scale text-2xl text-blue-600"></i>
            <h3 class="text-xl md:text-2xl font-bold text-blue-900">Status BMI</h3>
          </div>

          <!-- BMI Gauge -->
          <div class="flex justify-center my-6">
            <div
              class="w-44 h-44 rounded-full flex items-center justify-center"
              :style="bmiStyle"
            >
              <div class="w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center">
                <span class="text-5xl font-bold text-slate-800">{{ bmi.value }}</span>
                <span class="text-base text-slate-600">BMI</span>
              </div>
            </div>
          </div>

          <!-- BMI Status Text -->
          <p
            class="text-center text-2xl md:text-3xl font-bold mb-6"
            :style="{ color: bmi.color }"
          >
            {{ bmi.status }}
          </p>

          <!-- BMI Legend -->
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <div class="flex items-center gap-3 flex-1">
                <span class="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span class="font-semibold text-slate-700">Underweight</span>
              </div>
              <span class="text-slate-600 text-sm min-w-[80px] text-right">&lt; 18.5</span>
            </div>

            <div class="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <div class="flex items-center gap-3 flex-1">
                <span class="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>
                <span class="font-semibold text-slate-700">Normal</span>
              </div>
              <span class="text-slate-600 text-sm min-w-[80px] text-right">18.5 - 24.9</span>
            </div>

            <div class="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <div class="flex items-center gap-3 flex-1">
                <span class="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></span>
                <span class="font-semibold text-slate-700">Overweight</span>
              </div>
              <span class="text-slate-600 text-sm min-w-[80px] text-right">25 - 29.9</span>
            </div>

            <div class="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <div class="flex items-center gap-3 flex-1">
                <span class="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></span>
                <span class="font-semibold text-slate-700">Obesitas</span>
              </div>
              <span class="text-slate-600 text-sm min-w-[80px] text-right">&gt;= 30</span>
            </div>
          </div>
        </div>

        <!-- Target Nutrisi Harian Card (Full Width) -->
        <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 lg:col-span-2">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
            <i class="fa-solid fa-bullseye text-2xl text-blue-600"></i>
            <h3 class="text-xl md:text-2xl font-bold text-blue-900">Target Nutrisi Harian</h3>
          </div>

          <!-- Nutrient Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Kalori -->
            <div class="bg-blue-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-3 h-3 rounded-full bg-blue-600"></span>
                <span class="font-semibold text-slate-700">Kalori</span>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-blue-600">
                {{ dailyGoals.calories }} <span class="text-base text-slate-600 ml-1">kcal</span>
              </div>
            </div>

            <!-- Karbohidrat -->
            <div class="bg-green-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-3 h-3 rounded-full bg-green-600"></span>
                <span class="font-semibold text-slate-700">Karbohidrat</span>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-green-600">
                {{ dailyGoals.carbs }} <span class="text-base text-slate-600 ml-1">gram</span>
              </div>
            </div>

            <!-- Protein -->
            <div class="bg-orange-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-3 h-3 rounded-full bg-orange-600"></span>
                <span class="font-semibold text-slate-700">Protein</span>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-orange-600">
                {{ dailyGoals.protein }} <span class="text-base text-slate-600 ml-1">gram</span>
              </div>
            </div>

            <!-- Lemak -->
            <div class="bg-amber-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-3 h-3 rounded-full bg-amber-700"></span>
                <span class="font-semibold text-slate-700">Lemak</span>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-amber-700">
                {{ dailyGoals.fat }} <span class="text-base text-slate-600 ml-1">gram</span>
              </div>
            </div>

            <!-- Gula -->
            <div class="bg-purple-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-3 h-3 rounded-full bg-purple-600"></span>
                <span class="font-semibold text-slate-700">Gula</span>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-purple-600">
                {{ dailyGoals.sugar }} <span class="text-base text-slate-600 ml-1">gram</span>
              </div>
            </div>

            <!-- Garam -->
            <div class="bg-cyan-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-3 h-3 rounded-full bg-cyan-600"></span>
                <span class="font-semibold text-slate-700">Garam</span>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-cyan-600">
                {{ dailyGoals.salt }} <span class="text-base text-slate-600 ml-1">mg</span>
              </div>
            </div>
          </div>

          <!-- Update Prompt -->
          <div class="mt-6 bg-blue-50 border-l-4 border-blue-600 px-5 py-4 rounded-xl">
            <p class="text-blue-900">
              Gunakan halaman
              <router-link to="/calculator" class="font-bold hover:underline">Kalkulator</router-link>
              untuk menghitung dan memperbarui target nutrisi berdasarkan data tubuh Anda.
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-16">
      <div class="text-6xl mb-4">⏳</div>
      <p class="text-xl text-slate-500">Memuat data profil...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFoodStore } from '@/stores/food'
import { normalizeSaltDisplay } from '@/utils/units'
import ProfileAvatar from '@/components/ProfileAvatar.vue'

const authStore = useAuthStore()
const foodStore = useFoodStore()
const user = computed(() => authStore.user)

const selectedPeriod = ref('daily')

const summaryData = computed(() => {
  const s = foodStore.summary || {}
  const sodiumNorm = normalizeSaltDisplay(s.salt ?? 0)
  return {
    calories: s.calories ?? 0,
    carbs: s.carbs ?? 0,
    protein: s.protein ?? 0,
    fat: s.fat ?? 0,
    sugar: s.sugar ?? 0,
    sodium: sodiumNorm.value,
  }
})
const loadingSummary = ref(false)

const periods = [
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' }
]

// Daily goals dengan fallback
const dailyGoals = computed(() => {
  const meta = user.value?.user_metadata || {}

  return {
    calories: meta.dailyCalorieGoal || meta.dailyCalories || 0,
    carbs: meta.dailyCarbsGoal || meta.dailyCarbs || 0,
    protein: meta.dailyProteinGoal || meta.dailyProtein || 0,
    fat: meta.dailyFatGoal || meta.dailyFat || 0,
    sugar: meta.dailySugarGoal || meta.dailySugar || 0,
    salt: (() => {
      const saltGoal = meta.dailySaltGoal || meta.dailySalt || 0
      const sodiumGoal = meta.dailySodiumGoal || meta.dailySodium || 0
      const chosen = saltGoal || sodiumGoal || 0
      return normalizeSaltDisplay(chosen).value
    })()
  }
})

onMounted(async () => {
  loadingSummary.value = true
  try {
    await foodStore.fetchSummaryByPeriod(selectedPeriod.value)
  } catch (err) {
    console.error('Gagal memuat ringkasan saat mount:', err)
  } finally {
    loadingSummary.value = false
  }
})

async function changePeriod(period) {
  selectedPeriod.value = period
  loadingSummary.value = true
  try {
    await foodStore.fetchSummaryByPeriod(period)
  } catch (err) {
    console.error('Gagal mengganti periode ringkasan:', err)
  } finally {
    loadingSummary.value = false
  }
}

const bmi = computed(() => {
  const weight = user.value?.user_metadata?.weight
  const height = user.value?.user_metadata?.height

  if (!weight || !height) {
    return { value: 'N/A', status: 'Data tidak lengkap', color: '#64748b' }
  }

  const heightInMeters = height / 100
  const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1)

  if (bmiValue < 18.5) return { value: bmiValue, status: 'Underweight', color: '#3b82f6' }
  if (bmiValue <= 24.9) return { value: bmiValue, status: 'Normal', color: '#22c55e' }
  if (bmiValue <= 29.9) return { value: bmiValue, status: 'Overweight', color: '#f97316' }
  return { value: bmiValue, status: 'Obesitas', color: '#ef4444' }
})

const bmiStyle = computed(() => {
  const value = parseFloat(bmi.value.value)
  if (isNaN(value)) return { background: '#e2e8f0' }
  const percentage = Math.min((value / 40) * 100, 100)
  return { background: `conic-gradient(${bmi.value.color} ${percentage}%, #e2e8f0 ${percentage}%)` }
})
</script>

<style scoped>
/* Smooth animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-3 > *, .space-y-2 > * {
  animation: fadeIn 0.3s ease-out;
}
</style>
