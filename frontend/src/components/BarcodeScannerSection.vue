<template>
  <section ref="scannerSection" class="relative py-24 bg-white">
    <div class="absolute inset-0 z-0">
      <div class="absolute w-[400px] h-[400px] bg-blue-200 rounded-full blur-[60px] opacity-20 top-20 left-10"></div>
      <div class="absolute w-[400px] h-[400px] bg-purple-200 rounded-full blur-[60px] opacity-20 bottom-20 right-10"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-blue-500/30 mb-6 text-base">
          <span>Scan Barcode Kemasan</span>
        </div>

        <h2 class="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
          Scan Barcode Produk Kemasan
        </h2>

        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Pilih metode scan favorit untuk mendapatkan informasi nutrisi dari kemasan makanan & minuman
        </p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-xl max-w-4xl w-full mx-auto border border-slate-100">
        <!-- Tabs -->
        <div class="grid grid-cols-3 gap-2 bg-white border border-slate-200 rounded-2xl p-2 mb-8">
          <button
            @click="changeTab('manual')"
            :class="[
              'flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300',
              activeTab === 'manual'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/40'
                : 'bg-transparent text-slate-600 hover:bg-slate-50'
            ]"
          >
            <span class="text-2xl">📝</span>
            <span class="text-sm">Manual</span>
          </button>

          <button
            @click="changeTab('camera')"
            :class="[
              'flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300',
              activeTab === 'camera'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/40'
                : 'bg-transparent text-slate-600 hover:bg-slate-50'
            ]"
          >
            <span class="text-2xl">📷</span>
            <span class="text-sm">Kamera</span>
          </button>

          <button
            @click="changeTab('upload')"
            :class="[
              'flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300',
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/40'
                : 'bg-transparent text-slate-600 hover:bg-slate-50'
            ]"
          >
            <span class="text-2xl">⬆️</span>
            <span class="text-sm">Upload</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[300px]">
          <!-- Manual Tab -->
          <div v-if="activeTab === 'manual'" class="animate-fade-in">
            <div v-if="!isScanning">
              <div class="flex flex-col gap-6">
                <label class="block font-semibold text-base text-slate-800">
                  Input Kode Barcode dari Kemasan
                </label>

                <div class="flex flex-col gap-3">
                  <input
                    v-model="barcodeInput"
                    type="text"
                    placeholder="Contoh: 8992761111113"
                    :disabled="searchLoading"
                    class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    @keyup.enter="handleSearch"
                  />

                  <p v-if="cameraError" class="text-sm text-red-600">
                    {{ cameraError }}
                  </p>
                </div>

                <button
                  @click="handleSearch"
                  :disabled="searchLoading || !barcodeInput"
                  class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="!searchLoading"></span>
                  <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{{ searchLoading ? 'Mencari...' : 'Cari Produk' }}</span>
                </button>
              </div>
            </div>

            <div v-else class="flex flex-col gap-4">
              <qrcode-stream @decode="onDecode" @init="onInit" class="w-full h-[400px] rounded-xl overflow-hidden bg-black"></qrcode-stream>

              <p v-if="cameraError" class="p-8 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
                {{ cameraError }}
              </p>

              <button
                @click="stopCamera"
                class="w-full px-4 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>❌</span> Tutup Kamera
              </button>

              <p class="text-center text-sm text-slate-600">
                Posisikan barcode di dalam frame untuk hasil terbaik
              </p>
            </div>
          </div>

          <!-- Camera Tab -->
          <div v-if="activeTab === 'camera'" class="animate-fade-in">
            <!-- Hidden File Input for Mobile Camera -->
            <input
              ref="cameraInput"
              type="file"
              accept="image/*"
              capture="environment"
              @change="onCameraCapture"
              class="hidden"
            />

            <div v-if="!isScanning && !capturedBarcodeImage">
              <div
                @click="openMobileCamera"
                class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-3xl py-16 px-8 text-center cursor-pointer hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 hover:shadow-lg hover:shadow-blue-500/15 transition-all duration-300"
              >
                <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                  <span class="text-white text-4xl">📷</span>
                </div>

                <h3 class="text-2xl font-bold text-slate-800 mb-3">
                  {{ isMobileDevice() ? 'Buka Kamera' : 'Aktifkan Kamera' }}
                </h3>

                <p class="text-base text-slate-600 mb-4 max-w-md mx-auto">
                  {{ isMobileDevice()
                    ? 'Klik untuk membuka kamera dan foto barcode pada kemasan produk'
                    : 'Klik untuk mengaktifkan kamera dan scan barcode pada kemasan produk'
                  }}
                </p>

                <p class="text-sm text-slate-500">
                Pastikan izin kamera diaktifkan
                </p>
              </div>
            </div>

            <!-- Preview captured image (mobile) -->
            <div v-else-if="capturedBarcodeImage && !isScanning" class="flex flex-col gap-4">
              <img :src="capturedBarcodeImage" alt="Captured barcode" class="w-full h-[300px] object-contain rounded-xl bg-slate-100" />

              <div v-if="processingBarcode" class="flex flex-col items-center justify-center py-8 gap-4">
                <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-base font-semibold text-slate-700">Membaca barcode...</p>
              </div>

              <p v-if="cameraError" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center text-sm">
                {{ cameraError }}
              </p>

              <div class="flex gap-3">
                <button
                  @click="retakeBarcodePhoto"
                  class="flex-1 px-4 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                Foto Ulang
                </button>

                <button
                  v-if="!processingBarcode && !cameraError"
                  @click="processBarcodeImage"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                Proses Gambar
                </button>
              </div>
            </div>

            <!-- QR Code Stream (desktop) -->
            <div v-else-if="isScanning" class="flex flex-col gap-4">
              <qrcode-stream @decode="onDecode" @init="onInit" class="w-full h-[400px] rounded-xl overflow-hidden bg-black"></qrcode-stream>

              <p v-if="cameraError" class="p-8 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
                {{ cameraError }}
              </p>

              <button
                @click="stopCamera"
                class="w-full px-4 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center justify-center gap-2"
              >
              Tutup Kamera
              </button>

              <p class="text-center text-sm text-slate-600">
              Posisikan barcode di dalam frame untuk hasil terbaik
              </p>
            </div>
          </div>

          <!-- Upload Tab -->
          <div v-if="activeTab === 'upload'" class="animate-fade-in">
            <label class="block font-semibold text-base text-slate-800 mb-4">
              Upload Foto Barcode Kemasan
            </label>

            <input
              type="file"
              @change="onFileChange"
              ref="fileInput"
              accept="image/*"
              class="hidden"
              :disabled="searchLoading"
            />

            <div v-if="!uploadedImage">
              <div
                @click="triggerFileInput"
                :class="[
                  'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-3xl py-16 px-8 text-center transition-all duration-300',
                  searchLoading
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 hover:shadow-lg hover:shadow-blue-500/15'
                ]"
              >
                <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                  <span class="text-white text-4xl">⬆️</span>
                </div>

                <h3 class="text-2xl font-bold text-slate-800 mb-3">
                  Upload Foto Barcode
                </h3>

                <p class="text-base text-slate-600 mb-4 max-w-md mx-auto">
                  Pilih foto barcode yang sudah Anda ambil dari kemasan produk
                </p>

                <p class="text-sm text-slate-500">
                  📄 Format: JPG, PNG (Max 5MB)
                </p>
              </div>
            </div>

            <div v-else class="flex flex-col gap-4">
              <img :src="uploadedImage" alt="Uploaded barcode" class="w-full h-[300px] object-cover rounded-xl bg-slate-100" />

              <button
                @click="clearUpload"
                :disabled="searchLoading"
                class="w-full px-4 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>⬆️</span> Upload Foto Lain
              </button>
            </div>

            <p v-if="uploadError" class="mt-4 text-center text-blue-600 font-semibold">
              {{ uploadError }}
            </p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="searchLoading && !searchedFood" class="mt-8 pt-8 border-t-2 border-slate-100">
          <div class="flex flex-col items-center justify-center py-12 gap-4">
            <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-lg font-semibold text-slate-700">Mencari produk...</p>
            <p class="text-sm text-slate-500">Mohon tunggu sebentar</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="searchError && !searchLoading && !searchedFood" class="mt-8 pt-8 border-t-2 border-slate-100">
          <div class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div class="text-5xl mb-4">❌</div>
            <h3 class="text-xl font-bold text-red-700 mb-2">Produk Tidak Ditemukan</h3>
            <p class="text-red-600 mb-6">{{ searchError }}</p>
            <div class="flex gap-3 justify-center flex-wrap">
              <button
                @click="handleCancel"
                class="px-6 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
              >
                Coba Lagi
              </button>

            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="searchedFood && !searchLoading" class="mt-8 pt-8 border-t-2 border-slate-100">
          <!-- Product Image -->
          <div class="w-full max-w-md mx-auto mb-6">
            <img
              v-if="imageSrcValue && !imageLoadFailed"
              :src="imageSrcValue"
              :alt="searchedFood.productName"
              @error="onImageError"
              class="w-full h-[300px] object-contain rounded-xl shadow-lg bg-white"
            />
            <div v-else class="w-full h-auto bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 text-center border-2 border-slate-200">
              <h3 class="text-2xl font-bold text-slate-800">
                {{ searchedFood.productName }}
              </h3>
            </div>
          </div>

          <!-- Header dengan Tombol Bintang -->
          <div class="mb-6">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-3xl font-extrabold text-slate-800 mb-2">
                  {{ searchedFood.productName }}
                </h2>
                <p class="text-base text-slate-600">
                  Informasi Nilai Gizi per Sajian
                </p>
              </div>

              <!-- Tombol Bintang -->
              <button
                v-if="isAuthenticated"
                @click.stop="handleToggleFavorite"
                :disabled="isTogglingFavorite"
                :class="[
                  'flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-300',
                  isFavorited
                    ? 'bg-yellow-400 border-yellow-400 hover:bg-yellow-500'
                    : 'bg-white border-gray-300 hover:border-yellow-400 hover:bg-yellow-50',
                  isTogglingFavorite ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                ]"
                title="Tambah ke Favorit"
              >
                <span :class="[
                  'text-2xl transition-all',
                  isFavorited ? 'text-white' : 'text-yellow-400'
                ]">
                  {{ isFavorited ? '★' : '☆' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Nutrients Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <!-- Calories -->
            <div class="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Kalori</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">
                {{ Math.round(searchedFood?.calories || 0) }}
              </p>
              <p class="text-sm text-slate-500">kcal</p>
            </div>

            <!-- Carbs -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Karbohidrat</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">
                {{ Math.round(searchedFood?.carbs || 0) }}
              </p>
              <p class="text-sm text-slate-500">gram</p>
            </div>

            <!-- Protein -->
            <div class="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Protein</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">
                {{ Math.round(searchedFood?.protein || 0) }}
              </p>
              <p class="text-sm text-slate-500">gram</p>
            </div>

            <!-- Fat -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Lemak</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">
                {{ Math.round(searchedFood?.fat || 0) }}
              </p>
              <p class="text-sm text-slate-500">gram</p>
            </div>

            <!-- Sodium/Salt -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Garam</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">
                {{ saltDisplay.value }}
              </p>
              <p class="text-sm text-slate-500">{{ saltDisplay.unit }}</p>
            </div>

            <!-- Sugar -->
            <div class="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Gula</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">
                {{ Math.round(searchedFood?.sugar || 0) }}
              </p>
              <p class="text-sm text-slate-500">gram</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 justify-center flex-wrap">
            <button
              v-if="isAuthenticated"
              @click="$emit('add-to-journal')"
              class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              Tambah ke Jurnal
            </button>

            <router-link
              v-else
              to="/login"
              class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              Login untuk Menyimpan Makanan
            </router-link>

            <button
              @click="handleCancel"
              class="px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Quagga from 'quagga'
import { ref, computed, watch } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'


// Props
const props = defineProps({
  searchedFood: {
    type: Object,
    default: null
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  isFavorited: {
    type: Boolean,
    default: false
  },
  isTogglingFavorite: {
    type: Boolean,
    default: false
  },
  searchLoading: {
    type: Boolean,
    default: false
  },
  searchError: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits([
  'search',
  'add-to-journal',
  'cancel',
  'toggle-favorite',
  'camera-decode',
  'show-manual-input'
])

// State
const activeTab = ref('manual')
const barcodeInput = ref('')
const cameraError = ref('')
const uploadError = ref('')
const uploadedImage = ref(null)
const isScanning = ref(false)
const fileInput = ref(null)
const cameraInput = ref(null)
const scannerSection = ref(null)
const imageLoadFailed = ref(false)
const capturedBarcodeImage = ref(null)
const processingBarcode = ref(false)

//pre-processing image
const preprocessImage = (imageData) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Resize untuk optimal processing
      const maxWidth = 1200
      const scale = Math.min(1, maxWidth / img.width)
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Tingkatkan kontras
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        // Simple contrast enhancement
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        const factor = 1.5
        data[i] = Math.min(255, (data[i] - avg) * factor + avg)
        data[i + 1] = Math.min(255, (data[i + 1] - avg) * factor + avg)
        data[i + 2] = Math.min(255, (data[i + 2] - avg) * factor + avg)
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL())
    }
    img.src = imageData
  })
}

