// frontend/src/stores/food.js
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import apiClient from '@/axios-config.js';
import Swal from 'sweetalert2';

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
    if (product[key]) return product[key];
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

export const useFoodStore = defineStore('food', () => {
  // STATE
  const foods = ref([]);
  const searchedFood = ref(null);
  const summary = ref(null);
  const summaryPeriod = ref('daily');

  const analysisResult = ref(null);
  const analysisLoading = ref(false);

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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal mengambil jurnal makanan harian Anda.',
      });
    }
  }

  async function addFood(foodData, period) {
    try {
      const response = await apiClient.post('/api/foods', foodData);
      foods.value.unshift(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `"${foodData.productName}" telah ditambahkan ke jurnal Anda.`,
        timer: 2000,
        showConfirmButton: false,
      });

      try {
        const p = period || summaryPeriod.value || 'daily';
        await fetchSummaryByPeriod(p);
      } catch (e) {
        console.error('Gagal memperbarui ringkasan setelah menambah makanan:', e);
      }
    } catch (error) {
      console.error('Gagal menambah makanan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menambahkan makanan ke jurnal.',
      });
    }
  }

  async function fetchFoodByBarcode(barcode) {
    try {
      const response = await apiClient.get(`/api/foods/barcode/${barcode}`);

      const normalizeProduct = (data) => {
        if (!data) return null;
        const product = data.product ? data.product : data;

        const nutriments = product.nutriments || {};

        const caloriesVal = product.calories ?? nutriments.energy_kcal_100g ?? nutriments['energy-kcal_100g'] ?? nutriments.energy_100g ?? null;
        const proteinVal = product.protein ?? nutriments.proteins_100g ?? nutriments['proteins_100g'] ?? null;
        const carbsVal = product.carbs ?? product.carbohydrates ?? nutriments.carbohydrates_100g ?? nutriments['carbohydrates_100g'] ?? null;
        const fatVal = product.fat ?? nutriments.fat_100g ?? nutriments['fat_100g'] ?? null;
        const sugarVal = product.sugar ?? nutriments.sugars_100g ?? nutriments['sugars_100g'] ?? null;
        const saltVal = product.salt ?? nutriments.salt_100g ?? nutriments['salt_100g'] ?? nutriments.sodium_100g ?? null;

        return {
          productName: product.productName || product.product_name || product.name || '',
          calories: parseNumber(caloriesVal),
          protein: parseNumber(proteinVal),
          carbs: parseNumber(carbsVal),
          fat: parseNumber(fatVal),
          sugar: parseNumber(sugarVal),
          salt: parseNumber(saltVal),
          imageUrl: extractImageUrl(product) || null,
          _raw: product
        };
      };

      searchedFood.value = normalizeProduct(response.data);
      Swal.fire({
        icon: 'info',
        title: 'Produk Ditemukan!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Gagal mengambil dari backend untuk barcode:', error);
      try {
        const offResponse = await apiClient.get(`https://world.openfoodfacts.org/api/v2/product/${barcode}`);

        if (offResponse.data && offResponse.data.status === 1) {
          const product = offResponse.data.product;

          searchedFood.value = {
            productName: product.product_name || product.productName || 'Nama tidak ditemukan',
            calories: parseNumber(product.nutriments?.energy_kcal_100g || product.nutriments?.['energy-kcal_100g'] || product.nutriments?.energy_100g),
            protein: parseNumber(product.nutriments?.proteins_100g),
            carbs: parseNumber(product.nutriments?.carbohydrates_100g),
            fat: parseNumber(product.nutriments?.fat_100g),
            sugar: parseNumber(product.nutriments?.sugars_100g),
            salt: parseNumber(product.nutriments?.salt_100g),
            imageUrl: extractImageUrl(product) || null,
            _raw: product
          };

          Swal.fire({
            icon: 'success',
            title: 'Produk Ditemukan!',
            text: 'Data diambil dari OpenFoodFacts',
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          throw new Error('Produk tidak ditemukan di OpenFoodFacts');
        }
      } catch (offError) {
        console.error('Gagal mencari barcode:', offError);
        searchedFood.value = null;
        Swal.fire({
          icon: 'error',
          title: 'Tidak Ditemukan',
          text: 'Produk dengan barcode tersebut tidak ditemukan di database maupun OpenFoodFacts.',
        });
      }
    }
  }

  function clearSearchedFood() {
    searchedFood.value = null;
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

  async function deleteFood(foodId) {
    try {
      await apiClient.delete(`/api/foods/${foodId}`);
      foods.value = foods.value.filter(food => food._id !== foodId);
    } catch (error) {
      console.error('Gagal menghapus makanan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menghapus item dari jurnal.',
      });
    }
  }

  // ✨ ANALISIS AI - ENDPOINT PUBLIK (Tidak perlu token!)
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

      console.log('🤖 Mengirim request analisis AI untuk:', payload.productName);

      // Gunakan endpoint PUBLIK (tidak perlu auth token)
      const response = await apiClient.post('/api/foods/analyze', payload);

      analysisResult.value = response.data.analysis;

      if (response.data.analysis) {
        console.log('✅ Analisis AI berhasil!');
        Swal.fire({
          icon: 'success',
          title: 'Analisis Selesai',
          text: 'Analisis nutrisi berhasil dimuat.',
          timer: 1500,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      }
    } catch (error) {
      console.error('❌ Gagal menganalisis:', error);
      console.error('Error response:', error.response?.data);

      analysisResult.value = 'Gagal menganalisis data makanan. Silakan coba lagi nanti.';

      const serverMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menganalisis',
        text: serverMsg || 'Terjadi kesalahan saat menganalisis makanan.',
        timer: 4000
      });
    } finally {
      analysisLoading.value = false;
    }
  }

  return {
    foods,
    totals,
    searchedFood,
    summary,
    analysisResult,
    analysisLoading,
    fetchTodaysFoods,
    addFood,
    fetchFoodByBarcode,
    clearSearchedFood,
    fetchSummary,
    fetchSummaryByPeriod,
    summaryPeriod,
    deleteFood,
    analyzeFood
  };
});
