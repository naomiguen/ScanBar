<template>
  <div class="profile-page">
    <div v-if="user" class="profile-container">

      <div class="profile-banner-card">
        <div class="avatar">
          <span>{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <h1>{{ user.name }}</h1>
          <p>{{ user.email }}</p>
        </div>
        <div class="user-stats">
          <div class="stat-item"><strong>{{ user.age || 'N/A' }}</strong><span>tahun</span></div>
          <div class="stat-item"><strong>{{ user.weight || 'N/A' }}</strong><span>kg</span></div>
          <div class="stat-item"><strong>{{ user.height || 'N/A' }}</strong><span>cm</span></div>
          <div class="stat-item"><strong>{{ bmi.value || 'N/A' }}</strong><span>BMI</span></div>
        </div>
      </div>

      <div class="profile-grid">
        <div class="row row-top">
          <div class="card data-tubuh info-card">
            <div class="card-header">
              <h3><i class="fa-solid fa-person"></i> Data Tubuh</h3>
            </div>
            <div class="data-display">
              <div class="data-item"><span>Usia</span> <strong>{{ user.age || 'Belum diatur' }} tahun</strong></div>
              <div class="data-item"><span>Berat Badan</span> <strong>{{ user.weight || 'Belum diatur' }} kg</strong></div>
              <div class="data-item"><span>Tinggi Badan</span> <strong>{{ user.height || 'Belum diatur' }} cm</strong></div>
            </div>
          </div>

          <div class="card bmi-status-card">
            <div class="card-header">
              <h3><i class="fa-solid fa-weight-scale"></i> Status BMI</h3>
            </div>
            <div class="bmi-gauge">
              <div class="gauge-circle" :style="bmiStyle">
                <div class="gauge-inner-circle">
                  <span class="bmi-value">{{ bmi.value }}</span>
                  <span class="bmi-label">BMI</span>
                </div>
              </div>
            </div>
            <p class="bmi-status-text" :style="{ color: bmi.color }">{{ bmi.status }}</p>
          </div>
        </div>

        <div class="row row-bottom">
          <div class="card activity-summary info-card">
            <div class="card-header">
              <h3><i class="fa-solid fa-chart-line"></i> Ringkasan Aktivitas</h3>
            </div>
            <div class="summary-tabs">
              <button
                v-for="period in periods"
                :key="period.value + '-2'"
                @click="changePeriod(period.value)"
                :class="['tab-button', { active: selectedPeriod === period.value }]"
                :disabled="loadingSummary"
              >
                {{ period.label }}
              </button>
            </div>

            <div v-if="loadingSummary" class="loading-summary">
              <p>Memuat data...</p>
            </div>

            <div v-else class="summary-content">
              <div class="summary-item">
                <span class="summary-label">Total Kalori</span>
                <strong class="summary-value kalori">{{ summaryData.calories || 0 }} kcal</strong>
              </div>
              <div class="summary-item">
                <span class="summary-label">Karbohidrat</span>
                <strong class="summary-value karbo">{{ summaryData.carbs || 0 }} g</strong>
              </div>
              <div class="summary-item">
                <span class="summary-label">Protein</span>
                <strong class="summary-value protein">{{ summaryData.protein || 0 }} g</strong>
              </div>
              <div class="summary-item">
                <span class="summary-label">Lemak</span>
                <strong class="summary-value lemak">{{ summaryData.fat || 0 }} g</strong>
              </div>
            </div>
          </div>

          <div class="card nutrient-target-card">
            <div class="card-header">
              <h3><i class="fa-solid fa-bullseye"></i> Target Nutrisi Harian</h3>
            </div>

            <div class="nutrient-grid-colored">
              <div class="nutrient-box kalori-box">
                <div class="nutrient-label">
                  <span class="dot dot-kalori"></span> Kalori
                </div>
                <div class="nutrient-value">{{ user.dailyCalorieGoal || 0 }} <span class="unit">kcal</span></div>
              </div>

              <div class="nutrient-box karbo-box">
                <div class="nutrient-label">
                  <span class="dot dot-karbo"></span> Karbohidrat
                </div>
                <div class="nutrient-value">{{ user.dailyCarbsGoal || 0 }} <span class="unit">gram</span></div>
              </div>

              <div class="nutrient-box protein-box">
                <div class="nutrient-label">
                  <span class="dot dot-protein"></span> Protein
                </div>
                <div class="nutrient-value">{{ user.dailyProteinGoal || 0 }} <span class="unit">gram</span></div>
              </div>

              <div class="nutrient-box lemak-box">
                <div class="nutrient-label">
                  <span class="dot dot-lemak"></span> Lemak
                </div>
                <div class="nutrient-value">{{ user.dailyFatGoal || 0 }} <span class="unit">gram</span></div>
              </div>
            </div>

            <div class="update-prompt-colored">
              <p>
                Gunakan halaman <router-link to="/calculator"><strong>Kalkulator</strong></router-link>
                untuk menghitung dan memperbarui target nutrisi berdasarkan data tubuh Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading-state">
      <p>Memuat data profil...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/axios-config.js';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const selectedPeriod = ref('daily');
const summaryData = ref({ calories: 0, carbs: 0, protein: 0, fat: 0 });
const loadingSummary = ref(false);

const periods = [
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' }
];

onMounted(async () => {
  if (authStore.fetchUserProfile) {
    await authStore.fetchUserProfile();
  }
  await loadNutritionSummary();
});

async function loadNutritionSummary() {
  loadingSummary.value = true;
  try {
    const response = await apiClient.get(`/api/foods/summary?period=${selectedPeriod.value}`);
    summaryData.value = response.data;
  } catch (error) {
    console.error('Error loading nutrition summary:', error);
    summaryData.value = { calories: 0, carbs: 0, protein: 0, fat: 0 };
  } finally {
    loadingSummary.value = false;
  }
}

async function changePeriod(period) {
  selectedPeriod.value = period;
  await loadNutritionSummary();
}

const userInitials = computed(() => {
  if (!user.value?.name) return '';
  const names = user.value.name.split(' ');
  return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0].substring(0, 2);
});

