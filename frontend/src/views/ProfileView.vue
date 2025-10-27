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
        <div class="info-card">
          <div class="card-header">
            <h3><i class="fa-solid fa-chart-line"></i> Ringkasan Aktivitas</h3>
          </div>
          <div class="summary-tabs">
            <button
              v-for="period in periods"
              :key="period.value"
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
              <div class="summary-item">
                <span class="summary-label">Gula</span>
                <strong class="summary-value gula">{{ summaryData.sugar || 0 }} g</strong>
              </div>
              <div class="summary-item">
                <span class="summary-label">Garam</span>
                <strong class="summary-value garam">{{ summaryData.salt || 0 }} g</strong>
              </div>
          </div>
        </div>

        <div class="bmi-status-card">
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
          <!-- BMI legend: show categories and ranges -->
          <div class="bmi-legend">
            <div class="bmi-legend-item"><span class="legend-dot legend-underweight"></span><span class="legend-label">Underweight</span><span class="legend-range">&lt; 18.5</span></div>
            <div class="bmi-legend-item"><span class="legend-dot legend-normal"></span><span class="legend-label">Normal</span><span class="legend-range">18.5 - 24.9</span></div>
            <div class="bmi-legend-item"><span class="legend-dot legend-overweight"></span><span class="legend-label">Overweight</span><span class="legend-range">25 - 29.9</span></div>
            <div class="bmi-legend-item"><span class="legend-dot legend-obese"></span><span class="legend-label">Obesitas</span><span class="legend-range">&gt;= 30</span></div>
          </div>
        </div>



  <div class="nutrient-target-card">
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

      <div class="nutrient-box gula-box">
        <div class="nutrient-label">
          <span class="dot dot-gula"></span> Gula
        </div>
        <div class="nutrient-value">{{ user.dailySugarGoal || 0 }} <span class="unit">gram</span></div>
      </div>

      <div class="nutrient-box garam-box">
        <div class="nutrient-label">
          <span class="dot dot-garam"></span> Garam
        </div>
        <div class="nutrient-value">{{ user.dailySaltGoal || 0 }} <span class="unit">gram</span></div>
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
    <div v-else class="loading-state">
        <p>Memuat data profil...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useFoodStore } from '@/stores/food';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const selectedPeriod = ref('daily');
const foodStore = useFoodStore();
const summaryData = computed(() => {
  const s = foodStore.summary || {};
  return {
    calories: s.calories ?? 0,
    carbs: s.carbs ?? 0,
    protein: s.protein ?? 0,
    fat: s.fat ?? 0,
    sugar: s.sugar ?? 0,
    salt: s.salt ?? 0,
  };
});
const loadingSummary = ref(false);

const periods = [
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' }
];

// Panggil data profil lengkap saat halaman dimuat
onMounted(async () => {
  if (authStore.fetchUserProfile) {
    await authStore.fetchUserProfile();
  }
  // Ambil ringkasan untuk period default saat mount
  loadingSummary.value = true;
  try {
    await foodStore.fetchSummaryByPeriod(selectedPeriod.value);
  } catch (err) {
    console.error('Gagal memuat ringkasan saat mount:', err);
  } finally {
    loadingSummary.value = false;
  }
});

// Function untuk ganti period
async function changePeriod(period) {
  selectedPeriod.value = period;
  loadingSummary.value = true;
  try {
    await foodStore.fetchSummaryByPeriod(period);
  } catch (err) {
    console.error('Gagal mengganti periode ringkasan:', err);
  } finally {
    loadingSummary.value = false;
  }
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
    if(isNaN(value)) return { background: '#e2e8f0' };
    const percentage = Math.min((value / 40) * 100, 100);
    return { background: `conic-gradient(${bmi.value.color} ${percentage}%, #e2e8f0 ${percentage}%)` };
});
</script>

<style scoped>
.profile-page {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 20px;
  padding-top: 120px; /* Tambahan untuk navbar sticky (80px navbar + 40px spacing) */
  font-family: 'Segoe UI', sans-serif;
}
.profile-container { max-width: 1200px; margin: auto; }
.loading-state { text-align: center; padding: 4rem; font-size: 1.2rem; color: #64748b; }

.profile-banner-card { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border-radius: 20px; padding: 30px; display: flex; align-items: center; gap: 30px; margin-bottom: 30px; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3); }
.avatar { width: 100px; height: 100px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; flex-shrink: 0; text-transform: uppercase; }
.user-info { flex-grow: 1; }
.user-info h1 { margin: 0; font-size: 2.5rem; }
.user-info p { margin: 0; opacity: 0.8; }
.user-stats { display: flex; gap: 20px; background: rgba(0,0,0,0.1); padding: 15px 25px; border-radius: 12px; }
.stat-item { text-align: center; }
.stat-item strong { display: block; font-size: 1.5rem; }
.stat-item span { font-size: 0.8rem; opacity: 0.8; }