//request kamer permision
const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Gunakan kamera belakang di mobile
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })
    // Stop stream setelah dapat permission
    stream.getTracks().forEach(track => track.stop())
    return true
  } catch (error) {
    console.error('Camera permission error:', error)
    return false
  }
}


// Computed: Image Source dengan prioritas yang jelas
const imageSrcValue = computed(() => {
  const product = props.searchedFood
  if (!product) return null

  // Priority order untuk gambar
  const candidates = [
    product.image_url,
    product.imageUrl,
    product.image_front_url,
    product.image_small_url,
    product.image_front_small_url
  ]

  // Fallback ke properti dalam _raw object
  const raw = product._raw || product
  if (raw && typeof raw === 'object') {
    candidates.push(
      raw.image_url,
      raw.image_front_url,
      raw.image_small_url,
      raw.image_front_small_url
    )
  }

  // Cari URL yang valid (tidak kosong)
  const found = candidates.find(u => u && String(u).trim() !== '') || null
  if (!found) return null

  // Pastikan URL absolute
  const url = String(found)
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }

  // Handle relative URL
  const base = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).replace(/\/$/, '')) || 'http://localhost:3000'
  if (url.startsWith('/')) return base + url
  return base + '/' + url
})

// Computed: Format garam/sodium untuk tampilan
const saltDisplay = computed(() => {
  const product = props.searchedFood
  if (!product) return { value: 0, unit: 'mg' }

  // Ambil nutriments object
  const nutriments = product.nutriments || {}

  // Priority: sodium_100g > sodium_serving > sodium > salt
  // sodium biasanya dalam gram, kita konversi ke mg
  const sodiumGrams = nutriments.sodium_100g
    || nutriments.sodium_serving
    || nutriments.sodium
    || product.sodium
    || product.salt
    || 0

  const val = Number(sodiumGrams) || 0

  // Heuristik konversi:
  // - Jika nilai > 10 → anggap sudah dalam mg
  // - Jika nilai <= 10 → anggap dalam gram, konversi ke mg (1g = 1000mg)
  if (val > 10) {
    return { value: Math.round(val), unit: 'mg' }
  }

  // Konversi dari gram ke mg
  return { value: Math.round(val * 1000), unit: 'mg' }
})

