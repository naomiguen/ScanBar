<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
    <!-- Custom Modal Notification -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all" @click.stop>
          <div class="pt-6 md:pt-8 pb-3 md:pb-4 flex justify-center">
            <div :class="[
              'w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center',
              modalType === 'success' ? 'bg-green-100' : modalType === 'error' ? 'bg-red-100' : 'bg-amber-100'
            ]">
              <span class="text-4xl md:text-5xl">
                {{ modalType === 'success' ? '✅' : modalType === 'error' ? '❌' : '⚠️' }}
              </span>
            </div>
          </div>

          <h3 class="text-xl md:text-2xl font-bold text-slate-800 text-center px-4 md:px-6 mb-2 md:mb-3">
            {{ modalTitle }}
          </h3>

          <p class="text-sm md:text-base text-slate-600 text-center px-6 md:px-8 pb-4 md:pb-6 leading-relaxed">
            {{ modalMessage }}
          </p>

          <p v-if="modalSubMessage" class="text-xs md:text-sm text-red-600 text-center px-6 md:px-8 pb-3 md:pb-4">
            {{ modalSubMessage }}
          </p>

          <div class="px-4 md:px-6 pb-4 md:pb-6">
            <button
              @click="closeModal"
              :class="[
                'w-full px-4 md:px-6 py-3 md:py-3.5 rounded-xl font-bold text-sm md:text-base transition-all duration-300',
                modalType === 'success' ? 'bg-green-500 hover:bg-green-600 text-white' :
                modalType === 'error' ? 'bg-red-500 hover:bg-red-600 text-white' :
                'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
              ]"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header Section -->
    <div class="text-center mb-10">
      <h1 class="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2">
        Foto Makanan
      </h1>
      <p class="text-lg text-slate-600">
        Ambil foto makanan dan dapatkan informasi kandungan nutrisinya secara otomatis
      </p>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto">
        <!-- Camera Card -->
        <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10">
          <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <span>Ambil Foto Makanan</span>
          </h2>

          <!-- Hidden File Input - USE CAMERA DIRECTLY -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            capture="environment"
            @change="onFileChange"
            class="hidden"
          />

          <!-- Preview Area -->
          <div v-if="!capturedImage"
            @click="openCamera"
            class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl py-12 md:py-20 text-center cursor-pointer hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 hover:shadow-lg transition-all duration-300"
          >

            <h3 class="text-xl md:text-2xl font-bold text-slate-800 mb-2 md:mb-3 px-4">
              {{ isMobileDevice() ? 'Buka Kamera' : 'Pilih Foto Makanan' }}
            </h3>

            <p class="text-sm md:text-base text-slate-600 max-w-md mx-auto mb-3 md:mb-4 px-4">
              {{ isMobileDevice()
                ? 'Klik untuk membuka kamera dan ambil foto makanan yang ingin Anda analisis'
                : 'Klik untuk memilih foto makanan dari galeri Anda'
              }}
            </p>

            <p class="text-xs md:text-sm text-slate-500 px-4">
              {{ isMobileDevice() ? 'Pastikan izin kamera diaktifkan' : 'Pilih foto dengan pencahayaan yang baik' }}
            </p>
          </div>

          <!-- Image Preview -->
          <div v-else class="space-y-4">
            <div class="relative rounded-xl overflow-hidden bg-slate-100">
              <img :src="capturedImage" alt="Captured food" class="w-full h-auto max-h-[400px] md:max-h-[500px] object-contain" />

              <!-- Compression indicator -->
              <div v-if="imageCompressed" class="absolute top-2 right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                ✓ Dioptimalkan
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="openCamera"
                class="w-full sm:flex-1 px-4 md:px-6 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Ambil Ulang
              </button>

              <button
                @click="analyzeImage"
                :disabled="isAnalyzing"
                :class="[
                  'w-full sm:flex-1 px-4 md:px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base',
                  isAnalyzing
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl'
                ]"
              >
                <span v-if="!isAnalyzing"></span>
                <span v-else class="animate-spin">⏳</span>
                {{ isAnalyzing ? 'Menganalisis...' : 'Analisis Nutrisi' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Analysis Results -->
        <div v-if="analysisResult" class="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10">
          <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <span>Hasil Analisis</span>
          </h2>

          <!-- Food Description -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
            <h3 class="text-base md:text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              Deskripsi Makanan
            </h3>
            <p class="text-sm md:text-base text-slate-700 leading-relaxed">{{ analysisResult.description }}</p>
          </div>

          <!-- Nutrition Grid -->
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            <div class="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-400 p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 md:mb-2">Kalori</p>
              <p class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-0.5 md:mb-1">{{ Math.round(analysisResult.calories) }}</p>
              <p class="text-xs md:text-sm text-slate-500">kcal</p>
            </div>

            <div class="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-400 p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 md:mb-2">Protein</p>
              <p class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-0.5 md:mb-1">{{ Math.round(analysisResult.protein) }}</p>
              <p class="text-xs md:text-sm text-slate-500">gram</p>
            </div>

            <div class="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 md:mb-2">Karbohidrat</p>
              <p class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-0.5 md:mb-1">{{ Math.round(analysisResult.carbs) }}</p>
              <p class="text-xs md:text-sm text-slate-500">gram</p>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 md:mb-2">Lemak</p>
              <p class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-0.5 md:mb-1">{{ Math.round(analysisResult.fat) }}</p>
              <p class="text-xs md:text-sm text-slate-500">gram</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 md:mb-2">Garam</p>
              <p class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-0.5 md:mb-1">{{ Math.round(analysisResult.salt) }}</p>
              <p class="text-xs md:text-sm text-slate-500">mg</p>
            </div>

            <div class="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p class="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1 md:mb-2">Gula</p>
              <p class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-0.5 md:mb-1">{{ Math.round(analysisResult.sugar) }}</p>
              <p class="text-xs md:text-sm text-slate-500">gram</p>
            </div>
          </div>

          <!-- Disclaimer -->
          <div class="bg-amber-50 border-l-4 border-amber-400 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
            <p class="text-xs md:text-sm text-amber-800 flex items-start gap-2">
              <span class="text-base md:text-lg flex-shrink-0"></span>
              <span><strong>Catatan:</strong> Hasil ini adalah hanya estimasi dan mungkin tidak 100% akurat. Gunakan sebagai panduan umum saja.</span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              @click="saveToJournal"
              :disabled="isSaving"
              :class="[
                'w-full sm:flex-1 px-4 md:px-6 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2',
                isSaving
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30 hover:-translate-y-0.5 hover:shadow-xl'
              ]"
            >
              <span v-if="!isSaving"></span>
              <span v-else class="animate-spin">⏳</span>
              {{ isSaving ? 'Menyimpan...' : 'Simpan ke Jurnal' }}
            </button>

            <button
              @click="resetAll"
              class="w-full sm:flex-1 px-4 md:px-6 py-3 md:py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
            >
            Analisis Baru
            </button>
          </div>
        </div>

        <!-- Info Card -->
        <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <h3 class="text-xl md:text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <span>Tips untuk Hasil Terbaik</span>
          </h3>
          <ul class="space-y-2 text-sm md:text-base text-slate-700">
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Ambil foto dari sudut yang jelas dengan pencahayaan yang baik</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Pastikan makanan terlihat dengan jelas di foto</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Untuk makanan kompleks, hasil mungkin berbeda dengan nilai aktual</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Gambar akan dioptimalkan otomatis untuk proses analisis yang lebih cepat</span>
            </li>
          </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFoodStore } from '@/stores/food'
