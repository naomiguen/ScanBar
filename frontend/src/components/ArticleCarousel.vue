<template>
  <section class="relative py-24 bg-white">
    <!-- Background Decorations -->
    <div class="absolute inset-0 z-0">
      <div class="absolute w-[400px] h-[400px] bg-blue-200 rounded-full blur-[60px] opacity-20 top-20 right-10"></div>
      <div class="absolute w-[400px] h-[400px] bg-purple-200 rounded-full blur-[60px] opacity-20 bottom-20 left-10"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <span class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-blue-500/30 mb-4">
        Artikel Terkini
        </span>

        <h2 class="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
          Artikel Kesehatan
        </h2>

        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Baca artikel kesehatan dan nutrisi terkini untuk meningkatkan pengetahuan Anda
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p class="text-slate-600 font-semibold">Memuat artikel...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && articles.length === 0" class="flex justify-center items-center py-20">
        <div class="text-center max-w-md">
          <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Tidak Ada Artikel</h3>
          <p class="text-slate-600">Gagal memuat artikel saat ini. Coba lagi nanti.</p>
        </div>
      </div>

      <!-- Articles Carousel with Navigation Arrows -->
      <div v-if="!isLoading && articles.length > 0" class="relative">
        <!-- Left Arrow Button -->
        <button
          v-if="canScrollLeft"
          @click="scrollLeft"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl border-2 border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 group"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Right Arrow Button -->
        <button
          v-if="canScrollRight"
          @click="scrollRight"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl border-2 border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 group"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Carousel Container -->
        <div
          ref="carouselContainer"
          @scroll="updateScrollButtons"
          class="overflow-x-auto overflow-y-hidden pb-6 scrollbar-hide scroll-smooth"
        >
          <div class="flex gap-6 px-12">
            <!-- Article Card -->
            <a
              v-for="article in articles"
              :key="article.url"
              :href="article.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex-shrink-0 w-[320px] bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <!-- Image -->
              <div class="relative h-[200px] overflow-hidden bg-slate-100">
                <img
                  :src="article.imageUrl || 'https://via.placeholder.com/320x200?text=Artikel+Kesehatan'"
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  @error="handleImageError"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <!-- Content -->
              <div class="p-5">
                <!-- Source & Date -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {{ article.source }}
                  </span>
                  <span class="text-xs text-slate-500">
                    {{ formatDate(article.publishedAt) }}
                  </span>
                </div>

                <!-- Title -->
                <h3 class="text-base font-bold text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-300">
                  {{ article.title }}
                </h3>

                <!-- Description -->
                <p class="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {{ article.description }}
                </p>

                <!-- Read More -->
                <div class="mt-4 flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                  <span>Baca Selengkapnya</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Scroll Indicators (Optional Dots) -->
        <div v-if="articles.length > 3" class="flex justify-center gap-2 mt-6">
          <div
            v-for="(_, index) in Math.ceil(articles.length / 3)"
            :key="index"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-300',
              currentPage === index ? 'bg-blue-600 w-8' : 'bg-slate-300'
            ]"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiClient from '@/axios-config'

const articles = ref([])
const isLoading = ref(true)
const carouselContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const currentPage = ref(0)

// Fetch articles on mount
onMounted(async () => {
  try {
    isLoading.value = true
    const { data } = await apiClient.get('/api/articles/health')
    articles.value = data

    // Update scroll buttons after articles load
    setTimeout(() => {
      updateScrollButtons()
    }, 100)
  } catch (error) {
    console.error('Gagal mengambil artikel dari backend:', error)
  } finally {
    isLoading.value = false
  }
})

// Scroll functions
const scrollLeft = () => {
  if (carouselContainer.value) {
    const scrollAmount = 344 // Card width (320px) + gap (24px)
    carouselContainer.value.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    })
  }
}

const scrollRight = () => {
  if (carouselContainer.value) {
    const scrollAmount = 344 // Card width (320px) + gap (24px)
    carouselContainer.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }
}

// Update scroll button visibility
const updateScrollButtons = () => {
  if (carouselContainer.value) {
    const container = carouselContainer.value
    canScrollLeft.value = container.scrollLeft > 0
    canScrollRight.value = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10)

    // Calculate current page for indicators
    const cardWidth = 344
    currentPage.value = Math.round(container.scrollLeft / cardWidth / 3)
  }
}

// Format date helper
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/320x200?text=Artikel+Kesehatan'
}
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Line clamp utilities for older browsers */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
