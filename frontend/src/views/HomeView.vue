<template>
  <div class="min-h-screen bg-white">
    <!-- Custom Modal Notification -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all" @click.stop>
          <div class="pt-8 pb-4 flex justify-center">
            <div :class="[
              'w-20 h-20 rounded-full flex items-center justify-center',
              modalType === 'success' ? 'bg-green-100' : modalType === 'error' ? 'bg-red-100' : 'bg-amber-100'
            ]">
              <span class="text-5xl">
                {{ modalType === 'success' ? '✅' : modalType === 'error' ? '❌' : '⚠️' }}
              </span>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-slate-800 text-center px-6 mb-3">
            {{ modalTitle }}
          </h3>

          <p class="text-base text-slate-600 text-center px-8 pb-6 leading-relaxed">
            {{ modalMessage }}
          </p>

          <p v-if="modalSubMessage" class="text-sm text-red-600 text-center px-8 pb-4">
            {{ modalSubMessage }}
          </p>

          <div class="px-6 pb-6">
            <button
              @click="closeModal"
              :class="[
                'w-full px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-300',
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

    <!-- HERO SECTION -->
    <HeroSection
      :is-authenticated="authStore.isAuthenticated"
      @scroll-to-scanner="scrollToFeatures"
    />

    <!-- SECTION FITUR UNGGULAN -->
    <section ref="featuresSection" class="relative py-20 bg-white">
      <div class="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white opacity-50"></div>

      <div class="max-w-7xl mx-auto px-5 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <span class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-blue-500/30 mb-4">
            ✨ Fitur Unggulan
          </span>

          <h2 class="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
            Dua Cara Mudah Tracking Nutrisi
          </h2>

          <p class="text-lg text-slate-600 max-w-2xl mx-auto">
            Pilih metode yang paling sesuai dengan kebutuhan Anda untuk tracking asupan makanan
          </p>
        </div>

        <!-- Feature Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- Card 1: Scan Barcode Kemasan -->
          <div
            @click="scrollToScanner"
            class="bg-white rounded-3xl shadow-xl border-2 border-blue-100 p-8 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-500"></div>

            <div class="relative z-10">

              <div class="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                Untuk Produk Kemasan
              </div>

              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-4xl mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                📦
              </div>

              <h3 class="text-3xl font-extrabold text-slate-800 mb-4">
                Scan Barcode Kemasan
              </h3>

              <p class="text-base text-slate-600 leading-relaxed mb-6">
                Scan barcode pada kemasan makanan & minuman untuk mendapatkan informasi nutrisi lengkap.
              </p>

              <ul class="space-y-3 mb-6">
                <li class="flex items-start gap-3 text-slate-700">
                  <span class="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>Data nutrisi lengkap dan terverifikasi</span>
                </li>
                <li class="flex items-start gap-3 text-slate-700">
                  <span class="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>Informasi bahan & alergen</span>
                </li>
                <li class="flex items-start gap-3 text-slate-700">
                  <span class="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>Scan via kamera atau input manual</span>
                </li>
              </ul>

              <div class="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all duration-300">
                <span>Mulai Scan Sekarang</span>
                <span class="text-xl">→</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Foto Makanan -->
          <div
            @click="$router.push('/photo-scan')"
            class="bg-white rounded-3xl shadow-xl border-2 border-green-100 p-8 hover:-translate-y-2 hover:shadow-2xl hover:border-green-300 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-500"></div>

            <div class="relative z-10">

              <div class="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                Untuk Makanan
              </div>

              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-4xl mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                📸
              </div>

              <h3 class="text-3xl font-extrabold text-slate-800 mb-4">
                Foto Makanan
              </h3>

              <p class="text-base text-slate-600 leading-relaxed mb-6">
                Ambil foto makanan tanpa kemasan dan lihat kandungan nutrisinya secara otomatis.
              </p>

              <ul class="space-y-3 mb-6">
                <li class="flex items-start gap-3 text-slate-700">
                  <span class="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>Estimasi nutrisi dengan AI Gemini</span>
                </li>
                <li class="flex items-start gap-3 text-slate-700">
                  <span class="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>Cocok untuk makanan rumahan & restoran</span>
                </li>
                <li class="flex items-start gap-3 text-slate-700">
                  <span class="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>Langsung dari kamera HP</span>
                </li>
              </ul>

              <div class="flex items-center gap-2 text-green-600 font-bold group-hover:gap-4 transition-all duration-300">
                <span>Coba Foto Makanan</span>
                <span class="text-xl">→</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Banner -->
        <div class="mt-12 max-w-4xl mx-auto">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
            <div class="flex items-start gap-4">
              <span class="text-3xl flex-shrink-0">💡</span>
              <div>
                <h4 class="text-lg font-bold text-slate-800 mb-2">
                  Kapan Menggunakan Metode Mana?
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                  <div>
                    <p class="font-semibold text-blue-700 mb-1">Scan Barcode:</p>
                    <p>Makanan kemasan, snack, minuman botol, produk supermarket</p>
                  </div>
                  <div>
                    <p class="font-semibold text-green-700 mb-1">Foto Makanan:</p>
                    <p>Nasi goreng, sayur, buah segar, makanan restoran, masakan rumah</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BARCODE SCANNER SECTION COMPONENT -->
    <BarcodeScannerSection
      ref="barcodeScannerSectionRef"
      :searched-food="foodStore.searchedFood"
      :is-authenticated="authStore.isAuthenticated"
      :is-favorited="isFavorited"
      :is-toggling-favorite="isTogglingFavorite"
      @search="handleSearch"
      @camera-decode="handleCameraDecode"
      @add-to-journal="handleSubmit"
      @cancel="handleCancel"
      @toggle-favorite="toggleFavorite"
    />

    <!-- Tips & Facts Section -->
    <TipsCard />

    <!-- ARTICLE CAROUSEL SECTION -->
    <ArticleCarousel />

    <!-- CTA SECTION -->
    <section v-if="!authStore.isAuthenticated" class="relative py-24 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 blur-[60px] -top-[200px] -left-[200px]"></div>
        <div class="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 blur-[60px] -bottom-[250px] -right-[250px]"></div>
      </div>

      <div class="text-center relative z-10 max-w-3xl mx-auto px-4">
        <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Mulai Perjalanan Sehat Anda Hari Ini
        </h2>

        <p class="text-xl text-slate-300 mb-10 leading-relaxed">
          Bergabunglah dengan ribuan pengguna yang telah meningkatkan kesehatan mereka dengan ScanBar
        </p>

        <div class="flex gap-4 justify-center flex-wrap">
          <router-link
            to="/register"
            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300"
          >
            Daftar Gratis Sekarang
          </router-link>

          <router-link
            to="/login"
            class="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-base border-2 border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            Sudah Punya Akun?
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFoodStore } from '@/stores/food'
import { useAuthStore } from '@/stores/auth'
import ArticleCarousel from '@/components/ArticleCarousel.vue'
import TipsCard from '@/components/TipsCard.vue'
import Footer from '@/components/Footer.vue'
import HeroSection from '@/components/HeroSection.vue'
import BarcodeScannerSection from '@/components/BarcodeScannerSection.vue'
import apiClient from '@/axios-config'