// Methods: Normalize barcode
const normalizeBarcode = (raw) => {
  if (!raw) return ''
  let b = String(raw).trim()
  // Hapus semua karakter non-digit
  b = b.replace(/\D/g, '')
  // Jika 12 digit (UPC-A), tambah 0 di depan untuk jadi EAN-13
  if (b.length === 12) b = '0' + b
  return b
}

// Methods: Handle image error
const onImageError = (event) => {
  try {
    if (event?.target) event.target.style.display = 'none'
  } catch (err) {
    console.error('Image error handler failed:', err)
  }
  imageLoadFailed.value = true
}

// Methods: Initialize camera
const onInit = async (promise) => {
  try {
    await promise
    cameraError.value = ''
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      cameraError.value = "Izin kamera diperlukan untuk menggunakan fitur ini."
    } else if (error.name === 'NotFoundError') {
      cameraError.value = "Tidak ada kamera yang ditemukan di perangkat ini."
    } else if (error.name === 'NotReadableError') {
      cameraError.value = "Kamera sedang digunakan oleh aplikasi lain."
    } else {
      cameraError.value = "Terjadi kesalahan saat mengakses kamera: " + error.message
    }
  }
}

//onedecode dengan vibration


// Methods: Decode barcode from camera
const onDecode = async (decodedString) => {
  if (decodedString) {
    // Vibrate untuk feedback (hanya di mobile yang support)
    if ('vibrate' in navigator) {
      navigator.vibrate(200) // Vibrate 200ms
    }

    const normalized = normalizeBarcode(decodedString)
    barcodeInput.value = normalized
    emit('camera-decode', normalized)
    stopCamera()
    activeTab.value = 'manual'
  }
}

