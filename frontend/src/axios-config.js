import axios from 'axios';

/**
 * Get API base URL from environment or fallback to localhost
 * Priority: VITE_API_URL > VUE_APP_API_URL > localhost
 */
const getBaseUrl = () => {
  // Check Vite environment variable (for Vite projects)
  const viteUrl = import.meta.env?.VITE_API_URL;
  if (viteUrl && typeof viteUrl === 'string' && viteUrl.trim() !== '') {
    console.log('Using Vite API URL:', viteUrl);
    return viteUrl;
  }

  // Check Vue CLI environment variable (for Vue CLI projects)
  let vueUrl;
  if (typeof process !== 'undefined' && process && process.env && process.env.VUE_APP_API_URL) {
    vueUrl = process.env.VUE_APP_API_URL;
  }
  if (vueUrl && typeof vueUrl === 'string' && vueUrl.trim() !== '') {
    console.log('Using Vue CLI API URL:', vueUrl);
    return vueUrl;
  }

  // Default to localhost for development
  console.log('Using default localhost URL');
  return 'http://localhost:3000';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 60000, // 60 seconds timeout for AI analysis
  headers: {
    'Content-Type': 'application/json',
  },
  // Allow credentials for CORS
  withCredentials: false,
});

// HELPER FUNCTION: GET SUPABASE TOKEN

/**
 * Get Supabase authentication token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
const getSupabaseToken = () => {
  try {
    // Check if localStorage is available (browser environment)
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('⚠️ localStorage not available');
      return null;
    }

    // Supabase stores session with keys like: 'sb-{project-id}-auth-token'
    // Search for all keys that match this pattern
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.includes('sb-') && key.includes('-auth-token')) {
        const sessionData = localStorage.getItem(key);

        if (sessionData) {
          try {
            const parsed = JSON.parse(sessionData);
            const token = parsed?.access_token || null;

            if (token) {
              console.log('Supabase token found');
              return token;
            } else {
              console.warn('Supabase session found but no access_token');
            }
          } catch (parseError) {
            console.error('Error parsing session data:', parseError);
            continue; // Try next key
          }
        }
      }
    }

    console.warn('No Supabase session found in localStorage');
    return null;
  } catch (error) {
    console.error('Error reading Supabase token from localStorage:', error);
    return null;
  }
};
// REQUEST INTERCEPTOR: ADD AUTH TOKEN

// REQUEST INTERCEPTOR: ADD AUTH TOKEN

apiClient.interceptors.request.use(
  (config) => {
    // Get Supabase token from localStorage
    const token = getSupabaseToken();

    if (token) {
      // Add Bearer token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request:', config.method?.toUpperCase(), config.url, '(with auth token)');
    } else {
      console.log('Request:', config.method?.toUpperCase(), config.url, '(no auth token)');
    }

    // Log request payload size for debugging (useful for image uploads)
    if (config.data) {
      const dataStr = JSON.stringify(config.data);
      const dataSizeKB = (dataStr.length / 1024).toFixed(2);
      console.log(`Request payload size: ${dataSizeKB} KB`);
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: HANDLE SUCCESS & ERRORS

apiClient.interceptors.response.use(
  // SUCCESS HANDLER
  (response) => {
    console.log('Response:', response.config.method?.toUpperCase(), response.config.url, response.status);

    // Log response time if available
    if (response.config.metadata?.startTime) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(`Request duration: ${duration}ms`);
    }

    return response;
  },

  // ERROR HANDLER
  async (error) => {

    // 1. TIMEOUT ERROR (ECONNABORTED)

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error('⏰ Request timeout after 60 seconds');
      return Promise.reject({
        message: 'Analisis memakan waktu terlalu lama. Coba lagi dengan foto yang lebih sederhana atau pencahayaan lebih baik.',
        type: 'timeout',
        originalError: error
      });
    }

    // 2. NETWORK ERROR (No response from server)
    if (!error.response) {
      console.error('Network Error:', error.message);
      console.error('Pastikan:');
      console.error('   1. Backend sudah running');
      console.error('   2. URL sudah benar:', getBaseUrl());
      console.error('   3. Koneksi internet stabil');

      return Promise.reject({
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        type: 'network',
        originalError: error
      });
    }

    // 3. HTTP ERROR RESPONSES

    const status = error.response?.status;
    const url = error.config?.url;

    console.error(`HTTP Error ${status}:`, url);

    // 400 Bad Request
    if (status === 400) {
      console.error('Bad Request:', error.response.data);
      return Promise.reject({
        message: error.response.data?.message || 'Data yang dikirim tidak valid',
        type: 'bad_request',
        details: error.response.data,
        originalError: error
      });
    }

    // 401 Unauthorized
    if (status === 401) {
      console.error('Unauthorized: Token tidak valid atau sudah expired');
      console.error('User perlu login ulang');

      // Optionally: Clear localStorage and redirect to login
      // localStorage.clear();
      // window.location.href = '/login';

      return Promise.reject({
        message: 'Sesi Anda telah berakhir. Silakan login kembali.',
        type: 'unauthorized',
        originalError: error
      });
    }

    // 403 Forbidden
    if (status === 403) {
      console.error('Forbidden: Anda tidak memiliki akses ke resource ini');
      return Promise.reject({
        message: 'Anda tidak memiliki izin untuk mengakses resource ini.',
        type: 'forbidden',
        originalError: error
      });
    }

    // 404 Not Found
    if (status === 404) {
      console.error('Not Found:', url);
      return Promise.reject({
        message: 'Resource tidak ditemukan.',
        type: 'not_found',
        originalError: error
      });
    }

    // 413 Payload Too Large
    if (status === 413) {
      console.error('Payload Too Large: File terlalu besar');
      return Promise.reject({
        message: 'Ukuran file terlalu besar. Coba kompres gambar terlebih dahulu.',
        type: 'payload_too_large',
        originalError: error
      });
    }

    // 429 Too Many Requests (Rate Limit)
    if (status === 429) {
      console.error('🚦 Rate Limit: Terlalu banyak request');
      return Promise.reject({
        message: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.',
        type: 'rate_limit',
        originalError: error
      });
    }

    // 500 Internal Server Error
    if (status === 500) {
      console.error('💥 Server Error:', error.response.data);
      return Promise.reject({
        message: error.response.data?.message || 'Terjadi kesalahan pada server. Silakan coba lagi.',
        type: 'server_error',
        details: error.response.data,
        originalError: error
      });
    }

    // 503 Service Unavailable
    if (status === 503) {
      console.error('🔧 Service Unavailable: Server sedang maintenance');
      return Promise.reject({
        message: 'Layanan sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.',
        type: 'service_unavailable',
        originalError: error
      });
    }

    // 4. GENERIC ERROR FALLBACK

    console.error('❓ Unknown Error:', error);
    return Promise.reject({
      message: error.response?.data?.message || error.message || 'Terjadi kesalahan. Silakan coba lagi.',
      type: 'unknown',
      status: status,
      originalError: error
    });
  }
);

// ADD REQUEST TIMESTAMP (for duration tracking)

apiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: Date.now() };
    return config;
  }
);

export default apiClient;
export { getSupabaseToken, getBaseUrl };
