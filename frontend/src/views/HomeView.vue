<template>
  <div class="home-container">
    <div class="scan-card">
      <div class="tabs-container">
        <button
          @click="changeTab('manual')"
          :class="['tab-button', { active: activeTab === 'manual' }]">
          <span class="icon">📝</span> Input Manual
        </button>
        <button
          @click="changeTab('camera')"
          :class="['tab-button', { active: activeTab === 'camera' }]">
          <span class="icon">📷</span> Scan Kamera
        </button>
        <button
          @click="changeTab('upload')"
          :class="['tab-button', { active: activeTab === 'upload' }]">
          <span class="icon">⬆️</span> Upload Foto
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'manual'">
          <form @submit.prevent="handleSearch" class="search-form">
            <label for="barcode">Input Barcode Makanan</label>
            <div class="input-group">
              <input type="text" id="barcode" v-model="barcodeInput" placeholder="Contoh: 1234567890..." required>
              <button type="submit" class="search-button">Cari</button>
            </div>
          </form>
        </div>

        <div v-if="activeTab === 'camera'" class="camera-content">
          <qrcode-stream @decode="onDecode" @init="onInit" class="camera-stream"></qrcode-stream>
          <div v-if="cameraError" class="camera-error">
            <p>{{ cameraError }}</p>
          </div>
          <p v-else class="scan-instruction">Arahkan kamera ke barcode makanan</p>
        </div>

        <div v-if="activeTab === 'upload'">
          <input
            type="file"
            @change="onFileChange"
            ref="fileInput"
            accept="image/*"
            style="display: none;"
          >

          <div class="placeholder-content upload-box" @click="triggerFileInput">
            <div class="placeholder-icon">⬆️</div>
            <h3>Upload Foto Barcode</h3>
            <p>Klik di sini untuk memilih foto barcode</p>
            <small>Format: JPG, PNG (Max 5MB)</small>
          </div>

          <p v-if="uploadError" class="upload-message">{{ uploadError }}</p>
        </div>
      </div>

      <div v-if="foodStore.searchedFood" class="results-section">
        <div v-if="foodStore.searchedFood.imageUrl" class="product-image-wrapper">
          <img :src="foodStore.searchedFood.imageUrl" :alt="foodStore.searchedFood.productName" class="product-image">
        </div>

        <h2>{{ foodStore.searchedFood.productName }}</h2>

        <div class="nutrients-grid">
          <div class="nutrient-card calories">
            <span class="value">{{ Math.round(foodStore.searchedFood.calories) }}</span>
            <span class="label">kcal</span>
            <span class="title">Kalori</span>
          </div>
          <div class="nutrient-card carbs">
            <span class="value">{{ Math.round(foodStore.searchedFood.carbs) }}</span>
            <span class="label">gram</span>
            <span class="title">Karbohidrat</span>
          </div>
          <div class="nutrient-card protein">
            <span class="value">{{ Math.round(foodStore.searchedFood.protein) }}</span>
            <span class="label">gram</span>
            <span class="title">Protein</span>
          </div>
          <div class="nutrient-card fat">
            <span class="value">{{ Math.round(foodStore.searchedFood.fat) }}</span>
            <span class="label">gram</span>
            <span class="title">Lemak</span>
          </div>
        </div>

        <div class="action-buttons">
          <button v-if="authStore.isAuthenticated" @click="handleSubmit" class="action-button primary">Tambah ke Jurnal</button>
          <router-link v-else to="/login" class="action-button primary">Login untuk Menyimpan Makanan</router-link>
          <button @click="foodStore.clearSearchedFood()" class="action-button secondary">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFoodStore } from '@/stores/food';
import { useAuthStore } from '@/stores/auth';
import { QrcodeStream } from 'vue-qrcode-reader';

const activeTab = ref('manual');
const barcodeInput = ref('');
const cameraError = ref('');
const uploadError = ref('');
const fileInput = ref(null);
const foodStore = useFoodStore();
const authStore = useAuthStore();

// --- Fungsi untuk Scan Kamera ---
const onInit = async (promise) => {
  try {
    await promise;
    cameraError.value = '';
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      cameraError.value = "Izin kamera diperlukan untuk menggunakan fitur ini.";
    } else if (error.name === 'NotFoundError') {
      cameraError.value = "Tidak ada kamera yang ditemukan di perangkat ini.";
    } else {
      cameraError.value = "Terjadi kesalahan saat mengakses kamera.";
    }
  }
};

const onDecode = (decodedString) => {
  if (decodedString) {
    barcodeInput.value = decodedString;
    foodStore.fetchFoodByBarcode(decodedString);
    activeTab.value = 'manual';
  }
};