import apiClient from '@/axios-config'

const router = useRouter()
const authStore = useAuthStore()
const foodStore = useFoodStore()

// Refs
const fileInput = ref(null)
const capturedImage = ref(null)
const analysisResult = ref(null)
const isAnalyzing = ref(false)
const isSaving = ref(false)
const imageCompressed = ref(false)

// Modal state
const showModal = ref(false)
const modalType = ref('success')
const modalTitle = ref('')
const modalMessage = ref('')
const modalSubMessage = ref('')

// Modal functions
const showNotification = (type, title, message, subMessage = '') => {
  modalType.value = type
  modalTitle.value = title
  modalMessage.value = message
  modalSubMessage.value = subMessage
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Detect if user is on mobile
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Camera functions
const openCamera = () => {
  fileInput.value?.click()
}

const onFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    capturedImage.value = e.target.result
    analysisResult.value = null
    imageCompressed.value = false
  }
  reader.readAsDataURL(file)

  // Reset input value so the same file can be selected again
  event.target.value = ''
}

// Helper function untuk compress image
const compressImage = (base64Image) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Resize jika lebih besar dari 1024px
      let width = img.width
      let height = img.height
      const maxDimension = 1024

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension
          width = maxDimension
        } else {
          width = (width / height) * maxDimension
          height = maxDimension
        }
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      // Compress quality 0.8
      const compressed = canvas.toDataURL('image/jpeg', 0.8)
      resolve(compressed.split(',')[1])
    }
    img.src = base64Image
  })
}

