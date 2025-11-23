<template>
  <section ref="scannerSection" class="relative py-24 bg-white">
    <div class="absolute inset-0 z-0">
      <div class="absolute w-[400px] h-[400px] bg-blue-200 rounded-full blur-[60px] opacity-20 top-20 left-10"></div>
      <div class="absolute w-[400px] h-[400px] bg-purple-200 rounded-full blur-[60px] opacity-20 bottom-20 right-10"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-blue-500/30 mb-6 text-base">
          <span>📱</span>
          <span>Mudah & Cepat</span>
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
                    class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
                    @keyup.enter="handleSearch"
                  />

                  <p v-if="cameraError" class="text-sm text-red-600">
                    {{ cameraError }}
                  </p>
                </div>

                <button
                  @click="handleSearch"
                  class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-blue-500/30"
                >
                  <span>🔍</span> Cari Produk
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
                📍 Posisikan barcode di dalam frame untuk hasil terbaik
              </p>
            </div>
          </div>

          <!-- Camera Tab -->
          <div v-if="activeTab === 'camera'" class="animate-fade-in">
            <div v-if="!isScanning">
              <div
                @click="startCamera"
                class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-3xl py-16 px-8 text-center cursor-pointer hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 hover:shadow-lg hover:shadow-blue-500/15 transition-all duration-300"
              >
                <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                  <span class="text-white text-4xl">📷</span>
                </div>

                <h3 class="text-2xl font-bold text-slate-800 mb-3">
                  Aktifkan Kamera
                </h3>

                <p class="text-base text-slate-600 mb-4 max-w-md mx-auto">
                  Klik untuk mengaktifkan kamera dan scan barcode pada kemasan produk
                </p>

                <p class="text-sm text-slate-500">
                  📱 Pastikan izin kamera diaktifkan
                </p>
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
                📍 Posisikan barcode di dalam frame untuk hasil terbaik
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
            />

            <div v-if="!uploadedImage">
              <div
                @click="triggerFileInput"
                class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-3xl py-16 px-8 text-center cursor-pointer hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 hover:shadow-lg hover:shadow-blue-500/15 transition-all duration-300"
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
                class="w-full px-4 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>⬆️</span> Upload Foto Lain
              </button>
            </div>

            <p v-if="uploadError" class="mt-4 text-center text-blue-600 font-semibold">
              {{ uploadError }}
            </p>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="searchedFood" class="mt-8 pt-8 border-t-2 border-slate-100">
          <!-- Product Image -->
          <div class="w-full max-w-md mx-auto mb-6">
            <img
              v-if="imageSrcValue && !imageLoadFailed"
              :src="imageSrcValue"
              :alt="searchedFood.productName"
              @error="onImageError"
              class="w-full h-[300px] object-contain rounded-xl shadow-lg bg-white"
            />
            <!-- Kalau gambar gagal load atau tidak ada, langsung tampilkan nama produk -->
            <div v-else class="w-full h-auto bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 text-center border-2 border-slate-200">
              <div class="text-6xl mb-4">📦</div>
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
              <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(searchedFood.calories) }}</p>
              <p class="text-sm text-slate-500">kcal</p>
            </div>

            <!-- Carbs -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Karbohidrat</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(searchedFood.carbs) }}</p>
              <p class="text-sm text-slate-500">gram</p>
            </div>

            <!-- Protein -->
            <div class="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Protein</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(searchedFood.protein) }}</p>
              <p class="text-sm text-slate-500">gram</p>
            </div>

            <!-- Fat -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Lemak</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(searchedFood.fat) }}</p>
              <p class="text-sm text-slate-500">gram</p>
            </div>

            <!-- Sodium -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Garam</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round((searchedFood?.salt || 0) * 1000) }}</p>
              <p class="text-sm text-slate-500">mg</p>
            </div>

            <!-- Sugar -->
            <div class="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Gula</p>
              <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(searchedFood.sugar || 0) }}</p>
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
  }
})

// Emits
const emit = defineEmits(['search', 'add-to-journal', 'cancel', 'toggle-favorite', 'camera-decode'])

// State
const activeTab = ref('manual')
const barcodeInput = ref('')
const cameraError = ref('')
const uploadError = ref('')
const uploadedImage = ref(null)
const isScanning = ref(false)
const fileInput = ref(null)
const scannerSection = ref(null)
const imageLoadFailed = ref(false)

// Computed
const imageSrcValue = computed(() => {
  const product = props.searchedFood
  if (!product) return null

  // Coba langsung dari imageUrl (sudah ada di response)
  if (product.imageUrl) return product.imageUrl

  // Fallback ke properti lain jika ada
  const raw = product._raw || product
  if (raw && typeof raw === 'object') {
    return raw.image_url || raw.image_small_url || raw.image_front_url || raw.image_front_small_url || null
  }

  return null
})

// Methods
const normalizeBarcode = (raw) => {
  if (!raw) return ''
  let b = String(raw).trim()
  b = b.replace(/\D/g, '')
  if (b.length === 12) b = '0' + b
  return b
}

const onImageError = (event) => {
  try {
    if (event?.target) event.target.style.display = 'none'
  } catch {}
  imageLoadFailed.value = true
}

const onInit = async (promise) => {
  try {
    await promise
    cameraError.value = ''
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      cameraError.value = "Izin kamera diperlukan untuk menggunakan fitur ini."
    } else if (error.name === 'NotFoundError') {
      cameraError.value = "Tidak ada kamera yang ditemukan di perangkat ini."
    } else {
      cameraError.value = "Terjadi kesalahan saat mengakses kamera."
    }
  }
}

const onDecode = async (decodedString) => {
  if (decodedString) {
    const normalized = normalizeBarcode(decodedString)
    barcodeInput.value = normalized
    emit('camera-decode', normalized)
    stopCamera()
    activeTab.value = 'manual'
  }
}

const startCamera = () => {
  isScanning.value = true
}

const stopCamera = () => {
  isScanning.value = false
}

const triggerFileInput = () => {
  uploadError.value = ''
  fileInput.value.click()
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    uploadedImage.value = e.target.result

    setTimeout(async () => {
      const fakeBarcode = "8992761134017"
      const normalized = normalizeBarcode(fakeBarcode)
      barcodeInput.value = normalized
      emit('search', normalized)
      uploadError.value = ''
    }, 1500)
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

const clearUpload = () => {
  uploadedImage.value = null
  barcodeInput.value = ''
  emit('cancel')
}

const changeTab = (tabName) => {
  activeTab.value = tabName
  barcodeInput.value = ''
  uploadedImage.value = null
  emit('cancel')
  stopCamera()
}

const handleSearch = () => {
  if (!barcodeInput.value) return

  const normalized = normalizeBarcode(barcodeInput.value)
  if (!normalized) return

  barcodeInput.value = normalized
  emit('search', normalized)
}

const handleCancel = () => {
  barcodeInput.value = ''
  uploadedImage.value = null
  emit('cancel')
  stopCamera()
}

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
  animation: fadeIn 0.3s ease;
}
</style>
