import axios from 'axios';

// Base URL untuk backend
const getBaseUrl = () => {
  return 'https://192.168.1.15:3000';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 10 detik timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fungsi helper untuk mendapatkan Supabase token dari localStorage
const getSupabaseToken = () => {
  try {
    // Pastikan localStorage tersedia
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    // Supabase menyimpan session di localStorage dengan key yang dimulai dengan 'sb-'
    // Cari semua keys yang dimulai dengan 'sb-' dan berisi '-auth-token'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('sb-') && key.includes('-auth-token')) {
        const sessionData = localStorage.getItem(key);
        if (sessionData) {
          try {
            const parsed = JSON.parse(sessionData);
            const token = parsed?.access_token || null;

            // Log untuk debugging (hapus di production)
            if (token) {
              console.log('✅ Supabase token found');
            } else {
              console.warn('⚠️ Supabase session found but no access_token');
            }

            return token;
          } catch (parseError) {
            console.error('❌ Error parsing session data:', parseError);
            continue;
          }
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
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (format Supabase)
    const token = getSupabaseToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Request:', config.method?.toUpperCase(), config.url, '(with auth token)');
    } else {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url, '(no auth token)');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response dan error
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('❌ Network Error:', error.message);
      console.error('Pastikan backend sudah running dan URL sudah benar');
      return Promise.reject({
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        originalError: error
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized: Token mungkin sudah expired atau tidak valid');
      console.error('Request URL:', error.config?.url);


    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('❌ Forbidden: Anda tidak memiliki akses ke resource ini');
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('❌ Server Error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