.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.info-card, .bmi-status-card, .nutrient-target-card { background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #1746a2; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }
h3 { margin: 0; font-size: 1.2rem; }

.bmi-gauge { display: flex; justify-content: center; margin: 20px 0; }
.gauge-circle { width: 180px; height: 180px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.gauge-inner-circle { width: 150px; height: 150px; border-radius: 50%; background: white; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.bmi-value { font-size: 3rem; font-weight: 700; color: #1e293b; }
.bmi-label { font-size: 1rem; color: #64748b; }
.bmi-status-text { text-align: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; }

/* BMI legend styles */
.bmi-legend { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
.bmi-legend-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 12px; border-radius: 8px; background: #f8fafc; }
.bmi-legend-item .legend-label { flex: 1; color: #334155; font-weight: 600; }
.bmi-legend-item .legend-range { color: #64748b; font-size: 0.95rem; min-width: 80px; text-align: right; }
.legend-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 10px; }
.legend-underweight { background: #3b82f6; }
.legend-normal { background: #22c55e; }
.legend-overweight { background: #f97316; }
.legend-obese { background: #ef4444; }

.data-display { display: flex; flex-direction: column; gap: 1rem; }
.data-item { display: flex; justify-content: space-between; padding: 1rem; background-color: #f8fafc; border-radius: 8px; }

.nutrient-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.nutrient-item { background: #f8fafc; padding: 15px; border-radius: 12px; }
.nutrient-item span { display: block; }
.nutrient-item strong { font-size: 1.5rem; }
.kalori strong { color: #2563eb; }
.karbo strong { color: #16a34a; }
.protein strong { color: #ea580c; }
.lemak strong { color: #d97706; }

.update-prompt { margin-top: 20px; background: #eef4ff; padding: 15px; border-radius: 12px; text-align: center; color: #1e3a8a; }
.update-prompt a { font-weight: 600; }

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

/* --- Tampilan baru Target Nutrisi Harian --- */
.nutrient-target-card {
  background: #fff;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  /* span the full width of the profile grid so it becomes the focus row */
  grid-column: 1 / -1;
}

.nutrient-grid-colored {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 10px;
}

/* --- Box Nutrisi --- */
.nutrient-box {
  border-radius: 12px;
  padding: 20px;
  background: #f8fafc;
  transition: 0.3s ease;
}
.nutrient-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.08);
}

/* Warna tiap box */
.kalori-box { background-color: #e0ebff; }
.karbo-box { background-color: #e6ffea; }
.protein-box { background-color: #fff3e0; }
.lemak-box { background-color: #fff8dc; }

/* Dot warna di samping label */
.nutrient-label {
  font-weight: 600;
  font-size: 1rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.dot-kalori { background-color: #2563eb; }
.dot-karbo { background-color: #16a34a; }
.dot-protein { background-color: #ea580c; }
.dot-lemak { background-color: #b45309; }
.dot-gula { background-color: #9333ea; }
.dot-garam { background-color: #0ea5a4; }

.nutrient-value {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 5px;
}
.kalori-box .nutrient-value { color: #2563eb; }
.karbo-box .nutrient-value { color: #16a34a; }
.protein-box .nutrient-value { color: #ea580c; }
.lemak-box .nutrient-value { color: #b45309; }

/* Styles for daily summary sugar & salt */
.gula { color: #d946ef; }
.garam { color: #0ea5a4; }

/* boxes for sugar and salt */
.gula-box { background-color: #f3e8ff; }
.garam-box { background-color: #ecfeff; }
.gula-box .nutrient-value { color: #9333ea; }
.garam-box .nutrient-value { color: #0ea5a4; }

.unit {
  font-size: 1rem;
  color: #64748b;
  margin-left: 3px;
}

/* --- Bagian petunjuk bawah --- */
.update-prompt-colored {
  margin-top: 20px;
  background: #eef4ff;
  padding: 15px;
  border-radius: 12px;
  border-left: 4px solid #2563eb;
  color: #1e3a8a;
  text-align: left;
}
.update-prompt-colored a {
  color: #1e3a8a;
  text-decoration: none;
  font-weight: 600;
}
.update-prompt-colored a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .nutrient-grid-colored {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 20px 15px;
    padding-top: 100px; /* Sesuaikan untuk mobile */
  }

  .profile-banner-card {
    flex-direction: column;
    text-align: center;
  }

  .user-info h1 {
    font-size: 1.8rem;
  }

  .user-stats {
    flex-wrap: wrap;
  }
}
</style>
