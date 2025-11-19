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
      @scroll-to-scanner="scrollToScanner"
    />

    <!-- SECTION FITUR UNGGULAN -->
    <section class="relative py-20 bg-white">
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
                Ambil foto makanan tanpa kemasan dan lihat kandungan utrisinya secara otomatis.
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

    <!-- SCANNER SECTION -->
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
                <form @submit.prevent="handleSearch" class="flex flex-col gap-6">
                  <label class="block font-semibold text-base text-slate-800">
                    Input Kode Barcode dari Kemasan
                  </label>

                  <div class="flex flex-col gap-3">
                    <input
                      v-model="barcodeInput"
                      type="text"
                      placeholder="Contoh: 8992761111113"
                      class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
                      required
                    />

                    <p v-if="cameraError" class="text-sm text-red-600">
                      {{ cameraError }}
                    </p>
                  </div>

                  <button
                    type="submit"
                    class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-blue-500/30"
                  >
                    <span>🔍</span> Cari Produk
                  </button>
                </form>
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
          <div v-if="foodStore.searchedFood" class="mt-8 pt-8 border-t-2 border-slate-100">
            <!-- Product Image -->
            <div class="w-full max-w-md mx-auto mb-6">
              <img
                v-if="imageSrcValue && !imageLoadFailed"
                :src="imageSrcValue"
                :alt="foodStore.searchedFood.productName"
                @error="onImageError"
                class="w-full h-[300px] object-contain rounded-xl shadow-lg bg-white"
              />
              <div v-else class="w-full h-[300px] bg-slate-100 rounded-xl flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#f1f5f9" />
                  <g fill="#cbd5e1">
                    <rect x="40" y="80" width="320" height="160" rx="12" />
                    <circle cx="120" cy="160" r="28" fill="#e2e8f0" />
                  </g>
                  <text x="200" y="40" fill="#94a3b8" font-size="20" font-family="Arial, sans-serif" text-anchor="middle">Gambar tidak tersedia</text>
                </svg>
              </div>
            </div>

            <!-- Header dengan Tombol Bintang -->
            <div class="mb-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h2 class="text-3xl font-extrabold text-slate-800 mb-2">
                    {{ foodStore.searchedFood.productName }}
                  </h2>
                  <p class="text-base text-slate-600">
                    Informasi Nilai Gizi per Sajian
                  </p>
                </div>

                <!-- Tombol Bintang -->
                <button
                  @click="toggleFavorite"
                  :disabled="isTogglingFavorite"
                  :class="[
                    'flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-300',
                    isFavorited
                      ? 'bg-yellow-400 border-yellow-400 hover:bg-yellow-500'
                      : 'bg-white border-gray-300 hover:border-yellow-400 hover:bg-yellow-50',
                    isTogglingFavorite ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                  ]"
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
                <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(foodStore.searchedFood.calories) }}</p>
                <p class="text-sm text-slate-500">kcal</p>
              </div>

              <!-- Carbs -->
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Karbohidrat</p>
                <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(foodStore.searchedFood.carbs) }}</p>
                <p class="text-sm text-slate-500">gram</p>
              </div>

              <!-- Protein -->
              <div class="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Protein</p>
                <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(foodStore.searchedFood.protein) }}</p>
                <p class="text-sm text-slate-500">gram</p>
              </div>

              <!-- Fat -->
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Lemak</p>
                <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(foodStore.searchedFood.fat) }}</p>
                <p class="text-sm text-slate-500">gram</p>
              </div>

              <!-- Sodium -->
              <div class="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Garam</p>
                <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round((foodStore.searchedFood?.salt || 0) * 1000) }}</p>
                <p class="text-sm text-slate-500">mg</p>
              </div>

              <!-- Sugar -->
              <div class="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-400 p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <p class="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Gula</p>
                <p class="text-4xl font-extrabold text-slate-800 mb-1">{{ Math.round(foodStore.searchedFood.sugar || 0) }}</p>
                <p class="text-sm text-slate-500">gram</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 justify-center flex-wrap">
              <button
                v-if="authStore.isAuthenticated"
                @click="handleSubmit"
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
import { ref, computed, watch } from 'vue'
import { useFoodStore } from '@/stores/food'
import { useAuthStore } from '@/stores/auth'
import { QrcodeStream } from 'vue-qrcode-reader'
import ArticleCarousel from '@/components/ArticleCarousel.vue'
import TipsCard from '@/components/TipsCard.vue'
import Footer from '@/components/Footer.vue'
import HeroSection from '@/components/HeroSection.vue'
import apiClient from '@/axios-config'

// Stores
const foodStore = useFoodStore()
const authStore = useAuthStore()

// Modal State
const showModal = ref(false)
const modalType = ref('success')
const modalTitle = ref('')
const modalMessage = ref('')
const modalSubMessage = ref('')

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

