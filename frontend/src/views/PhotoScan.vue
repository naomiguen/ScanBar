<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-slate-50">
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
    <section class="relative py-8 md:py-12 bg-gradient-to-br from-blue-600 to-indigo-600 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute w-64 h-64 md:w-96 md:h-96 bg-white rounded-full blur-3xl -top-20 -left-20"></div>
        <div class="absolute w-64 h-64 md:w-96 md:h-96 bg-white rounded-full blur-3xl -bottom-20 -right-20"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 relative z-10">
        <div class="text-center">
          <router-link to="/" class="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 md:mb-6 transition-colors">
            <span class="text-lg md:text-xl">←</span>
            <span class="text-sm md:text-base font-semibold">Kembali ke Home</span>
          </router-link>

          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 md:mb-4 px-4">
            Foto Makanan
          </h1>

          <p class="text-base md:text-lg text-white/90 max-w-2xl mx-auto px-4">
            Ambil foto makanan dan dapatkan informasi kandungan nutrisinya secara otomatis
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-8 md:py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Camera Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 md:p-6 mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2 md:gap-3">
            <span class="text-2xl md:text-3xl">📷</span>
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
            <div class="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg shadow-blue-500/30">
              <span class="text-white text-4xl md:text-5xl">📷</span>
            </div>

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
              {{ isMobileDevice() ? '📱 Pastikan izin kamera diaktifkan' : '🖼️ Pilih foto dengan pencahayaan yang baik' }}
            </p>
          </div>

          <!-- Image Preview -->
          <div v-else class="space-y-4">
            <div class="relative rounded-xl overflow-hidden bg-slate-100">
              <img :src="capturedImage" alt="Captured food" class="w-full h-auto max-h-[400px] md:max-h-[500px] object-contain" />
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="openCamera"
                class="w-full sm:flex-1 px-4 md:px-6 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <span>🔄</span> Ambil Ulang
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
        <div v-if="analysisResult" class="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 md:p-6">
          <h2 class="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <span class="text-2xl md:text-3xl">📊</span>
            <span>Hasil Analisis AI</span>
          </h2>

          <!-- Food Description -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
            <h3 class="text-base md:text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span>🍽️</span> Deskripsi Makanan
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
              <span class="text-base md:text-lg flex-shrink-0">⚠️</span>
              <span><strong>Catatan:</strong> Hasil ini adalah estimasi AI dan mungkin tidak 100% akurat. Gunakan sebagai panduan umum saja.</span>
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
              <span v-if="!isSaving">💾</span>
              <span v-else class="animate-spin">⏳</span>
              {{ isSaving ? 'Menyimpan...' : 'Simpan ke Jurnal' }}
            </button>

            <button
              @click="resetAll"
              class="w-full sm:flex-1 px-4 md:px-6 py-3 md:py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <span>🔄</span> Analisis Baru
            </button>
          </div>
        </div>

        <!-- Info Card -->
        <div class="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 border border-blue-200">
          <h3 class="text-base md:text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span>💡</span> Tips untuk Hasil Terbaik
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
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
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

// Camera functions - Different approach for mobile vs desktop
const openCamera = () => {
  // On mobile devices, the input with capture="environment" should directly open camera
  // On desktop, it will show file picker
  fileInput.value?.click()
}

const onFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    capturedImage.value = e.target.result
    analysisResult.value = null
  }
  reader.readAsDataURL(file)

  // Reset input value so the same file can be selected again
  event.target.value = ''
}

// Analyze image with AI
const analyzeImage = async () => {
  if (!capturedImage.value) {
    showNotification('warning', 'Tidak Ada Gambar', 'Silakan ambil foto terlebih dahulu')
    return
  }

  isAnalyzing.value = true

  try {
    // Extract base64 string and mime type
    const base64WithPrefix = capturedImage.value
    const [mimeTypePart, base64Data] = base64WithPrefix.split(',')
    const mimeType = mimeTypePart.match(/:(.*?);/)[1]

    console.log('📤 Sending to backend:', { mimeType, dataLength: base64Data.length })

    // Call backend API
    const response = await apiClient.post('/api/ai/analyze-image', {
      imageData: base64Data,
      mimeType: mimeType
    })

    console.log('✅ Backend response:', response.data)

    analysisResult.value = response.data

    showNotification(
      'success',
      'Analisis Selesai!',
      'AI berhasil menganalisis kandungan nutrisi makanan Anda'
    )

  } catch (error) {
    console.error('❌ Error analyzing image:', error)

    showNotification(
      'error',
      'Gagal Menganalisis',
      'Terjadi kesalahan saat menganalisis gambar.',
      error.response?.data?.error || error.message || 'Silakan coba lagi'
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
