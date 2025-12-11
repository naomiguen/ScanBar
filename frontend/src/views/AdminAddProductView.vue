<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
    <AdminNavbar />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">



      <!-- Main Card -->
      <div class="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-100">

        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-6 sm:px-8 py-6 sm:py-8 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
          <div class="relative">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold">Tambah Produk Baru</h1>
            </div>
            <p class="text-blue-100 text-xs sm:text-sm ml-14 sm:ml-16">Input manual untuk produk lokal yang tidak ada di database pusat</p>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitProduct" class="p-6 sm:p-8 space-y-6">

          <!-- Barcode Section -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-bold text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
              Barcode <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.code"
              type="text"
              required
              placeholder="contoh: 8999999000012"
              class="w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-mono text-base sm:text-lg bg-slate-50 hover:bg-white"
            />
            <p class="text-xs text-slate-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              Input barcode produk yang ingin ditambahkan secara manual
            </p>
          </div>

          <!-- Product Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-bold text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Nama Produk <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.product_name"
                type="text"
                required
                placeholder="Contoh: Keripik Singkong Original"
                class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-slate-300"
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm font-bold text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clip-rule="evenodd" />
                </svg>
                Merek (Brand)
              </label>
              <input
                v-model="form.brands"
                type="text"
                placeholder="Contoh: Kusuka"
                class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-slate-300"
              />
            </div>
          </div>

          <!-- Image URL -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-bold text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
              URL Gambar Produk
            </label>
            <input
              v-model="form.image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-slate-300"
            />
            <p class="text-xs text-slate-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              Masukkan URL gambar produk (opsional)
            </p>

            <!-- Image Preview -->
            <div v-if="form.image_url" class="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p class="text-xs font-semibold text-slate-600 mb-2">Preview Gambar:</p>
              <div class="relative w-32 h-32 mx-auto">
                <img
                  :src="form.image_url"
                  @error="imageError = true"
                  @load="imageError = false"
                  alt="Preview"
                  class="w-full h-full object-cover rounded-lg shadow-md"
                  v-if="!imageError"
                />
                <div v-else class="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Nutrition Facts Section -->
          <div class="bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 sm:p-6 rounded-2xl border-2 border-slate-200">
            <div class="flex items-center gap-3 mb-4 sm:mb-5">
              <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold text-slate-800">Informasi Nilai Gizi</h3>
                <p class="text-xs sm:text-sm text-slate-600">Per kemasan atau per sajian</p>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">

              <!-- Calories -->
              <div class="space-y-2">
                <label class="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase">
                  <div class="w-2 h-2 rounded-full bg-red-500"></div>
                  Kalori
                </label>
                <div class="relative">
                  <input
                    v-model="form.calories"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    class="w-full pl-3 pr-12 py-2.5 sm:py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">kcal</span>
                </div>
              </div>

              <!-- Protein -->
              <div class="space-y-2">
                <label class="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase">
                  <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                  Protein
                </label>
                <div class="relative">
                  <input
                    v-model="form.proteins"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    class="w-full pl-3 pr-10 py-2.5 sm:py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">g</span>
                </div>
              </div>

              <!-- Carbs -->
              <div class="space-y-2">
                <label class="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase">
                  <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                  Karbo
                </label>
                <div class="relative">
                  <input
                    v-model="form.carbs"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    class="w-full pl-3 pr-10 py-2.5 sm:py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">g</span>
                </div>
              </div>

              <!-- Fat -->
              <div class="space-y-2">
                <label class="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase">
                  <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                  Lemak
                </label>
                <div class="relative">
                  <input
                    v-model="form.fat"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    class="w-full pl-3 pr-10 py-2.5 sm:py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">g</span>
                </div>
              </div>

              <!-- Sugar -->
              <div class="space-y-2">
                <label class="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase">
                  <div class="w-2 h-2 rounded-full bg-pink-500"></div>
                  Gula
                </label>
                <div class="relative">
                  <input
                    v-model="form.sugar"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    class="w-full pl-3 pr-10 py-2.5 sm:py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">g</span>
                </div>
              </div>

              <!-- Sodium -->
              <div class="space-y-2">
                <label class="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase">
                  <div class="w-2 h-2 rounded-full bg-teal-500"></div>
                  Garam
                </label>
                <div class="relative">
                  <input
                    v-model="form.sodium"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    class="w-full pl-3 pr-10 py-2.5 sm:py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">mg</span>
                </div>
              </div>

            </div>

            <!-- Info Note -->
            <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <p class="text-xs sm:text-sm text-blue-800">
                <span class="font-semibold">Tips:</span> Nilai gizi dapat ditemukan pada label kemasan produk. Pastikan data sesuai dengan takaran saji yang tertera.
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-2 sm:pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg v-if="isLoading" class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm sm:text-base">{{ isLoading ? 'Menyimpan Data...' : 'Simpan ke Database' }}</span>
            </button>
          </div>

          <!-- Help Text -->
          <div class="text-center">
            <p class="text-xs text-slate-500">
              Dengan menyimpan produk ini, data akan tersedia untuk semua pengguna aplikasi
            </p>
          </div>

        </form>
      </div>



    </div>
  </div>
</template>

<script setup>
import AdminNavbar from '@/components/AdminNavbar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import apiClient from '@/axios-config';

const router = useRouter();
const isLoading = ref(false);
const imageError = ref(false);

const form = ref({
  code: '',
  product_name: '',
  brands: '',
  image_url: '',
  calories: 0,
  proteins: 0,
  carbs: 0,
  fat: 0,
  sugar: 0,
  sodium: 0
});

const submitProduct = async () => {
  if (!form.value.code || !form.value.product_name) {
    toast.error('Data Tidak Lengkap', {
      description: 'Barcode dan Nama Produk wajib diisi!'
    });
    return;
  }

  isLoading.value = true;
  try {
    // Ensure proper data types and clean values
    const payload = {
      code: String(form.value.code || '').trim(),
      product_name: String(form.value.product_name || '').trim(),
      brands: String(form.value.brands || '').trim(),
      image_url: String(form.value.image_url || '').trim(),
        calories: Number(form.value.calories) || 0,
      proteins: Number(form.value.proteins) || 0,
      carbs: Number(form.value.carbs) || 0,
      fat: Number(form.value.fat) || 0,
      sugar: Number(form.value.sugar) || 0,
      sodium: Number(form.value.sodium) || 0
    };

    console.log('[FRONTEND] Sending payload to backend:', payload);
    console.log('[FRONTEND] calories value:', payload.calories);
    console.log('[FRONTEND] image_url value:', payload.image_url);
    console.log('[FRONTEND] sodium value:', payload.sodium);

    const response = await apiClient.post('/api/products', payload);
    console.log('[FRONTEND] Server response:', response.data);

    // Show debug info if available
    if (response.data.debug) {
      console.log('[FRONTEND] Debug info from server:', response.data.debug);
    }

    toast.success('Berhasil Disimpan!', {
      description: `Produk "${form.value.product_name}" berhasil ditambahkan ke database.`
    });

    // Reset Form
    form.value = {
      code: '',
      product_name: '',
      brands: '',
      image_url: '',
      calories: 0,
      proteins: 0,
      carbs: 0,
      fat: 0,
      sugar: 0,
      sodium: 0
    };
    imageError.value = false;

    // Redirect after success
    setTimeout(() => router.push('/admin'), 1500);

  } catch (error) {
    console.error('❌ [FRONTEND ERROR]', error);
    const msg = error.response?.data?.msg || 'Gagal menyimpan produk. Silakan coba lagi.';
    toast.error('Terjadi Kesalahan', { description: msg });
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
