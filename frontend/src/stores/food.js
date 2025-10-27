// frontend/src/stores/food.js
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import apiClient from '@/axios-config.js';
import Swal from 'sweetalert2';

// Fungsi bantuan untuk memastikan nilai adalah angka
const parseNumber = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

export const useFoodStore = defineStore('food', () => {
  // STATE
  const foods = ref([]);
  const searchedFood = ref(null);
  const summary = ref(null);
  // active period used for summary refresh (default: daily)
  const summaryPeriod = ref('daily');

  const analysisResult = ref(null);
  const analysisLoading = ref(false);

  // GETTERS (Computed)
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
      // Setelah berhasil menambah makanan, refresh ringkasan di store
      try {
        // gunakan period yang diberikan, atau period aktif di store
        const p = period || summaryPeriod.value || 'daily';
        await fetchSummaryByPeriod(p);
      } catch (e) {
        // Jika refresh ringkasan gagal, jangan ganggu alur utama
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
      // Coba ambil dari backend terlebih dahulu
      const response = await apiClient.get(`/api/foods/barcode/${barcode}`);
      searchedFood.value = response.data;
      Swal.fire({
        icon: 'info',
        title: 'Produk Ditemukan!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      // Jika gagal dari backend, coba dari OpenFoodFacts API
      console.error('Gagal mengambil dari backend untuk barcode:', error);
      try {
        const offResponse = await apiClient.get(`https://world.openfoodfacts.org/api/v2/product/${barcode}`);

        if (offResponse.data && offResponse.data.status === 1) {
          const product = offResponse.data.product;
          const nutriments = product.nutriments || {};

          // Menggunakan fungsi bantuan untuk memastikan semua nilai adalah angka
          searchedFood.value = {
            productName: product.product_name || 'Nama tidak ditemukan',
            calories: parseNumber(nutriments.energy_kcal_100g || nutriments['energy-kcal_100g']),
            protein: parseNumber(nutriments.proteins_100g),
            carbs: parseNumber(nutriments.carbohydrates_100g),
            fat: parseNumber(nutriments.fat_100g),
            sugar: parseNumber(nutriments.sugars_100g),
            salt: parseNumber(nutriments.salt_100g),
            imageUrl: product.image_url || null
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

  // Method baru untuk ringkasan berdasarkan periode
  async function fetchSummaryByPeriod(period = 'daily') {
    try {
      const response = await apiClient.get(`/api/foods/summary?period=${period}`);
      // Simpan juga ke state supaya komponen bisa terikat ke store.summary
      // Pastikan field baru (sugar, salt) selalu ada dengan default 0 jika backend belum mengembalikannya
      const data = response.data || {};
      summary.value = {
        calories: data.calories ?? 0,
        carbs: data.carbs ?? 0,
        protein: data.protein ?? 0,
        fat: data.fat ?? 0,
        sugar: data.sugar ?? 0,
        salt: data.salt ?? 0,
      };
      // simpan period aktif
      summaryPeriod.value = period;
      return response.data;
    } catch (error) {
      console.error('Gagal mengambil ringkasan berdasarkan periode:', error);
      summary.value = { calories: 0, carbs: 0, protein: 0, fat: 0, sugar: 0, salt: 0 };
      return summary.value;
    }
  }

  // Fungsi menghapus makanan dari jurnal
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

  //fungsi AI
  async function analyzeFood(foodData) {
    analysisResult.value = null;
    analysisLoading.value = true;

    try {
      const response = await apiClient.post('/api/foods/analyze', { foodData });
      analysisResult.value = response.data.analysis;
    } catch (error) {
      analysisResult.value = 'Gagal menganalisis data makanan.';
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
