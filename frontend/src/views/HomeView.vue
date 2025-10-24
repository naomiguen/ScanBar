
<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg-decoration">
        <div class="decoration-circle decoration-1"></div>
        <div class="decoration-circle decoration-2"></div>
        <div class="decoration-circle decoration-3"></div>
      </div>

      <div class="container">
        <div class="hero-grid">
          <!-- Left Content -->
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-icon">📦</span>
              <span class="badge-text">Scan Barcode Kemasan Produk</span>
            </div>

            <h1 class="hero-title">
              Selamat datang di <span class="brand-name">ScanBar</span>
            </h1>

            <p class="hero-description">
              Scan barcode pada kemasan makanan & minuman untuk mendapatkan informasi nutrisi lengkap.
              Pantau asupan harian dengan mudah dan capai target kesehatan Anda.
            </p>

            <div class="hero-buttons">
              <button @click="scrollToScanner" class="btn-primary">
                <span class="icon">📷</span> Mulai Pindai Sekarang
              </button>
              <router-link to="/register" class="btn-secondary">
                Daftar Gratis
              </router-link>
            </div>

            <!-- Stats -->
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">1000+</div>
                <div class="stat-label">Produk Makanan</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">500+</div>
                <div class="stat-label">Pengguna Aktif</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">99%</div>
                <div class="stat-label">Akurasi Scan</div>
              </div>
            </div>
          </div>

          <!-- Right Image -->
          <div class="hero-image">
            <div class="image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop"
                alt="Barcode scanning"
                class="product-image"
              />
              <div class="floating-badge">
                <div class="badge-icon-circle">
                  <span>📷</span>
                </div>
                <div class="badge-content">
                  <div class="badge-title">Scan Cepat</div>
                  <div class="badge-subtitle">Info nutrisi instan</div>
                </div>
              </div>
            </div>
            <div class="image-decoration"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="section-bg-gradient"></div>

      <div class="container">
        <div class="section-header">
          <div class="section-badge">Cara Kerja</div>
          <h2 class="section-title">Tiga Langkah Mudah</h2>
          <p class="section-subtitle">
            Mulai tracking nutrisi harian Anda dengan proses yang simpel dan cepat
          </p>
        </div>

        <div class="steps-grid">
          <div class="step-card step-1">
            <div class="step-decoration"></div>
            <div class="step-content">
              <div class="step-number">1</div>
              <h3 class="step-title">Scan Barcode</h3>
              <p class="step-description">
                Arahkan kamera ke barcode produk makanan atau masukkan kode secara manual
              </p>
            </div>
          </div>

          <div class="step-card step-2">
            <div class="step-decoration"></div>
            <div class="step-content">
              <div class="step-number">2</div>
              <h3 class="step-title">Lihat Info Nutrisi</h3>
              <p class="step-description">
                Dapatkan informasi lengkap kalori, protein, karbohidrat, dan lemak secara instan
              </p>
            </div>
          </div>

          <div class="step-card step-3">
            <div class="step-decoration"></div>
            <div class="step-content">
              <div class="step-number">3</div>
              <h3 class="step-title">Pantau Konsumsi</h3>
              <p class="step-description">
                Simpan data makanan dan pantau asupan nutrisi harian Anda di dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scanner Section -->
    <section class="scanner-section" ref="scannerSection">
      <div class="scanner-bg-decoration">
        <div class="decoration-blob blob-1"></div>
        <div class="decoration-blob blob-2"></div>
      </div>

      <div class="container">
        <div class="section-header">
          <div class="scanner-badge">
            <span>📱</span>
            <span>Mudah & Cepat</span>
          </div>
          <h2 class="section-title">Scan Barcode Kemasan Produk</h2>
          <p class="section-subtitle">
            Pilih metode scan favorit untuk mendapatkan informasi nutrisi dari kemasan makanan & minuman
          </p>
        </div>

        <div class="scan-card">
          <!-- Tabs -->
          <div class="tabs-container">
            <button @click="changeTab('manual')" :class="['tab-button', { active: activeTab === 'manual' }]"><span class="tab-icon">📝</span><span class="tab-text">Manual</span></button>
            <button @click="changeTab('camera')" :class="['tab-button', { active: activeTab === 'camera' }]"><span class="tab-icon">📷</span><span class="tab-text">Kamera</span></button>
            <button @click="changeTab('upload')" :class="['tab-button', { active: activeTab === 'upload' }]"><span class="tab-icon">⬆️</span><span class="tab-text">Upload</span></button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Manual Tab -->
            <div v-if="activeTab === 'manual'" class="tab-panel">
              <div v-if="!isScanning">
                <form @submit.prevent="handleSearch" class="search-form">
                  <label for="barcode" class="form-label">Input Kode Barcode dari Kemasan</label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      id="barcode"
                      v-model="barcodeInput"
                      placeholder="Contoh: 8992761111113"
                      class="form-input"
                      required
                    />
                    <button type="submit" class="submit-button">
                      <span class="icon">🔍</span> Cari Produk
                    </button>
                  </div>
                  <div v-if="cameraError" class="error-message">
                    <p>{{ cameraError }}</p>
                  </div>
                  <button @click.prevent="startCamera" type="button" class="activate-button">
                    <span class="icon">📷</span> Aktifkan Kamera
                  </button>
                </form>
              </div>

              <div v-else class="camera-active">
                <qrcode-stream @decode="onDecode" @init="onInit" class="camera-stream"></qrcode-stream>
                <div v-if="cameraError" class="camera-error">
                  <p>{{ cameraError }}</p>
                </div>
                <div class="camera-controls">
                  <button @click="stopCamera" class="camera-stop-button">
                    <span class="icon">❌</span> Tutup Kamera
                  </button>
                </div>
                <p class="camera-instruction">
                  📍 Posisikan barcode di dalam frame untuk hasil terbaik
                </p>
              </div>
            </div>

            <!-- Upload Tab -->
            <div v-if="activeTab === 'upload'" class="tab-panel">
              <label class="form-label">Upload Foto Barcode Kemasan</label>

              <input
                type="file"
                @change="onFileChange"
                ref="fileInput"
                accept="image/*"
                style="display: none;"
              />

              <div v-if="!uploadedImage" class="upload-placeholder" @click="triggerFileInput">
                <div class="upload-icon-wrapper">
                  <span class="upload-icon">⬆️</span>
                </div>
                <h3 class="placeholder-title">Upload Foto Barcode</h3>
                <p class="placeholder-description">
                  Pilih foto barcode yang sudah Anda ambil dari kemasan produk
                </p>
                <p class="placeholder-note">
                  📄 Format: JPG, PNG (Max 5MB)
                </p>
              </div>

              <div v-else class="uploaded-preview">
                <img :src="uploadedImage" alt="Uploaded barcode" class="preview-image" />
                <button @click="clearUpload" class="change-button">
                  <span class="icon">⬆️</span> Upload Foto Lain
                </button>
              </div>

              <p v-if="uploadError" class="upload-message">{{ uploadError }}</p>
            </div>
          </div>

          <!-- Results -->
          <div v-if="foodStore.searchedFood" class="results-section">
            <div v-if="foodStore.searchedFood.imageUrl" class="result-image-wrapper">
              <img
                :src="foodStore.searchedFood.imageUrl"
                :alt="foodStore.searchedFood.productName"
                class="result-image"
              />
            </div>

            <h2 class="result-title">{{ foodStore.searchedFood.productName }}</h2>
            <p class="result-subtitle">Informasi Nilai Gizi per Sajian</p>

            <div class="nutrients-grid">
              <div class="nutrient-card calories">
                <p class="nutrient-label">Kalori</p>
                <p class="nutrient-value">{{ Math.round(foodStore.searchedFood.calories) }}</p>
                <p class="nutrient-unit">kcal</p>
              </div>
              <div class="nutrient-card carbs">
                <p class="nutrient-label">Karbohidrat</p>
                <p class="nutrient-value">{{ Math.round(foodStore.searchedFood.carbs) }}</p>
                <p class="nutrient-unit">gram</p>
              </div>
              <div class="nutrient-card protein">
                <p class="nutrient-label">Protein</p>
                <p class="nutrient-value">{{ Math.round(foodStore.searchedFood.protein) }}</p>
                <p class="nutrient-unit">gram</p>
              </div>
              <div class="nutrient-card fat">
                <p class="nutrient-label">Lemak</p>
                <p class="nutrient-value">{{ Math.round(foodStore.searchedFood.fat) }}</p>
                <p class="nutrient-unit">gram</p>
              </div>
            </div>

            <div class="action-buttons">
              <button v-if="authStore.isAuthenticated" @click="handleSubmit" class="action-button primary">
                Tambah ke Jurnal
              </button>
              <router-link v-else to="/login" class="action-button primary">
                Login untuk Menyimpan Makanan
              </router-link>
              <button @click="handleCancel" class="action-button secondary">
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tips Section -->
    <section class="tips-section">
      <div class="tips-bg-decoration">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
      </div>

      <div class="container">
        <div class="section-header">
          <div class="section-badge tips-badge">💡 Edukasi Gizi</div>
          <h2 class="section-title">Tips & Fakta Gizi</h2>
          <p class="section-subtitle">
            Pelajari cara membaca label nutrisi dengan benar untuk pilihan makanan yang lebih sehat
          </p>
        </div>

        <div class="tips-grid">
          <div class="tip-card tip-blue">
            <div class="tip-decoration"></div>
            <div class="tip-content">
              <div class="tip-icon">🍎</div>
              <h3 class="tip-title">Protein: Fondasi Kesehatan</h3>
              <p class="tip-description">
                Perhatikan kandungan protein dalam label makanan kemasan. Pilih produk dengan protein minimal 5g per 100g untuk nutrisi optimal. Konsumsi harian yang disarankan: 0.8-1g protein per kg berat badan.
              </p>
            </div>
          </div>

          <div class="tip-card tip-pink">
            <div class="tip-decoration"></div>
            <div class="tip-content">
              <div class="tip-icon">💖</div>
              <h3 class="tip-title">Lemak yang Sehat</h3>
              <p class="tip-description">
                Periksa jenis lemak pada kemasan: total lemak, lemak jenuh, dan lemak trans. Pilih produk dengan lemak jenuh kurang dari 10% per sajian dan hindari produk dengan kandungan lemak trans.
              </p>
            </div>
          </div>

          <div class="tip-card tip-green">
            <div class="tip-decoration"></div>
            <div class="tip-content">
              <div class="tip-icon">🌿</div>
              <h3 class="tip-title">Karbohidrat Cerdas</h3>
              <p class="tip-description">
                Cek total karbohidrat dan serat pada label informasi nilai gizi. Perhatikan rasio karbohidrat dengan serat untuk pilihan lebih sehat. Pilih produk dengan "whole grain" sebagai bahan utama.
              </p>
            </div>
          </div>

          <div class="tip-card tip-purple">
            <div class="tip-decoration"></div>
            <div class="tip-content">
              <div class="tip-icon">🎯</div>
              <h3 class="tip-title">Pentingnya Serat</h3>
              <p class="tip-description">
                Perhatikan kandungan "Dietary Fiber" pada label. Pilih produk minimal 3g serat per sajian untuk camilan sehat. Target harian: 25-35g serat per hari.
              </p>
            </div>
          </div>

          <div class="tip-card tip-orange">
            <div class="tip-decoration"></div>
            <div class="tip-content">
              <div class="tip-icon">⚡</div>
              <h3 class="tip-title">Bijak dengan Gula</h3>
              <p class="tip-description">
                Cek daftar gula pada ingredient list. Waspadai nama lain gula: syrup, dextrose, sucrose. Batasan gula tambahan: maksimal 25g (6 sendok teh) per hari.
              </p>
            </div>
          </div>

          <div class="tip-card tip-indigo">
            <div class="tip-decoration"></div>
            <div class="tip-content">
              <div class="tip-icon">🛡️</div>
              <h3 class="tip-title">Kendali Asupan Garam</h3>
              <p class="tip-description">
                Perhatikan kandungan "Sodium" atau "Garam" pada label. Pilih produk dengan sodium kurang dari 20% Daily Value per sajian. Batasan harian: maksimal 2000mg sodium.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-bg-decoration">
        <div class="cta-circle cta-circle-1"></div>
        <div class="cta-circle cta-circle-2"></div>
      </div>

      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Mulai Perjalanan Sehat Anda Hari Ini</h2>
          <p class="cta-description">
            Bergabunglah dengan ribuan pengguna yang telah meningkatkan kesehatan mereka dengan ScanBar
          </p>
          <div class="cta-buttons">
            <router-link to="/register" class="cta-button primary">
              Daftar Gratis Sekarang
            </router-link>
            <router-link to="/login" class="cta-button secondary">
              Sudah Punya Akun?
            </router-link>
          </div>
        </div>
      </div>
    </section>
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
const uploadedImage = ref(null);
const isScanning = ref(false);
const fileInput = ref(null);
const scannerSection = ref(null);
const foodStore = useFoodStore();
const authStore = useAuthStore();

