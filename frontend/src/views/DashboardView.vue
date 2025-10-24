<template>
  <div class="dashboard">
    <div class="header">
      <h1>Dashboard Nutrisi</h1>
      <p>Pantau konsumsi harian Anda</p>
    </div>

    <!-- Ringkasan -->
    <div class="summary-card">
      <h2>📈 Ringkasan Harian</h2>
      <div class="summary-grid">
        <div class="summary-item" v-for="(goal, label) in summaryData" :key="label">
          <div class="top">
            <span class="label">{{ goal.label }}</span>
            <span class="value">{{ goal.value }} / {{ goal.max }} {{ goal.unit }}</span>
          </div>
          <div class="bar-container">
            <div class="bar" :class="goal.class" :style="{ width: `${Math.min((goal.value / goal.max) * 100, 100)}%` }"></div>
          </div>
          <p class="sisa">Sisa: {{ Math.max(0, goal.max - goal.value) }} {{ goal.unit }}</p>
        </div>
      </div>
    </div>

    <!-- Jurnal Makanan -->
    <div class="journal-card">
      <h2>🍽️ Jurnal Makanan Harian</h2>

      <div v-if="foodStore.foods.length === 0" class="empty-state">
        <p>Anda belum mencatat makanan apa pun hari ini.</p>
      </div>

      <div v-else class="food-list">
        <div
          v-for="food in foodStore.foods"
          :key="food._id"
          class="food-item"
        >
          <!-- Header Nama & Jam -->
          <div class="food-header">
            <h3 class="food-name">{{ food.productName }}</h3>
            <span class="time">
              {{ new Date(food.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>

          <!-- Nutrisi & Tombol Hapus -->
          <div class="food-body">
            <div class="nutrients">
              <div class="nutrient-box kcal-box">
                <span class="kcal">{{ Math.round(food.calories) }}</span>
                <span class="label-small">kcal</span>
              </div>
              <div class="nutrient-box karbo-box">
                <span class="karbo">{{ Math.round(food.carbs) }}g</span>
                <span class="label-small">karbo</span>
              </div>
              <div class="nutrient-box protein-box">
                <span class="protein">{{ Math.round(food.protein) }}g</span>
                <span class="label-small">protein</span>
              </div>
              <div class="nutrient-box lemak-box">
                <span class="lemak">{{ Math.round(food.fat) }}g</span>
                <span class="label-small">lemak</span>
              </div>
              <div class="nutrient-box gula-box">
                <span class="gula">{{ Math.round(food.sugar || 0) }}g</span>
                <span class="label-small">gula</span>
              </div>
              <div class="nutrient-box garam-box">
                <span class="garam">{{ (food.salt || 0).toFixed(2) }}g</span>
                <span class="label-small">garam</span>
              </div>
            </div>

            <button
              @click="confirmDelete(food._id, food.productName)"
              class="delete-btn"
            >
              🗑️ Hapus
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
    max: authStore.user?.dailyCalorieGoal || 0,
    unit: 'kcal',
    class: 'kalori',
  },
  karbo: {
    label: 'Karbohidrat',
    value: Math.round(foodStore.totals.carbs),
    max: authStore.user?.dailyCarbsGoal || 0,
    unit: 'g',
    class: 'karbo',
  },
  protein: {
    label: 'Protein',
    value: Math.round(foodStore.totals.protein),
    max: authStore.user?.dailyProteinGoal || 0,
    unit: 'g',
    class: 'protein',
  },
  lemak: {
    label: 'Lemak',
    value: Math.round(foodStore.totals.fat),
    max: authStore.user?.dailyFatGoal || 0,
    unit: 'g',
    class: 'lemak',
  },
  gula: {
    label: 'Gula',
    value: Math.round(foodStore.totals.sugar || 0),
    max: 50,
    unit: 'g',
    class: 'gula',
  },
  garam: {
    label: 'Garam (Sodium)',
    value: parseFloat((foodStore.totals.salt || 0).toFixed(2)),
    max: 5,
    unit: 'g',
    class: 'garam',
  },
}))

const confirmDelete = (foodId, foodName) => {
  Swal.fire({
    title: `Yakin ingin menghapus ${foodName}?`,
    text: 'Tindakan ini tidak dapat dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      foodStore.deleteFood(foodId)
      Swal.fire(
        'Dihapus!',
        `${foodName} telah dihapus dari jurnal Anda.`,
        'success'
      )
    }
  })
}
</script>

<style scoped>
.dashboard {
  background-color: #e8f0fe;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 40px;
}
.header h1 {
  color: #1746a2;
  font-size: 2.2rem;
  margin-bottom: 5px;
}
.header p {
  color: #5e6b83;
}

/* Ringkasan */
.summary-card {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
}
.summary-card h2 {
  color: #1746a2;
  margin-bottom: 20px;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
.summary-item .top {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}
.bar-container {
  background-color: #dce4f5;
  border-radius: 20px;
  height: 12px;
  margin-top: 10px;
  overflow: hidden;
}
.bar {
  height: 12px;
  border-radius: 20px;
  transition: width 0.3s ease;
}
.bar.kalori {
  background-color: #2563eb;
}
.bar.karbo {
  background-color: #16a34a;
}
.bar.protein {
  background-color: #ea580c;
}
.bar.lemak {
  background-color: #d97706;
}
.bar.gula {
  background-color: #a855f7;
}
.bar.garam {
  background-color: #64748b;
}
.sisa {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #6b7280;
}

/* Jurnal */
.journal-card {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.journal-card h2 {
  color: #1746a2;
  margin-bottom: 25px;
}
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}
.food-item {
  background: #f8fbff;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s;
}
.food-item:hover {
  transform: translateY(-2px);
}
.food-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.food-header .food-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e3a8a;
}
.food-header .time {
  font-size: 0.9rem;
  color: #6b7280;
}
.food-body {
  display: flex;
  align-items: center;
  gap: 15px;
}
.nutrients {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  flex: 1;
  gap: 10px;
}
.nutrient-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 8px;
  text-align: center;
  font-weight: 700;
}
.label-small {
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 4px;
}
.kcal-box {
  background-color: #dbeafe;
}
.karbo-box {
  background-color: #dcfce7;
}
.protein-box {
  background-color: #ffedd5;
}
.lemak-box {
  background-color: #fef3c7;
}
.gula-box {
  background-color: #f3e8ff;
}
.garam-box {
  background-color: #f1f5f9;
}
.kcal {
  color: #2563eb;
  font-size: 1.1rem;
}
.karbo {
  color: #16a34a;
  font-size: 1.1rem;
}
.protein {
  color: #ea580c;
  font-size: 1.1rem;
}
.lemak {
  color: #d97706;
  font-size: 1.1rem;
}
.gula {
  color: #9333ea;
  font-size: 1.1rem;
}
.garam {
  color: #475569;
  font-size: 1.1rem;
}

/* Tombol hapus sejajar */
.delete-btn {
  background-color: #ef4444;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  padding: 14px 20px;
  font-size: 1rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
}
.delete-btn:hover {
  background-color: #dc2626;
  transform: scale(1.05);
}

@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
  .nutrients {
    grid-template-columns: repeat(3, 1fr);
  }
  .food-body {
    flex-direction: column;
  }
  .delete-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .nutrients {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