// Analyze image with AI
const analyzeImage = async () => {
  if (!capturedImage.value) {
    showNotification('warning', 'Tidak Ada Gambar', 'Silakan ambil foto terlebih dahulu')
    return
  }

  isAnalyzing.value = true

  try {
    // Extract base64 string
    let base64Data = capturedImage.value.split(',')[1]

    // Compress image jika terlalu besar
    const maxSize = 1024 * 1024 // 1MB
    if (base64Data.length > maxSize) {
      console.log('🗜️ Compressing large image...')
      base64Data = await compressImage(capturedImage.value)
      imageCompressed.value = true
      console.log('Image compressed successfully')
    }

    // Get mime type
    const mimeTypePart = capturedImage.value.split(',')[0]
    const mimeType = mimeTypePart.match(/:(.*?);/)?.[1] || 'image/jpeg'

    console.log('Sending to backend:', {
      mimeType,
      dataLength: base64Data.length,
      compressed: imageCompressed.value
    })

    // Call backend API with timeout handling
    const timeoutMs = 60000 // 60 seconds timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await apiClient.post('/api/ai/analyze-image', {
        imageData: base64Data,
        mimeType: mimeType
      }, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      console.log('✅ Backend response:', response.data)

      analysisResult.value = response.data

      showNotification(
        'success',
        'Analisis Selesai!',
        'AI berhasil menganalisis kandungan nutrisi makanan Anda'
      )

    } catch (error) {
      clearTimeout(timeoutId)

      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        throw {
          type: 'timeout',
          message: 'Analisis memakan waktu terlalu lama. Coba foto dengan pencahayaan lebih baik atau makanan lebih sederhana.'
        }
      }
      throw error
    }

  } catch (error) {
    console.error('❌ Error analyzing image:', error)

    let errorMessage = 'Terjadi kesalahan saat menganalisis gambar.'
    let errorDetail = error.response?.data?.error || error.message || 'Silakan coba lagi'

    if (error.type === 'timeout') {
      errorMessage = 'Waktu Analisis Habis'
      errorDetail = error.message
    } else if (!navigator.onLine) {
      errorMessage = 'Tidak Ada Koneksi'
      errorDetail = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    }

    showNotification(
      'error',
      errorMessage,
      'Mohon coba lagi dengan foto yang lebih jelas.',
      errorDetail
    )
  } finally {
    isAnalyzing.value = false
  }
}

// Save to journal
const saveToJournal = async () => {
  if (!analysisResult.value) return

  if (!authStore.isAuthenticated) {
    showNotification(
      'warning',
      'Login Diperlukan',
      'Silakan login terlebih dahulu untuk menyimpan ke jurnal'
    )
    router.push('/login')
    return
  }

  isSaving.value = true

  try {
    const foodData = {
      productName: analysisResult.value.description || 'Makanan dari Foto AI',
      calories: analysisResult.value.calories || 0,
      protein: analysisResult.value.protein || 0,
      carbs: analysisResult.value.carbs || 0,
      fat: analysisResult.value.fat || 0,
      sugar: analysisResult.value.sugar || 0,
      salt: analysisResult.value.salt || 0,
      imageUrl: capturedImage.value,
      source: 'ai_vision'
    }

    await foodStore.addFood(foodData, 'daily')

    showNotification(
      'success',
      'Berhasil Disimpan!',
      `${foodData.productName} dengan ${Math.round(foodData.calories)} kalori telah ditambahkan ke jurnal harian Anda`
    )

    // Reset after save
    setTimeout(() => {
      resetAll()
      router.push('/dashboard')
    }, 2000)

  } catch (error) {
    console.error('❌ Error saving to journal:', error)

    showNotification(
      'error',
      'Gagal Menyimpan',
      'Terjadi kesalahan saat menyimpan ke jurnal.',
      error.response?.data?.error || error.message || 'Silakan coba lagi'
    )
  } finally {
    isSaving.value = false
  }
}

// Reset all
const resetAll = () => {
  capturedImage.value = null
  analysisResult.value = null
  isAnalyzing.value = false
  isSaving.value = false
  imageCompressed.value = false
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
