<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4 pt-32">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-2">
          Kalkulator Kebutuhan Kalori
        </h1>
        <p class="text-base md:text-lg text-slate-600">
          Hitung dan simpan target kalori harian Anda
        </p>
      </div>

      <!-- Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <!-- Form Input Card -->
        <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-blue-100">
          <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <i class="fa-solid fa-user text-blue-600"></i>
            Data Diri
          </h2>

          <form @submit.prevent="calculateTDEE" class="space-y-5">
            <!-- Jenis Kelamin -->
            <div class="form-group">
              <label class="block text-slate-800 font-semibold mb-2 text-sm md:text-base">
                Jenis Kelamin
              </label>
              <select
                v-model="form.gender"
                required
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>

            <!-- Usia -->
            <div class="form-group">
              <label class="block text-slate-800 font-semibold mb-2 text-sm md:text-base">
                Usia
              </label>
              <input
                type="number"
                v-model.number="form.age"
                placeholder="Masukkan usia (tahun)"
                required
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
              />
            </div>

            <!-- Berat Badan -->
            <div class="form-group">
              <label class="block text-slate-800 font-semibold mb-2 text-sm md:text-base">
                Berat Badan
              </label>
              <input
                type="number"
                v-model.number="form.weight"
                placeholder="Masukkan berat badan (kg)"
                required
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
              />
            </div>

            <!-- Tinggi Badan -->
            <div class="form-group">
              <label class="block text-slate-800 font-semibold mb-2 text-sm md:text-base">
                Tinggi Badan
              </label>
              <input
                type="number"
                v-model.number="form.height"
                placeholder="Masukkan tinggi badan (cm)"
                required
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
              />
            </div>

            <!-- Tingkat Aktivitas -->
            <div class="form-group">
              <label class="block text-slate-800 font-semibold mb-2 text-sm md:text-base">
                Tingkat Aktivitas
              </label>
              <select
                v-model.number="form.activityLevel"
                required
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
              >
                <option value="1.2">Tidak Aktif (tidak berolahraga)</option>
                <option value="1.375">Ringan (1–3x/minggu)</option>
                <option value="1.55">Sedang (3–5x/minggu)</option>
                <option value="1.725">Berat (6–7x/minggu)</option>
                <option value="1.9">Sangat Berat (atlet)</option>
              </select>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl px-6 py-4 text-base md:text-lg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <i class="fa-solid fa-calculator"></i>
              Hitung Kebutuhan Kalori
            </button>
          </form>
        </div>

        <!-- Result Card -->
        <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-blue-100">
          <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <i class="fa-solid fa-bullseye text-blue-600"></i>
            Hasil Perhitungan
          </h2>

          <!-- Results Display -->
          <div v-if="results" class="space-y-6">
            <!-- TDEE Card -->
            <div class="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-3xl p-8 md:p-10 text-center shadow-xl">
              <p class="text-sm md:text-base font-semibold mb-3 text-blue-100">
                Kebutuhan Kalori Harian Anda
              </p>
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3">
                {{ results.tdee }}
              </h1>
              <p class="text-sm md:text-base font-semibold text-blue-100">
                kalori per hari
              </p>
            </div>

            <!-- Makronutrien -->
            <div>
              <h3 class="text-lg md:text-xl font-bold text-slate-800 mb-4">
                Rekomendasi Makronutrien
              </h3>

              <div class="space-y-3">
                <!-- Karbohidrat -->
                <div class="bg-green-100 border-2 border-green-300 rounded-xl p-4 flex justify-between items-center">
                  <span class="font-bold text-green-800 text-base md:text-lg">Karbohidrat</span>
                  <span class="font-bold text-green-800 text-base md:text-lg">{{ results.carbs }} g</span>
                </div>

                <!-- Protein -->
                <div class="bg-orange-100 border-2 border-orange-300 rounded-xl p-4 flex justify-between items-center">
                  <span class="font-bold text-orange-800 text-base md:text-lg">Protein</span>
                  <span class="font-bold text-orange-800 text-base md:text-lg">{{ results.protein }} g</span>
                </div>

                <!-- Lemak -->
                <div class="bg-amber-100 border-2 border-amber-300 rounded-xl p-4 flex justify-between items-center">
                  <span class="font-bold text-amber-800 text-base md:text-lg">Lemak</span>
                  <span class="font-bold text-amber-800 text-base md:text-lg">{{ results.fat }} g</span>
                </div>

                <!-- Gula -->
                <div class="bg-purple-100 border-2 border-purple-300 rounded-xl p-4 flex justify-between items-center">
                  <span class="font-bold text-purple-800 text-base md:text-lg">Gula</span>
                  <span class="font-bold text-purple-800 text-base md:text-lg">{{ results.sugar }} g</span>
                </div>

                <!-- Garam -->
                <div class="bg-slate-100 border-2 border-slate-300 rounded-xl p-4 flex justify-between items-center">
                  <span class="font-bold text-slate-800 text-base md:text-lg">Garam</span>
                  <span class="font-bold text-slate-800 text-base md:text-lg">{{ results.salt }} g</span>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <button
              v-if="authStore.isAuthenticated"
              @click="saveGoals"
              class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl px-6 py-4 text-base md:text-lg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            >
              <i class="fa-solid fa-floppy-disk"></i>
              Simpan Target & Perbarui Profil
            </button>

            <!-- Login Prompt -->
            <p v-else class="text-center text-slate-600 mt-6">
              <router-link to="/login" class="text-blue-600 font-bold hover:underline">
                Login
              </router-link>
              untuk menyimpan target Anda.
            </p>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-16 text-slate-400">
            <i class="fa-solid fa-calculator text-6xl md:text-7xl mb-4 text-slate-300"></i>
            <p class="text-base md:text-lg text-center text-slate-500">
              Lengkapi form untuk melihat hasil perhitungan
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const authStore = useAuthStore()