// Scroll to scanner
const scrollToScanner = () => {
  scannerSection.value?.scrollIntoView({ behavior: 'smooth' });
};

// Camera functions
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
    stopCamera();
    activeTab.value = 'manual';
  }
};

const startCamera = () => {
  isScanning.value = true;
};

const stopCamera = () => {
  isScanning.value = false;
};

// Upload functions
const triggerFileInput = () => {
  uploadError.value = '';
  fileInput.value.click();
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = e.target.result;

    uploadError.value = "Memproses gambar...";
    setTimeout(() => {
      const fakeBarcode = "8992761134017";
      barcodeInput.value = fakeBarcode;
      foodStore.fetchFoodByBarcode(fakeBarcode);
      uploadError.value = '';
    }, 1500);
  };
  reader.readAsDataURL(file);

  event.target.value = '';
};

const clearUpload = () => {
  uploadedImage.value = null;
  barcodeInput.value = '';
  foodStore.clearSearchedFood();
};

// Main functions
const changeTab = (tabName) => {
  activeTab.value = tabName;
  foodStore.clearSearchedFood();
  barcodeInput.value = '';
  uploadedImage.value = null;
  stopCamera();
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

  // Pass the currently active summary period (from store) so the store refreshes the correct period
  await foodStore.addFood(foodData, foodStore.summaryPeriod || 'daily');
  handleCancel();
};