// Methods: Start camera (untuk desktop - QrcodeStream)
const startCamera = () => {
  cameraError.value = ''
  isScanning.value = true
}

// Methods: Stop camera
const stopCamera = () => {
  isScanning.value = false
  cameraError.value = ''
  capturedBarcodeImage.value = null
  processingBarcode.value = false
}

// Methods: Detect if mobile device
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Methods: Open mobile camera (untuk HP)
const openMobileCamera = async () => {
  cameraError.value = ''
  capturedBarcodeImage.value = null
  processingBarcode.value = false

  // Deteksi apakah device mobile
  if (isMobileDevice()) {
    // Request permission dulu sebelum buka camera
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      cameraError.value = 'Izin kamera diperlukan. Silakan aktifkan di pengaturan browser.'
      return
    }

    // Gunakan native camera input untuk mobile
    cameraInput.value?.click()
  } else {
    // Gunakan QrcodeStream untuk desktop
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      cameraError.value = 'Izin kamera diperlukan. Silakan aktifkan di pengaturan browser.'
      return
    }
    startCamera()
  }
}

// Methods: Handle camera capture (untuk HP)
const onCameraCapture = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validasi ukuran file (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    cameraError.value = 'Ukuran file terlalu besar. Maksimal 5MB.'
    event.target.value = ''
    return
  }

  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    cameraError.value = 'File harus berupa gambar (JPG, PNG).'
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    capturedBarcodeImage.value = e.target.result
    cameraError.value = ''
    processingBarcode.value = false
  }

  reader.onerror = () => {
    cameraError.value = 'Gagal membaca file. Silakan coba lagi.'
    capturedBarcodeImage.value = null
  }

  reader.readAsDataURL(file)
  event.target.value = '' // Reset input
}