const form = ref({
  gender: 'male',
  age: null,
  weight: null,
  height: null,
  activityLevel: 1.2,
})

const results = ref(null)

const calculateTDEE = () => {
  if (!form.value.age || !form.value.weight || !form.value.height) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Mohon lengkapi semua data dengan benar!',
      confirmButtonColor: '#2563eb'
    })
    return
  }

  // Menghitung BMR berdasarkan Mifflin-St Jeor Formula
  const bmr =
    form.value.gender === 'male'
      ? 10 * form.value.weight + 6.25 * form.value.height - 5 * form.value.age + 5
      : 10 * form.value.weight + 6.25 * form.value.height - 5 * form.value.age - 161

  const tdee = Math.round(bmr * form.value.activityLevel)

  //Menyimpan hasil
  results.value = {
    tdee,
    protein: Math.round((tdee * 0.3) / 4),
    carbs: Math.round((tdee * 0.4) / 4),
    fat: Math.round((tdee * 0.3) / 9),
    sugar: 50, // Rekomendasi WHO < 50g
    salt: 5, // Recomendasi who < 5g
  }

  // Notifikasi
  Swal.fire({
    icon: 'success',
    title: 'Perhitungan Berhasil!',
    text: `Kebutuhan kalori harian Anda adalah ${tdee} kcal`,
    timer: 2000,
    showConfirmButton: false
  })
}

const saveGoals = () => {
  if (!results.value) return

  const dataToSave = {
    age: form.value.age,
    weight: form.value.weight,
    height: form.value.height,
    dailyCalorieGoal: results.value.tdee,
    dailyProteinGoal: results.value.protein,
    dailyCarbsGoal: results.value.carbs,
    dailyFatGoal: results.value.fat,
    dailySugarGoal: results.value.sugar,
    // Store sodium target in milligrams (convert from grams)
    dailySodiumGoal: Math.round(results.value.salt * 1000),
    // Keep legacy dailySaltGoal (grams) for backward compatibility
    dailySaltGoal: results.value.salt,
  }

  authStore.updateProfile(dataToSave)
}
</script>

<style scoped>
/* Custom animations */
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

.space-y-6 > * {
  animation: fadeIn 0.3s ease-out;
}

/* Focus ring enhancement */
input:focus,
select:focus {
  outline: none;
}

/* efek hover untuk input */
input:hover,
select:hover {
  border-color: #94a3b8;
}


input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