// Stores
const foodStore = useFoodStore()
const authStore = useAuthStore()

// Refs
const barcodeScannerSectionRef = ref(null)
const featuresSection = ref(null)

// Modal State
const showModal = ref(false)
const modalType = ref('success')
const modalTitle = ref('')
const modalMessage = ref('')
const modalSubMessage = ref('')

// State
const isFavorited = ref(false)
const isTogglingFavorite = ref(false)

// Modal Functions
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

// Scroll Functions
const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToScanner = () => {
  barcodeScannerSectionRef.value?.scannerSection?.scrollIntoView({ behavior: 'smooth' })
}

// Normalize barcode
const normalizeBarcode = (raw) => {
  if (!raw) return ''
  let b = String(raw).trim()
  b = b.replace(/\D/g, '')
  if (b.length === 12) b = '0' + b
  return b
}

// Cek status favorit
const checkFavoriteStatus = async (productCode) => {
  if (!authStore.isAuthenticated) {
    isFavorited.value = false
    return
  }

  try {
    const response = await apiClient.get(`/api/favorites/check/${productCode}`)
    isFavorited.value = response.data.isFavorited
  } catch (error) {
    console.error('Error checking favorite:', error)
    isFavorited.value = false
  }
}

// Toggle favorit
const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    showNotification(
      'warning',
      'Login Diperlukan',
      'Silakan login terlebih dahulu untuk menyimpan produk favorit'
    )
    return
  }

  if (!foodStore.searchedFood || isTogglingFavorite.value) return

  // DEBUG: Log untuk cek struktur data
  console.log('🔍 Full searchedFood:', foodStore.searchedFood)
  console.log('🔍 searchedFood._raw:', foodStore.searchedFood._raw)

  // Coba berbagai kemungkinan properti barcode
  const productCode = foodStore.searchedFood.barcode ||
                      foodStore.searchedFood._raw?.code ||
                      foodStore.searchedFood.code ||
                      foodStore.searchedFood.productCode ||
                      foodStore.searchedFood._raw?.barcode ||
                      foodStore.searchedFood._raw?.id

  console.log('📦 ProductCode found:', productCode)

  if (!productCode) {
    showNotification('error', 'Gagal', 'Kode produk tidak ditemukan')
    console.error('❌ No product code found in:', foodStore.searchedFood)
    return
  }

  isTogglingFavorite.value = true

  try {
    const productData = foodStore.searchedFood._raw || foodStore.searchedFood

    const payload = {
      productCode: productCode,
      productData: {
        product_name: productData.product_name || productData.productName,
        brands: productData.brands || productData.brand,
        image_url: productData.image_url || productData.imageUrl,
        image_small_url: productData.image_small_url,
        nutriments: productData.nutriments || {
          'energy-kcal_100g': productData.calories,
          proteins_100g: productData.protein,
          carbohydrates_100g: productData.carbs,
          fat_100g: productData.fat,
          sugars_100g: productData.sugar,
          salt_100g: productData.salt
        },
        serving_size: productData.serving_size || productData.servingSize
      }
    }

    console.log('📤 Sending payload:', payload)

    const response = await apiClient.post('/api/favorites', payload)

    isFavorited.value = response.data.isFavorited

    showNotification(
      'success',
      response.data.isFavorited ? '⭐ Ditambahkan ke Favorit!' : '☆ Dihapus dari Favorit',
      response.data.message
    )
  } catch (error) {
    console.error('❌ Error toggling favorite:', error)
    console.error('❌ Error response:', error.response?.data)

    if (error.response?.status === 401) {
      showNotification('error', 'Sesi Berakhir', 'Silakan login kembali')
    } else {
      showNotification(
        'error',
        'Gagal Memproses Favorit',
        error.response?.data?.error || 'Terjadi kesalahan saat memproses favorit'
      )
    }
  } finally {
    isTogglingFavorite.value = false
  }
}