// Methods: Retake barcode photo
const retakeBarcodePhoto = () => {
  capturedBarcodeImage.value = null
  cameraError.value = ''
  processingBarcode.value = false
  openMobileCamera()
}

// Methods: Process barcode image with OCR
const processBarcodeImage = async () => {
  if (!capturedBarcodeImage.value) return;

  processingBarcode.value = true;
  cameraError.value = '';

  try {
    const processedImage = await preprocessImage(capturedBarcodeImage.value)
    const Quagga = (await import('quagga')).default;

    // Process with Quagga (config ditingkatkan)
    Quagga.decodeSingle({
      src: processedImage,
      numOfWorkers: 0,
      locate: true,
      inputStream: {
        size: 1200
      },
      locator: {
        patchSize: 'medium',
        halfSample: true
      },
      decoder: {
        readers: [
          'ean_reader',
          'ean_8_reader',
          'code_128_reader',
          'code_39_reader',
          'upc_reader',
          'upc_e_reader'
        ]
      }
    }, (result) => {
      processingBarcode.value = false

      if (result && result.codeResult) {
        const barcode = result.codeResult.code
        const normalized = normalizeBarcode(barcode)

        if (normalized) {
          if ('vibrate' in navigator) {
            navigator.vibrate(200)
          }
          barcodeInput.value = normalized
          emit('search', normalized)
          activeTab.value = 'manual'
          capturedBarcodeImage.value = null
        } else {
          cameraError.value = 'Barcode tidak valid. Silakan coba lagi dengan foto yang lebih jelas.'
        }
      } else {
        cameraError.value = 'Tidak dapat membaca barcode. Pastikan foto jelas dan barcode terlihat dengan baik.'
      }
    })
  } catch (error) {
    console.error('Error processing barcode:', error)
    processingBarcode.value = false
    cameraError.value = 'Terjadi kesalahan saat memproses gambar. Silakan coba lagi.'
  }
}


