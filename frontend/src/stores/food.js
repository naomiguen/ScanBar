import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import apiClient from '@/axios-config.js';
import { toast } from 'vue-sonner'

const parseNumber = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const extractImageUrl = (product) => {
  if (!product || typeof product !== 'object') return null;

  const candidates = [
    'imageUrl',
    'image_url',
    'image',
    'image_front_url',
    'image_front_small_url',
    'image_front_thumb_url',
    'image_small_url',
    'image_thumb_url',
    'image_front',
  ];

  for (const key of candidates) {
    // Check if value exists AND is not empty string
    if (product[key] && product[key].trim() !== '') {
      return product[key];
    }
  }

  if (product.selected_images && product.selected_images.front && product.selected_images.front.display) {
    const disp = product.selected_images.front.display;
    if (disp.en) return disp.en;
    const first = Object.values(disp)[0];
    if (first) return first;
  }

  if (product.images && product.images.front) {
    const front = product.images.front;
    if (front.small && front.small.url) return front.small.url;
    if (front.thumb && front.thumb.url) return front.thumb.url;
    if (front.display && front.display.en) return front.display.en;
  }

  if (product._images && product._images.front && product._images.front.small && product._images.front.small.url) {
    return product._images.front.small.url;
  }

  return null;
};

// 🆕 Helper function untuk normalize nutrisi data
const getNutrimentValue = (nutriments, fieldName) => {
  if (!nutriments) return 0;

  // Priority order untuk setiap field
  // Format: [OpenFoodFacts API, Local Database, Alternative names]
  const fieldMap = {
    'energy': [
      'calories',           // ✅ Local DB format (PRIORITAS)
      'energy-kcal',        // ✅ Local DB format alternate
      'energy-kcal_100g',   // API format
      'energy_100g',
      'energy'
    ],
    'protein': [
      'proteins',           // ✅ Local & API
      'proteins_100g',
      'protein'
    ],
    'carbs': [
      'carbs',              // ✅ Local DB format (PRIORITAS)
      'carbohydrates',      // API format
      'carbohydrates_100g'
    ],
    'fat': [
      'fat',                // ✅ Local & API
      'fat_100g',
      'fats'
    ],
    'sugar': [
      'sugar',              // ✅ Local DB format (PRIORITAS)
      'sugars',             // API format
      'sugars_100g'
    ],
    'salt': [
      'sodium',             // ✅ Local DB format (PRIORITAS)
      'salt',
      'sodium_100g',
      'salt_100g'
    ]
  };

  const candidates = fieldMap[fieldName] || [fieldName];

  for (const candidate of candidates) {
    if (nutriments[candidate] !== undefined && nutriments[candidate] !== null) {
      const value = parseNumber(nutriments[candidate]);
      // Debug log untuk troubleshooting
      if (value > 0) {
        console.log(`✓ Found ${fieldName}: ${candidate} = ${value}`);
      }
      return value;
    }
  }

  console.warn(`⚠ No value found for ${fieldName} in:`, Object.keys(nutriments));
  return 0;
};