// Handle search from barcode scanner
const handleSearch = async (barcode) => {
  const normalized = normalizeBarcode(barcode)
  if (!normalized) {
    showNotification('error', 'Format Tidak Valid', 'Format barcode yang Anda masukkan tidak valid')
    return
  }

  try {
    await foodStore.fetchFoodByBarcode(normalized)

    if (foodStore.searchedFood) {
      await checkFavoriteStatus(normalized)
      showNotification(
        'success',
        'Produk Ditemukan!',
        `${foodStore.searchedFood.productName} berhasil ditemukan`
      )
    } else {
      isFavorited.value = false
      showNotification(
        'warning',
        'Produk Tidak Ditemukan',
        'Barcode tidak tersedia. Silakan coba barcode lain atau periksa kembali kode yang dimasukkan.'
      )
    }
  } catch (error) {
    isFavorited.value = false
    showNotification(
      'error',
      'Gagal Mencari Produk',
      'Terjadi kesalahan saat mencari produk.',
      error.message || 'Silakan coba lagi'
    )
  }
}

// Handle camera decode
const handleCameraDecode = async (barcode) => {
  try {
    await foodStore.fetchFoodByBarcode(barcode)

    if (foodStore.searchedFood) {
      await checkFavoriteStatus(barcode)
      showNotification(
        'success',
        'Produk Ditemukan!',
        `${foodStore.searchedFood.productName} berhasil dimuat dari scan kamera`
      )
    } else {
      isFavorited.value = false
      showNotification(
        'warning',
        'Produk Tidak Ditemukan',
        'Barcode tidak tersedia. Silakan coba scan produk lain.'
      )
    }
  } catch (error) {
    isFavorited.value = false
    showNotification(
      'error',
      'Gagal Memproses Barcode',
      'Terjadi kesalahan saat memproses barcode.',
      error.message || 'Silakan coba lagi'
    )
  }
}

// Handle submit to journal
const handleSubmit = async () => {
  if (!foodStore.searchedFood) return

  try {
    const foodData = { ...foodStore.searchedFood }

    for (const key of ['calories', 'protein', 'carbs', 'fat']) {
      if (typeof foodData[key] === 'string' && foodData[key].trim() !== '') {
        foodData[key] = parseFloat(foodData[key].replace(',', '.'))
      } else if (foodData[key] === null || foodData[key] === undefined) {
        foodData[key] = 0
      }
    }

    await foodStore.addFood(foodData, foodStore.summaryPeriod || 'daily')

    showNotification(
      'success',
      'Berhasil Ditambahkan!',
      `${foodData.productName} dengan ${Math.round(foodData.calories)} kalori telah disimpan ke jurnal harian Anda`
    )

    setTimeout(() => {
      foodStore.clearSearchedFood()
      isFavorited.value = false
    }, 500)

  } catch (error) {
    showNotification(
      'error',
      'Gagal Menambahkan',
      'Terjadi kesalahan saat menambahkan makanan ke jurnal.',
      error?.message || 'Silakan coba lagi'
    )
    console.error('Error adding food:', error)
  }
}

// Handle cancel
const handleCancel = () => {
  foodStore.clearSearchedFood()
  isFavorited.value = false
}

// Handle analyze
const handleAnalyze = async () => {
  if (!foodStore.searchedFood) return
  await foodStore.analyzeFood(foodStore.searchedFood)
}

// Watch for product changes
watch(() => foodStore.searchedFood, (newVal) => {
  if (newVal) {
    handleAnalyze()
  }
})
</script>

<style scoped>
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
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
  opacity: 0;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 100px;
}
</style>