// Methods: Trigger file input
const triggerFileInput = () => {
  if (props.searchLoading) return
  uploadError.value = ''
  fileInput.value?.click()
}

// Methods: Handle file change (upload)
const onFileChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validasi ukuran file (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'Ukuran file terlalu besar. Maksimal 5MB.'
    return
  }

  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'File harus berupa gambar (JPG, PNG).'
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    uploadedImage.value = e.target.result
    uploadError.value = 'Memproses gambar...'

    try {
      const processedImage = await preprocessImage(uploadedImage.value)
      // Import Quagga dynamically
      const Quagga = (await import('quagga')).default

      // Process with Quagga
      Quagga.decodeSingle({
        src: processedImage,
        numOfWorkers: 0,
        locate: true,
        inputStream: {
          size:1200
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        decoder: {
          readers: [
            'ean_reader',
            'ean_8_reader',
            'code_128_reader',
            'code_39_reader',
            'upc_reader',
            'upc_e_reader'
          ]
        }
      }, (result) => {
        if (result && result.codeResult) {
          const barcode = result.codeResult.code
          const normalized = normalizeBarcode(barcode)

          if (normalized) {
            if ('vibrate' in navigator) {
              navigator.vibrate(200)
            }

            barcodeInput.value = normalized
            emit('search', normalized)
            uploadError.value = ''
          } else {
            uploadError.value = 'Barcode tidak valid. Silakan upload foto yang lebih jelas.'
          }
        } else {
          uploadError.value = 'Tidak dapat membaca barcode dari gambar. Pastikan barcode terlihat jelas.'
        }
      })
    } catch (error) {
      console.error('Error processing uploaded image:', error)
      uploadError.value = 'Terjadi kesalahan saat memproses gambar. Silakan coba lagi.'
    }
  }
  reader.onerror = () => {
    uploadError.value = 'Gagal membaca file. Silakan coba lagi.'
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

// Methods: Clear upload
const clearUpload = () => {
  uploadedImage.value = null
  barcodeInput.value = ''
  uploadError.value = ''
  emit('cancel')
}

// Methods: Change tab
const changeTab = (tabName) => {
  activeTab.value = tabName
  barcodeInput.value = ''
  uploadedImage.value = null
  uploadError.value = ''
  cameraError.value = ''
  capturedBarcodeImage.value = null
  processingBarcode.value = false
  emit('cancel')
  stopCamera()
}

// Methods: Handle search
const handleSearch = () => {
  if (!barcodeInput.value || props.searchLoading) return
  const normalized = normalizeBarcode(barcodeInput.value)
  if (!normalized) {
    cameraError.value = 'Barcode tidak valid. Harap masukkan angka yang benar.'
    return
  }
  barcodeInput.value = normalized
  emit('search', normalized)
}

// Methods: Handle cancel
const handleCancel = () => {
  barcodeInput.value = ''
  uploadedImage.value = null
  uploadError.value = ''
  cameraError.value = ''
  capturedBarcodeImage.value = null
  processingBarcode.value = false
  emit('cancel')
  stopCamera()
}

// Methods: Handle toggle favorite
const handleToggleFavorite = () => {
  console.log('🌟 Toggle favorite clicked!')
  emit('toggle-favorite')
}

// Watch for product changes
watch(() => props.searchedFood, (newVal) => {
  if (newVal) {
    imageLoadFailed.value = false
  }
})

// Expose scanner section ref
defineExpose({
  scannerSection
})
</script>

<style scoped>
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Smooth transitions */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states untuk accessibility */
input:focus,
button:focus {
  outline: none;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
