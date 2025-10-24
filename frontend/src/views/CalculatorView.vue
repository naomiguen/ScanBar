<template>
  <div class="dashboard">
    <div class="container">
      <h1>Kalkulator Kebutuhan Kalori</h1>
      <p>Hitung dan simpan target kalori harian Anda</p>

      <div class="grid">
        <!-- Form Input -->
        <div class="card">
          <h2><i class="fa-solid fa-user"></i> Data Diri</h2>
          <form @submit.prevent="calculateTDEE">
            <div class="form-group">
              <label>Jenis Kelamin</label>
              <select v-model="form.gender" required>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>
            <div class="form-group">
              <label>Usia</label>
              <input type="number" v-model.number="form.age" placeholder="Masukkan usia (tahun)" required />
            </div>
            <div class="form-group">
              <label>Berat Badan</label>
              <input type="number" v-model.number="form.weight" placeholder="Masukkan berat badan (kg)" required />
            </div>
            <div class="form-group">
              <label>Tinggi Badan</label>
              <input type="number" v-model.number="form.height" placeholder="Masukkan tinggi badan (cm)" required />
            </div>
            <div class="form-group">
              <label>Tingkat Aktivitas</label>
              <select v-model.number="form.activityLevel" required>
                <option value="1.2">Tidak Aktif (tidak berolahraga)</option>
                <option value="1.375">Ringan (1–3x/minggu)</option>
                <option value="1.55">Sedang (3–5x/minggu)</option>
                <option value="1.725">Berat (6–7x/minggu)</option>
                <option value="1.9">Sangat Berat (atlet)</option>
              </select>
            </div>
            <button type="submit">
              <i class="fa-solid fa-calculator"></i> Hitung Kebutuhan Kalori
            </button>
          </form>
        </div>

        <!-- Hasil Perhitungan -->
        <div class="card result">
          <h2><i class="fa-solid fa-bullseye"></i> Hasil Perhitungan</h2>
          <div v-if="results" class="hasil">
            <div class="tdee-card">
              <p class="label">Kebutuhan Kalori Harian Anda</p>
              <h1 class="value">{{ results.tdee }}</h1>
              <p class="sub">kalori per hari</p>
            </div>

            <div class="makro">
              <h3>Rekomendasi Makronutrien</h3>
              <div class="makro-item karbo"><span>Karbohidrat</span><span>{{ results.carbs }} g</span></div>
              <div class="makro-item protein"><span>Protein</span><span>{{ results.protein }} g</span></div>
              <div class="makro-item lemak"><span>Lemak</span><span>{{ results.fat }} g</span></div>
              <div class="makro-item gula"><span>Gula</span><span>{{ results.sugar }} g</span></div>
              <div class="makro-item garam"><span>Garam</span><span>{{ results.salt }} g</span></div>
            </div>

            <button v-if="authStore.isAuthenticated" @click="saveGoals" class="save-button">
              <i class="fa-solid fa-floppy-disk"></i> Simpan Target & Perbarui Profil
            </button>
            <p v-else class="login-prompt">
              <router-link to="/login">Login</router-link> untuk menyimpan target Anda.
            </p>
          </div>

          <div v-else class="kosong">
            <i class="fa-solid fa-calculator"></i>
            <p>Lengkapi form untuk melihat hasil perhitungan</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

const authStore = useAuthStore();

const form = ref({
  gender: 'male',
  age: null,
  weight: null,
  height: null,
  activityLevel: 1.2,
});

const results = ref(null);

const calculateTDEE = () => {
  if (!form.value.age || !form.value.weight || !form.value.height) {
    Swal.fire({ icon: 'error', title: 'Oops...', text: 'Mohon lengkapi semua data dengan benar!' });
    return;
  }

  const bmr =
    form.value.gender === 'male'
      ? 10 * form.value.weight + 6.25 * form.value.height - 5 * form.value.age + 5
      : 10 * form.value.weight + 6.25 * form.value.height - 5 * form.value.age - 161;

  const tdee = Math.round(bmr * form.value.activityLevel);

  results.value = {
    tdee,
    protein: Math.round((tdee * 0.3) / 4),
    carbs: Math.round((tdee * 0.4) / 4),
    fat: Math.round((tdee * 0.3) / 9),
    sugar: 50, // rekomendasi WHO < 50g
    salt: 5, // rekomendasi WHO < 5g
  };
};

const saveGoals = () => {
  if (!results.value) return;

  const dataToSave = {
    age: form.value.age,
    weight: form.value.weight,
    height: form.value.height,
    dailyCalorieGoal: results.value.tdee,
    dailyProteinGoal: results.value.protein,
    dailyCarbsGoal: results.value.carbs,
    dailyFatGoal: results.value.fat,
    dailySugarGoal: results.value.sugar,
    dailySaltGoal: results.value.salt,
  };

  authStore.updateProfile(dataToSave);
};
</script>

<style scoped>
.dashboard {
  background: linear-gradient(to bottom, #eef4ff, #ffffff);
  min-height: 100vh;
  padding: 40px 20px;
  font-family: "Poppins", sans-serif;
}

.container {
  max-width: 1100px;
  margin: auto;
}

h1 {
  font-size: 2rem;
  color: #1746a2;
  text-align: center;
  margin-bottom: 5px;
}

p {
  text-align: center;
  color: #5e6b83;
  margin-bottom: 30px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 30px;
}

.card {
  background: #ffffff;
  padding: 25px 30px;
  border-radius: 18px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #dbeafe;
}

h2 {
  color: #1746a2;
  margin-bottom: 20px;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  width: 100%;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1rem;
  cursor: pointer;
}

.result {
  text-align: center;
}

.tdee-card {
  background: linear-gradient(to bottom right, #2a64f6, #3a8bff);
  color: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  margin: 20px 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tdee-card .label,
.tdee-card .sub {
  font-weight: 600;
  color: white;
}

.tdee-card .value {
  font-size: 3rem;
  font-weight: 700;
  margin: 10px 0;
  color: white;
}

.makro h3 {
  text-align: left;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.makro-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: 8px;
  font-weight: 600;
}

.karbo {
  background: #dcfce7;
  color: #166534;
}

.protein {
  background: #ffedd5;
  color: #9a3412;
}

.lemak {
  background: #fef3c7;
  color: #92400e;
}

.gula {
  background: #f3e8ff;
  color: #9333ea;
}

.garam {
  background: #f1f5f9;
  color: #475569;
}

.save-button {
  margin-top: 25px;
  background-color: #16a34a;
  color: #fff;
  font-weight: 600;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;
}

.kosong {
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 10px;
}

.kosong i {
  font-size: 2.5rem;
  color: #cbd5e1;
}

.login-prompt {
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
}

.login-prompt a {
  color: #2563eb;
  font-weight: 600;
}
</style>
