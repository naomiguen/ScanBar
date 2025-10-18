import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import apiClient from '@/axios-config.js';

export const useFoodStore = defineStore('food', () => {
  // STATE
  const foods = ref([]);
  const searchedFood = ref(null);
  const summary = ref(null);

  // GETTERS (Computed)
  const totals = computed(() => {
    return foods.value.reduce(
      (acc, food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
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

  async function addFood(foodData) {
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
      searchedFood.value = response.data;
      Swal.fire({
        icon: 'info',
        title: 'Produk Ditemukan!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Gagal mencari barcode:', error);
      searchedFood.value = null;
      Swal.fire({
        icon: 'error',
        title: 'Tidak Ditemukan',
        text: error.response?.data?.message || 'Produk dengan barcode tersebut tidak ditemukan.',
      });
    }
  }

  function clearSearchedFood() {
    searchedFood.value = null;
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
      return response.data;
    } catch (error) {
      console.error('Gagal mengambil ringkasan berdasarkan periode:', error);
      return { calories: 0, carbs: 0, protein: 0, fat: 0 };
    }
  }

  //Fungsi menghapus makanan dari jurnal
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

  return {
    foods,
    totals,
    searchedFood,
    fetchTodaysFoods,
    addFood,
    fetchFoodByBarcode,
    clearSearchedFood,
    summary,
    fetchSummary,
    fetchSummaryByPeriod,
    deleteFood,
  };
});
