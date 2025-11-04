import axios from 'axios';
import { Capacitor } from '@capacitor/core';

// Fungsi untuk mendeteksi platform dan memilih URL yang benar
const getBaseUrl = () => {
  if (Capacitor.isNativePlatform()) {
    // Jika berjalan di Emulator atau HP asli
    return 'http://10.0.2.2:3000';
  } else {
    // Jika berjalan di browser web biasa
    return 'http://localhost:3000';
  }
};

const apiClient = axios.create({
  baseURL: getBaseUrl()
});

// Fungsi helper untuk mendapatkan Supabase token dari localStorage
const getSupabaseToken = () => {
  try {
    // Supabase menyimpan session di localStorage dengan key yang dimulai dengan 'sb-'
    // Cari semua keys yang dimulai dengan 'sb-' dan berisi '-auth-token'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('sb-') && key.includes('-auth-token')) {
        const sessionData = localStorage.getItem(key);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          const token = parsed?.access_token || null;

          // Log untuk debugging (hapus di production)
          if (token) {
            console.log('✅ Supabase token found:', token.substring(0, 20) + '...');
          } else {
            console.warn('⚠️ Supabase session found but no access_token');
          }

          return token;
        }
      }
    }

    console.warn('⚠️ No Supabase session found in localStorage');
    return null;
  } catch (error) {
    console.error('❌ Error reading Supabase token from localStorage:', error);
    return null;
  }
};

// Interceptor untuk menambahkan token Supabase ke setiap request
apiClient.interceptors.request.use((config) => {
  // Ambil token dari localStorage (format Supabase)
  const token = getSupabaseToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('📤 Request:', config.method?.toUpperCase(), config.url, '(with auth token)');
  } else {
    console.log('📤 Request:', config.method?.toUpperCase(), config.url, '(no auth token)');
  }

  return config;
}, (error) => {
  console.error('❌ Request interceptor error:', error);
  return Promise.reject(error);
});

// Interceptor untuk handle error 401 (Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized: Token mungkin sudah expired atau tidak valid');
      console.error('Request URL:', error.config?.url);
      console.error('Request Headers:', error.config?.headers);

      // Optional: Redirect ke halaman login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