const bmi = computed(() => {
  if (!user.value?.weight || !user.value?.height) {
    return { value: 'N/A', status: 'Data tidak lengkap', color: '#64748b' };
  }
  const heightInMeters = user.value.height / 100;
  const bmiValue = (user.value.weight / (heightInMeters * heightInMeters)).toFixed(1);

  if (bmiValue < 18.5) return { value: bmiValue, status: 'Underweight', color: '#3b82f6' };
  if (bmiValue <= 24.9) return { value: bmiValue, status: 'Normal', color: '#22c55e' };
  if (bmiValue <= 29.9) return { value: bmiValue, status: 'Overweight', color: '#f97316' };
  return { value: bmiValue, status: 'Obesitas', color: '#ef4444' };
});

const bmiStyle = computed(() => {
  const value = parseFloat(bmi.value.value);
  if (isNaN(value)) return { background: '#e2e8f0' };
  const percentage = Math.min((value / 40) * 100, 100);
  return { background: `conic-gradient(${bmi.value.color} ${percentage}%, #e2e8f0 ${percentage}%)` };
});
</script>

<style scoped>
.profile-page { background-color: #f8fafc; min-height: 100vh; padding: 40px 20px; font-family: 'Segoe UI', sans-serif; }
.profile-container { max-width: 1200px; margin: auto; }
.loading-state { text-align: center; padding: 4rem; font-size: 1.2rem; color: #64748b; }

.profile-banner-card { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border-radius: 20px; padding: 30px; display: flex; align-items: center; gap: 30px; margin-bottom: 30px; }
.avatar { width: 100px; height: 100px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; flex-shrink: 0; text-transform: uppercase; }
.user-info { flex-grow: 1; }
.user-info h1 { margin: 0; font-size: 2.5rem; }
.user-info p { margin: 0; opacity: 0.8; }
.user-stats { display: flex; gap: 20px; background: rgba(0,0,0,0.1); padding: 15px 25px; border-radius: 12px; }
.stat-item { text-align: center; }
.stat-item strong { display: block; font-size: 1.5rem; }
.stat-item span { font-size: 0.8rem; opacity: 0.8; }

.profile-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
.row { display: grid; grid-template-columns: 1fr; gap: 20px; }
.row .card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 18px rgba(0,0,0,0.04); }

@media (min-width: 900px) {
  .profile-grid { grid-template-columns: 1fr; }
  .row { grid-template-columns: 1fr 1fr; align-items: start; }
}

@media (max-width: 599px) {
  .profile-page { padding: 20px 12px; }
  .avatar { width: 80px; height: 80px; font-size: 2rem; }
  .user-info h1 { font-size: 1.6rem; }
  .bmi-gauge .gauge-circle { width: 140px; height: 140px; }
  .gauge-inner-circle { width: 115px; height: 115px; }
}

.info-card, .bmi-status-card, .nutrient-target-card { background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #1746a2; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }
h3 { margin: 0; font-size: 1.2rem; }

.bmi-gauge { display: flex; justify-content: center; margin: 20px 0; }
.gauge-circle { width: 180px; height: 180px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.gauge-inner-circle { width: 150px; height: 150px; border-radius: 50%; background: white; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.bmi-value { font-size: 3rem; font-weight: 700; color: #1e293b; }
.bmi-label { font-size: 1rem; color: #64748b; }
.bmi-status-text { text-align: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; }

.data-display { display: flex; flex-direction: column; gap: 1rem; }
.data-item { display: flex; justify-content: space-between; padding: 1rem; background-color: #f8fafc; border-radius: 8px; }

.summary-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
.tab-button { flex: 1; padding: 10px; border: none; background: #f1f5f9; border-radius: 8px; cursor: pointer; font-weight: 600; color: #64748b; transition: all 0.3s; }
.tab-button:hover:not(:disabled) { background: #e2e8f0; }
.tab-button.active { background: #2563eb; color: white; }
.tab-button:disabled { cursor: not-allowed; opacity: 0.6; }

.loading-summary { text-align: center; padding: 2rem; color: #64748b; }
.summary-content { display: flex; flex-direction: column; gap: 12px; }
.summary-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 10px; }
.summary-label { color: #64748b; font-weight: 500; }
.summary-value { font-size: 1.3rem; font-weight: 700; }

.nutrient-grid-colored { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px; }
.nutrient-box { border-radius: 12px; padding: 20px; background: #f8fafc; transition: 0.3s ease; }
.kalori-box { background-color: #e0ebff; }
.karbo-box { background-color: #e6ffea; }
.protein-box { background-color: #fff3e0; }
.lemak-box { background-color: #fff8dc; }
.nutrient-label { font-weight: 600; font-size: 1rem; color: #334155; display: flex; align-items: center; gap: 8px; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot-kalori { background-color: #2563eb; }
.dot-karbo { background-color: #16a34a; }
.dot-protein { background-color: #ea580c; }
.dot-lemak { background-color: #b45309; }
.nutrient-value { font-size: 2rem; font-weight: 700; margin-top: 5px; }
.unit { font-size: 1rem; color: #64748b; margin-left: 3px; }

.update-prompt-colored { margin-top: 20px; background: #eef4ff; padding: 15px; border-radius: 12px; border-left: 4px solid #2563eb; color: #1e3a8a; text-align: left; }
.update-prompt-colored a { color: #1e3a8a; text-decoration: none; font-weight: 600; }
.update-prompt-colored a:hover { text-decoration: underline; }
</style>
