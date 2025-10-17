import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import apiClient from '@/axios-config.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);
  const router = useRouter();

  const isAuthenticated = computed(() => !!token.value);

  async function register(credentials) {
    try {
      const response = await apiClient.post('/api/users/register', credentials);
      Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: response.data.message || 'Silakan cek email Anda untuk verifikasi.',
      });
      router.push('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan saat registrasi.',
      });
      console.error('Error registrasi:', error);
    }
  }

  async function login(credentials) {
    try {
      const response = await apiClient.post('/api/users/login', credentials);

      const data = response.data;
      token.value = data.token;
      user.value = data.user;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      Swal.fire({
        icon: 'success',
        title: `Selamat datang, ${data.user.name}!`,
        text: 'Anda berhasil login.',
        timer: 2000,
        showConfirmButton: false,
      });
      router.push('/dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: error.response?.data?.message || 'Email atau password salah.',
      });
      console.error('Error login:', error);
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    Swal.fire({
      icon: 'info',
      title: 'Logout Berhasil',
      text: 'Anda telah keluar dari akun.',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  async function saveUserGoals(goals) {
    try {
      const response = await apiClient.put('/api/users/goals', goals);
      user.value = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Target harian Anda berhasil disimpan.',
      });
      router.push('/dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menyimpan target harian Anda.',
      });
      console.error('Gagal menyimpan target:', error);
    }
  }

  async function forgotPassword(email) {
    try {
      const response = await apiClient.post('/api/users/forgotpassword', { email });
      Swal.fire({
        icon: 'success',
        title: 'Email Terkirim',
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan saat mencoba mengirim email reset.',
      });
    }
  }

  async function resetPassword({ token, password }) {
    try {
      const response = await apiClient.put(`/api/users/resetpassword/${token}`, { password });
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: response.data.message,
      });
      router.push('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || 'Token tidak valid atau sudah kedaluwarsa.',
      });
    }
  }

  async function updateProfile(dataToUpdate) {
    try {
      const response = await apiClient.put('/api/users/profile', dataToUpdate);
      // Perbarui state user lokal dengan data lengkap dari server
      user.value = response.data;
      localStorage.setItem('user', JSON.stringify(user.value));

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil Anda telah diperbarui.',
        timer: 2000,
        showConfirmButton: false
      });

      // Jika data yang diupdate adalah target kalori, arahkan ke dashboard
      if (dataToUpdate.dailyCalorieGoal) {
        router.push('/dashboard');
      }

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal memperbarui profil.' });
    }
  }

  async function fetchUserProfile() {
    try {
      const response = await apiClient.get('/api/users/profile');
      user.value = response.data;
      localStorage.setItem('user', JSON.stringify(user.value));
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }



  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
    saveUserGoals,
    forgotPassword,
    resetPassword,
    updateProfile,
    fetchUserProfile,
  };
});
