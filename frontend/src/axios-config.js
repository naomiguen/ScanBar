
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

// Kita juga pindahkan logika penambahan token ke sini agar terpusat
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