// --- Fungsi untuk Upload Foto ---
const triggerFileInput = () => {
  uploadError.value = '';
  fileInput.value.click();
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Simulasi proses deteksi barcode dari gambar
  uploadError.value = "Memproses gambar...";
  setTimeout(() => {
    const fakeBarcode = "8992761134017"; // Ganti dengan barcode yang ada di database Anda untuk tes
    barcodeInput.value = fakeBarcode;
    foodStore.fetchFoodByBarcode(fakeBarcode);
    activeTab.value = 'manual'; // Pindah ke tab manual untuk menampilkan hasil
    uploadError.value = ''; // Hapus pesan setelah selesai
  }, 1500); // Waktu tunda 1.5 detik untuk simulasi

  // Reset input file agar bisa upload gambar yang sama lagi
  event.target.value = '';
};

// --- Fungsi Utama ---
const changeTab = (tabName) => {
  activeTab.value = tabName;
  foodStore.clearSearchedFood();
  barcodeInput.value = '';
};

const handleSearch = async () => {
  if (!barcodeInput.value) return;
  await foodStore.fetchFoodByBarcode(barcodeInput.value);
};

const handleSubmit = async () => {
  if (!foodStore.searchedFood) return;
  const foodData = { ...foodStore.searchedFood };

  for (const key of ['calories', 'protein', 'carbs', 'fat']) {
    if (typeof foodData[key] === 'string' && foodData[key].trim() !== '') {
      foodData[key] = parseFloat(foodData[key].replace(',', '.'));
    } else if (foodData[key] === null || foodData[key] === undefined) {
      foodData[key] = 0;
    }
  }

  await foodStore.addFood(foodData);
  barcodeInput.value = '';
  foodStore.clearSearchedFood();
};
</script>

<style scoped>

.home-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 80px);
  background-color: #eef4ff;
  padding: 3rem 1rem;
}

.scan-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  border: 1px solid #e2e8f0;
}

/* TABS */
.tabs-container {
  display: flex;
  gap: 0.5rem;
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 0.5rem;
  margin-bottom: 2rem;
}
.tab-button {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
}
.tab-button.active {
  background-color: white;
  color: #2563eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.icon { font-style: normal; }

/* FORM */
.search-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.input-group {
  display: flex;
  gap: 0.5rem;
}
.input-group input {
  flex: 1;
  padding: 0.9rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
}
.search-button {
  padding: 0.9rem 1.5rem;
  border: none;
  background-color: #2563eb;
  color: white;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

/* PLACEHOLDER & CAMERA */
.placeholder-content {
  text-align: center;
  padding: 2rem;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
}
.placeholder-icon { font-size: 3rem; margin-bottom: 1rem; }
.placeholder-content h3 { margin-bottom: 0.5rem; }
.placeholder-content p { color: #64748b; margin-bottom: 1.5rem; }
.upload-box { cursor: pointer; }
.upload-message {
  margin-top: 1rem;
  color: #475569;
  font-weight: 500;
  text-align: center;
}
.camera-content {
  position: relative;
  text-align: center;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.camera-stream {
  max-width: 100%;
  display: block;
}
.scan-instruction {
  margin-top: 1rem;
  font-weight: 500;
  color: #475569;
  padding-bottom: 1rem;
}
.camera-error {
  padding: 2rem;
  background-color: #fef2f2;
  color: #b91c1c;
  border-radius: 12px;
}

/* RESULTS */
.results-section {
  margin-top: 2rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 2rem;
  text-align: center;
}
.product-image-wrapper { margin-bottom: 1rem; }
.product-image { max-width: 100%; height: 200px; object-fit: contain; border-radius: 12px; }
.results-section h2 { font-size: 1.75rem; margin-bottom: 1.5rem; }

.nutrients-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}
.nutrient-card {
  padding: 1.5rem;
  border-radius: 12px;
  color: #1e293b;
  text-align: center;
}
.nutrient-card .value { font-size: 2rem; font-weight: 700; display: block; }
.nutrient-card .label { color: #64748b; }
.nutrient-card .title { font-weight: 600; display: block; margin-top: 0.25rem; }
.calories { background-color: #eff6ff; }
.carbs { background-color: #f0fdf4; }
.protein { background-color: #fffbeb; }
.fat { background-color: #fef2f2; }

/* ACTION BUTTONS */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
.action-button {
  flex: 1;
  padding: 0.9rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  border: 1px solid transparent;
}
.action-button.primary {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}
.action-button.secondary {
  background-color: transparent;
  color: #475569;
  border-color: #cbd5e1;
}
</style>