export const useFoodStore = defineStore('food', () => {
  // STATE
  const foods = ref([]);
  const searchedFood = ref(null);
  const summary = ref(null);
  const summaryPeriod = ref('daily');

  const analysisResult = ref(null);
  const analysisLoading = ref(false);

  //  STATE BARU untuk Daily Analysis
  const dailyAnalysis = ref(null);
  const dailyAnalysisLoading = ref(false);
  const dailyAnalysisError = ref(null);
  const dailyAnalysisCached = ref(false);

  // State untuk Barcode Search
  const searchLoading = ref(false);
  const searchError = ref(null);

  // GETTERS
  const totals = computed(() => {
    return foods.value.reduce(
      (acc, food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
        acc.sugar += food.sugar || 0;
        acc.salt += food.salt || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, salt: 0 }
    );
  });

  // ACTIONS
  async function fetchTodaysFoods() {
    try {
      const response = await apiClient.get('/api/foods');
      foods.value = response.data;
    } catch (error) {
      console.error('Gagal mengambil data makanan:', error);
      toast.error('Gagal Memuat Data', {
        description: 'Gagal mengambil jurnal makanan harian Anda.'
      });
    }
  }

  async function addFood(foodData, period) {
    try {
      const response = await apiClient.post('/api/foods', foodData);
      foods.value.unshift(response.data);
      toast.success('Berhasil!', {
        description: `"${foodData.productName}" telah ditambahkan ke jurnal Anda.`,
        duration: 2000
      });

      try {
        const p = period || summaryPeriod.value || 'daily';
        await fetchSummaryByPeriod(p);
      } catch (e) {
        console.error('Gagal memperbarui ringkasan setelah menambah makanan:', e);
      }
    } catch (error) {
      console.error('Gagal menambah makanan:', error);
      toast.error('Gagal', {
        description: 'Gagal menambahkan makanan ke jurnal.'
      });
    }
  }

  async function deleteFood(foodId) {
    try {
      await apiClient.delete(`/api/foods/${foodId}`);
      foods.value = foods.value.filter(food => food._id !== foodId);

      toast.success('Berhasil Dihapus', {
        description: 'Item telah dihapus dari jurnal.',
        duration: 2000
      });
    } catch (error) {
      console.error('Gagal menghapus makanan:', error);
      toast.error('Gagal', {
        description: 'Gagal menghapus item dari jurnal.'
      });
    }
  }

  async function fetchFoodByBarcode(barcode) {
    // Reset state
    searchedFood.value = null;
    searchError.value = null;
    searchLoading.value = true;

    try {
      console.log('🔍 Searching barcode:', barcode);

      const response = await apiClient.get(`/api/foods/barcode/${barcode}`);
      const product = response.data;

      console.log('📦 Product received:', {
        name: product.product_name,
        source: product.source,
        cached: product.cached,
        hasNutriments: !!product.nutriments
      });

      // 🆕 Gunakan helper function untuk extract nutrisi
      const nutrimentsSource = product.nutriments || product
      searchedFood.value = {
        productName: product.product_name || 'Nama tidak tersedia',
        calories: getNutrimentValue(nutrimentsSource, 'energy'),
        protein: getNutrimentValue(nutrimentsSource, 'protein'),
        carbs: getNutrimentValue(nutrimentsSource, 'carbs'),
        fat: getNutrimentValue(nutrimentsSource, 'fat'),
        sugar: getNutrimentValue(nutrimentsSource, 'sugar'),
        salt: getNutrimentValue(nutrimentsSource, 'salt'),
        imageUrl: extractImageUrl(product) || null,
        brands: product.brands || 'Tidak Diketahui',
        source: product.source || 'unknown', // Track sumber data
        _raw: product
      };

      // Log hasil parsing
      console.log('✅ Parsed food data:', {
        name: searchedFood.value.productName,
        calories: searchedFood.value.calories,
        protein: searchedFood.value.protein,
        carbs: searchedFood.value.carbs,
        fat: searchedFood.value.fat
      });

      // Tampilkan notifikasi berdasarkan sumber data
      if (product.cached || product.source === 'local_cache' || product.source === 'local_admin_input') {
        console.log('✅ Data dari database lokal');
        toast.success('Produk Ditemukan!', {
          description: '📁 Data diambil dari database lokal',
          duration: 1500
        });
      } else {
        console.log('✅ Data dari API eksternal (fresh)');
        toast.success('Produk Ditemukan!', {
          description: '🌐 Data diambil dari API dan disimpan',
          duration: 1500
        });
      }
    } catch (error) {
      console.error('❌ Gagal mencari barcode:', error);

      // Handle berbagai jenis error
      if (error.response?.status === 404) {
        // Produk tidak ditemukan
        const errorData = error.response.data;

        searchError.value = errorData.msg || 'Produk tidak ditemukan';

        toast.error('Produk Tidak Ditemukan', {
          description: errorData.msg || 'Produk tidak ditemukan di database manapun',
          action: errorData.suggestion ? {
            label: 'OK',
            onClick: () => {}
          } : undefined,
          duration: 4000
        });

        // Jika ada nama produk (artinya ada di API tapi nutrisi kosong)
        if (errorData.productName) {
          console.log(`ℹ️ Produk ditemukan: ${errorData.productName}, tapi nutrisi tidak lengkap`);

          toast.info('Lengkapi Data Nutrisi', {
            description: `Produk "${errorData.productName}" ditemukan tetapi data nutrisinya tidak lengkap. Silakan gunakan input manual.`,
            duration: 5000
          });
        }
       } else if (error.response?.status === 400) {
        // Barcode tidak valid
        searchError.value = 'Barcode tidak valid';
        toast.error('Barcode Tidak Valid', {
          description: 'Format barcode yang Anda masukkan tidak valid.',
          duration: 3000
        });

      } else if (error.response?.status === 503 || error.response?.status === 504) {
        // Server eksternal bermasalah
        searchError.value = 'Server data eksternal tidak dapat dijangkau';
        toast.error('Koneksi Bermasalah', {
          description: 'Gagal terhubung ke server data eksternal. Silakan coba lagi atau gunakan input manual.',
          duration: 4000
        });
      } else {
        // Error lainnya
        searchError.value = 'Terjadi kesalahan saat mencari produk';
        toast.error('Terjadi Kesalahan', {
          description: error.response?.data?.msg || 'Gagal mencari produk. Silakan coba lagi.',
          duration: 3000
        });
      }

      // Tetap set searchedFood ke null agar UI tahu tidak ada hasil
      searchedFood.value = null;

    } finally {
      searchLoading.value = false;
    }
  }

  function clearSearchedFood() {
    searchedFood.value = null;
    searchError.value = null;
    analysisResult.value = null;
    analysisLoading.value = false;
  }

  async function fetchSummary() {
    try {
      const response = await apiClient.get('/api/foods/summary');
      summary.value = response.data;
    } catch (error) {
      console.error('Gagal mengambil ringkasan:', error);
    }
  }

  async function fetchSummaryByPeriod(period = 'daily') {
    try {
      const response = await apiClient.get(`/api/foods/summary?period=${period}`);
      const data = response.data || {};

      summary.value = {
        calories: data.calories ?? 0,
        carbs: data.carbs ?? 0,
        protein: data.protein ?? 0,
        fat: data.fat ?? 0,
        sugar: data.sugar ?? 0,
        salt: data.salt ?? 0,
      };

      summaryPeriod.value = period;
      return response.data;
    } catch (error) {
      console.error('Gagal mengambil ringkasan berdasarkan periode:', error);
      summary.value = { calories: 0, carbs: 0, protein: 0, fat: 0, sugar: 0, salt: 0 };
      return summary.value;
    }
  }

  //AI Analisis
   async function analyzeFood(foodData) {
    analysisResult.value = null;
    analysisLoading.value = true;

    try {
      const payload = {
        productName: foodData.productName || foodData.product_name || '',
        calories: foodData.calories ?? 0,
        protein: foodData.protein ?? 0,
        carbs: foodData.carbs ?? foodData.carbohydrates ?? 0,
        fat: foodData.fat ?? 0,
        sugar: foodData.sugar ?? 0,
        salt: foodData.salt ?? 0,
      };
      console.log('Mengirim request analisis AI untuk:', payload.productName);

      const response = await apiClient.post('/api/foods/analyze', payload);

      analysisResult.value = response.data.analysis;

      if (response.data.analysis) {
        console.log('Analisis AI berhasil!');
        toast.success('Analisis Selesai', {
          description: 'Analisis nutrisi berhasil dimuat.',
          duration: 1500
        });
      }
    } catch (error) {
      console.error('❌ Gagal menganalisis:', error);

      analysisResult.value = 'Gagal menganalisis data makanan. Silakan coba lagi nanti.';

      const serverMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      toast.error('Gagal Menganalisis', {
        description: serverMsg || 'Terjadi kesalahan saat menganalisis makanan.',
        duration: 4000
      });
    } finally {
      analysisLoading.value = false;
    }
  }
  //daily analisis
  async function fetchDailyAnalysis() {
    dailyAnalysisLoading.value = true;
    dailyAnalysisError.value = null;
    dailyAnalysisCached.value = false;

    try {
      console.log('🔍 Fetching daily analysis...');

      const response = await apiClient.get('/api/foods/analysis/today');

      // Parse analysis jika berupa string JSON
      let analysis = response.data.analysis;
      if (typeof analysis === 'string') {
        try {
          analysis = JSON.parse(analysis);
        } catch (e) {
          console.warn('Analysis is string but not JSON, keeping as-is');
        }
      }

      dailyAnalysis.value = analysis;
      dailyAnalysisCached.value = response.data.cached || false;

      // Log untuk debugging
      if (response.data.cached) {
        console.log('Daily analysis loaded from cache');
      } else {
        console.log('Daily analysis generated fresh');
      }

    } catch (error) {
      console.error('❌ Failed to fetch daily analysis:', error);
      dailyAnalysisError.value = error.response?.data?.message || 'Gagal mengambil analisis harian';

      toast.error('Gagal Memuat Analisis', {
        description: dailyAnalysisError.value,
        duration: 3000
      });
    } finally {
      dailyAnalysisLoading.value = false;
    }
  }

  function clearDailyAnalysis() {
    dailyAnalysis.value = null;
    dailyAnalysisLoading.value = false;
    dailyAnalysisError.value = null;
    dailyAnalysisCached.value = false;
  }

  return {
    // State
    foods,
    totals,
    searchedFood,
    summary,
    analysisResult,
    analysisLoading,
    summaryPeriod,
    searchLoading,
    searchError,

    // Daily Analysis state
    dailyAnalysis,
    dailyAnalysisLoading,
    dailyAnalysisError,
    dailyAnalysisCached,

    // Actions - Food Management
    fetchTodaysFoods,
    addFood,
    deleteFood,

    // Actions - Barcode Search
    fetchFoodByBarcode,
    clearSearchedFood,

    // Actions - Summary
    fetchSummary,
    fetchSummaryByPeriod,

    // Actions - AI Analysis
    analyzeFood,
    fetchDailyAnalysis,
    clearDailyAnalysis
  };
});