const handleCancel = () => {
  barcodeInput.value = '';
  foodStore.clearSearchedFood();
  uploadedImage.value = null;
  stopCamera();
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-container {
  min-height: 100vh;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* HERO SECTION */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%);
  overflow: hidden;
  padding: 6rem 0;
}

.hero-bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(60px);
}

.decoration-1 {
  width: 500px;
  height: 500px;
  background: #3b82f6;
  top: -200px;
  right: -200px;
}

.decoration-2 {
  width: 600px;
  height: 600px;
  background: #8b5cf6;
  top: 40%;
  left: -250px;
}

.decoration-3 {
  width: 400px;
  height: 400px;
  background: #6366f1;
  bottom: 10%;
  right: 10%;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #2563eb;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid #bfdbfe;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1);
  align-self: flex-start;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.badge-icon {
  font-size: 1.125rem;
}

.badge-text {
  font-weight: 600;
  font-size: 0.875rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
}

.brand-name {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.hero-description {
  font-size: 1.125rem;
  color: #64748b;
  line-height: 1.8;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(37, 99, 235, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  color: #334155;
  border-color: #cbd5e1;
}

.btn-secondary:hover {
  background: white;
  border-color: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-item {
  text-align: left;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

/* Hero Image */
.hero-image {
  position: relative;
  display: none;
}

@media (min-width: 1024px) {
  .hero-image {
    display: block;
  }
}

.image-wrapper {
  position: relative;
  z-index: 10;
}

.product-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.floating-badge {
  position: absolute;
  bottom: -1.5rem;
  right: -1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge-icon-circle {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.badge-content {
  display: flex;
  flex-direction: column;
}

.badge-title {
  font-weight: 700;
  color: #1e293b;
}

.badge-subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

.image-decoration {
  position: absolute;
  top: 2rem;
  left: -2rem;
  width: 8rem;
  height: 8rem;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  border-radius: 1.5rem;
  opacity: 0.2;
  filter: blur(40px);
}

/* HOW IT WORKS SECTION */
.how-it-works-section {
  position: relative;
  padding: 5rem 0;
  background: white;
}

.section-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, #eff6ff 0%, white 50%, white 100%);
  opacity: 0.5;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
}

.section-badge {
  display: inline-block;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
  margin-bottom: 1rem;
}

.tips-badge {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.step-card {
  background: white;
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 6px 26px rgba(16,24,40,0.06);
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.step-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.step-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  margin-right: -4rem;
  margin-top: -4rem;
  opacity: 0.1;
  transition: all 0.5s ease;
}

.step-card:hover .step-decoration {
  transform: scale(1.5);
}

.step-1 .step-decoration {
  background: #3b82f6;
}

.step-2 .step-decoration {
  background: #6366f1;
}

.step-3 .step-decoration {
  background: #8b5cf6;
}

.step-content {
  position: relative;
  z-index: 1;
}

.step-number {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.step-1 .step-number {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.step-2 .step-number {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.step-3 .step-number {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.step-description {
  color: #64748b;
  line-height: 1.7;
  font-size: 0.9375rem;
}

/* SCANNER SECTION */
.scanner-section {
  position: relative;
  padding: 6rem 0;
  background: white;
}

.scanner-bg-decoration {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.decoration-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.2;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: #bfdbfe;
  top: 5rem;
  left: 2.5rem;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: #ddd6fe;
  bottom: 5rem;
  right: 2.5rem;
}

.scanner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.scan-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(16,24,40,0.06);
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid #f1f5f9;
  position: relative;
  z-index: 1;
}

@media (max-width: 640px) {
  .hero-grid { grid-template-columns: 1fr; }
  .hero-section { padding: 3rem 0; }
  .product-image { height: 320px; }
  .scan-card { padding: 1rem; }
}

/* TABS */
.tabs-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
}

.tab-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 0.75rem;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #f8fafc;
}

.tab-button.active {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.tab-icon {
  font-size: 1.5rem;
}

.tab-text {
  font-size: 0.875rem;
}

/* TAB CONTENT */
.tab-content {
  min-height: 300px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* FORM STYLES */
.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.submit-button {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.error-message {
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  color: #b91c1c;
  font-size: 0.875rem;
}

.info-box {
  padding: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.75rem;
  color: #1e40af;
  font-size: 0.875rem;
}

.info-icon {
  margin-right: 0.5rem;
}

/* CAMERA STYLES */
.camera-placeholder,
.upload-placeholder {
  background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
  border: 2px dashed #93c5fd;
  border-radius: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.camera-placeholder:hover,
.upload-placeholder:hover {
  border-color: #2563eb;
  background: linear-gradient(135deg, #dbeafe 0%, #ddd6fe 100%);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
}

.camera-icon-wrapper,
.upload-icon-wrapper {
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.camera-icon,
.upload-icon {
  font-size: 2.5rem;
}

.placeholder-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.placeholder-description {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 1rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.placeholder-note {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.activate-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
}

.activate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

/* CAMERA ACTIVE */
.camera-active {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.camera-stream {
  width: 100%;
  height: 400px;
  border-radius: 1rem;
  overflow: hidden;
  background: black;
}

.camera-error {
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 1rem;
  color: #b91c1c;
  text-align: center;
}

.camera-controls {
  display: flex;
  gap: 0.75rem;
}

.camera-stop-button {
  width: 100%;
  padding: 1rem;
  background: white;
  color: #475569;
  border: 2px solid #cbd5e1;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.camera-stop-button:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.camera-instruction {
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
}

/* UPLOAD STYLES */
.uploaded-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 1rem;
  background: #f1f5f9;
}

.change-button {
  width: 100%;
  padding: 1rem;
  background: white;
  color: #475569;
  border: 2px solid #cbd5e1;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.change-button:hover {
  background: #f8fafc;
  border-color: #2563eb;
  color: #2563eb;
}

.upload-message {
  text-align: center;
  color: #2563eb;
  font-weight: 600;
  margin-top: 1rem;
}

/* Tips / Tip cards styling (improved visuals like screenshot) */
.tips-grid {
  display: grid;
  /* Desktop: 3 columns max; smaller screens adapt */
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  align-items: stretch;
}

@media (max-width: 1024px) {
  .tips-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .tips-grid {
    grid-template-columns: 1fr;
  }
}

.tip-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.25rem;
  position: relative;
  overflow: visible;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.03);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  min-height: 190px;
}

.tip-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(16, 24, 40, 0.12);
}

.tip-decoration {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.12) 100%);
  filter: blur(6px);
  pointer-events: none;
}

.tip-content {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

/* Allow flex items containing text to shrink properly and wrap */
.tip-content > :not(.tip-icon) {
  min-width: 0;
}

.tip-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 8px 20px rgba(59,130,246,0.08);
  color: #1e293b;
  flex-shrink: 0;
}

.tip-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.tip-description {
  color: #475569;
  line-height: 1.65;
  font-size: 0.95rem;
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* Clamp description to ~3 lines and show ellipsis */
.tip-description {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