// Scroll to scanner
const scrollToScanner = () => {
  scannerSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// Normalize barcode
const normalizeBarcode = (raw) => {
  if (!raw) return ''
  let b = String(raw).trim()
  b = b.replace(/\D/g, '')
  if (b.length === 12) b = '0' + b
  return b
}

// Computed image source
const imageSrcValue = computed(() => {
  const product = foodStore.searchedFood
  if (!product) return null

  const raw = product._raw || product
  if (!raw || typeof raw !== 'object') return null

  const proxyUrl = (url) => {
    if (!url) return null
    return `/api/foods/image-proxy?url=${encodeURIComponent(url)}`
  }

  if (product.imageUrl) return proxyUrl(product.imageUrl)
  if (raw.image_url) return proxyUrl(raw.image_url)
  if (raw.image) return proxyUrl(raw.image)
  if (raw.image_front_url) return proxyUrl(raw.image_front_url)
  if (raw.image_front_small_url) return proxyUrl(raw.image_front_small_url)

  if (raw.selected_images?.front?.display) {
    const disp = raw.selected_images.front.display
    if (disp.en) return proxyUrl(disp.en)
    const first = Object.values(disp)[0]
    if (first) return proxyUrl(first)
  }

  if (raw.images?.front) {
    const front = raw.images.front
    if (front.small?.url) return proxyUrl(front.small.url)
    if (front.thumb?.url) return proxyUrl(front.thumb.url)
    if (front.display?.en) return proxyUrl(front.display.en)
  }

  return null
})

// Image error handler
const onImageError = (event) => {
  try {
    if (event?.target) event.target.style.display = 'none'
  } catch {}
  imageLoadFailed.value = true
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

  const productCode = barcodeInput.value || foodStore.searchedFood.barcode
  if (!productCode) {
    showNotification('error', 'Gagal', 'Kode produk tidak ditemukan')
    return
  }

  isTogglingFavorite.value = true

  try {
    const productData = foodStore.searchedFood._raw || foodStore.searchedFood

    const response = await apiClient.post('/api/favorites', {
      productCode: productCode,
      productData: {
        product_name: productData.product_name || productData.name,
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
    })

    isFavorited.value = response.data.isFavorited

    showNotification(
      'success',
      response.data.isFavorited ? '⭐ Ditambahkan ke Favorit!' : '☆ Dihapus dari Favorit',
      response.data.message
    )
  } catch (error) {
    console.error('Error toggling favorite:', error)

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

// Camera functions
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

    try {
      await foodStore.fetchFoodByBarcode(normalized)

      if (foodStore.searchedFood) {
        await checkFavoriteStatus(normalized)
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

// Upload functions
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

      try {
        await foodStore.fetchFoodByBarcode(normalized)

        if (foodStore.searchedFood) {
          await checkFavoriteStatus(normalized)
          showNotification(
            'success',
            'Produk Ditemukan!',
            `${foodStore.searchedFood.productName} berhasil dimuat dari gambar yang diupload`
          )
        } else {
          isFavorited.value = false
          showNotification(
            'warning',
            'Produk Tidak Ditemukan',
            'Barcode tidak tersedia. Silakan coba upload gambar lain.'
          )
        }
      } catch (error) {
        isFavorited.value = false
        showNotification(
          'error',
          'Gagal Memproses Gambar',
          'Terjadi kesalahan saat memproses gambar.',
          error.message || 'Silakan coba lagi'
        )
      }

      uploadError.value = ''
    }, 1500)
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

const clearUpload = () => {
  uploadedImage.value = null
  barcodeInput.value = ''
  foodStore.clearSearchedFood()
  isFavorited.value = false
}

// Main functions
const changeTab = (tabName) => {
  activeTab.value = tabName
  foodStore.clearSearchedFood()
  barcodeInput.value = ''
  uploadedImage.value = null
  isFavorited.value = false
  stopCamera()
}

const handleSearch = async () => {
  if (!barcodeInput.value) {
    showNotification('warning', 'Barcode Kosong', 'Silakan masukkan kode barcode terlebih dahulu')
    return
  }

  const normalized = normalizeBarcode(barcodeInput.value)
  if (!normalized) {
    showNotification('error', 'Format Tidak Valid', 'Format barcode yang Anda masukkan tidak valid')
    return
  }

  barcodeInput.value = normalized

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
      barcodeInput.value = ''
      foodStore.clearSearchedFood()
      uploadedImage.value = null
      imageLoadFailed.value = false
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

const handleCancel = () => {
  barcodeInput.value = ''
  foodStore.clearSearchedFood()
  uploadedImage.value = null
  isFavorited.value = false
  stopCamera()
}

const handleAnalyze = async () => {
  if (!foodStore.searchedFood) return
  await foodStore.analyzeFood(foodStore.searchedFood)
}

// Watch for product changes
watch(() => foodStore.searchedFood, (newVal) => {
  if (newVal) {
    imageLoadFailed.value = false
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

html {
  scroll-behavior: smooth;
  scroll-padding-top: 100px;
}
</style>
