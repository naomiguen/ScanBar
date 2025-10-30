import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/supabaseClient';
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const profile = ref(null); // ✅ tambahan untuk data profil dari tabel

  const isAuthenticated = computed(() => !!user.value);

  // ✅ Cek sesi login saat halaman di-refresh
  async function checkSession() {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user || null;

    // Kalau user login, otomatis ambil profilnya
    if (user.value) {
      await fetchUserProfile();
    }
  }

  // ✅ Update user state saat login/logout berubah
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
    if (session?.user) {
      fetchUserProfile();
    } else {
      profile.value = null;
    }
  });

  // ✅ Login
  async function login(credentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw error;

      user.value = data.user;
      await fetchUserProfile();
      return true;
    } catch (error) {
      console.error('Login Error:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Masuk',
        text: error.message || 'Email atau password salah.',
      });
      return false;
    }
  }

  // ✅ Register
  async function register(credentials) {
    try {
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: { data: { name: credentials.name } },
      });
      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Berhasil Mendaftar!',
        text: 'Silakan verifikasi email Anda sebelum login.',
      });

      return true;
    } catch (error) {
      console.error('Register Error:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Pendaftaran Gagal',
        text: error.message,
      });
      return false;
    }
  }

  // ✅ Logout
  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      user.value = null;
      profile.value = null;
      return true;
    } catch (error) {
      console.error('Logout Error:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Keluar',
        text: error.message,
      });
      return false;
    }
  }

  // ✅ Update Profil
  async function updateProfile(dataToUpdate) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: dataToUpdate,
      });
      if (error) throw error;

      user.value = data.user;
      await fetchUserProfile(); // setelah update, ambil ulang profil
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil Anda telah diperbarui.',
      });
    } catch (error) {
      console.error('Update Profile Error:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memperbarui profil.',
      });
    }
  }

  // ✅ Fetch profil dari tabel "profiles"
  async function fetchUserProfile() {
    if (!user.value) return;

    const { data, error } = await supabase
      .from('profiles') // pastikan tabel ini ada di Supabase
      .select('*')
      .eq('id', user.value.id)
      .single();

    if (error) {
      console.warn('Gagal mengambil profil:', error.message);
      profile.value = null;
      return null;
    }

    profile.value = data;
    return data;
  }

  // ✅ Lupa Password
  async function forgotPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    });

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Email Terkirim',
        text: 'Silakan cek email Anda untuk reset password.',
      });
    }
  }

  // ✅ Nama pengguna (fallback ke metadata/email)
  const userFullName = computed(() => {
    return (
      profile.value?.name ||
      user.value?.user_metadata?.name ||
      user.value?.email ||
      'Pengguna'
    );
  });

  // ✅ Return semua fungsi
  return {
    user,
    profile,
    isAuthenticated,
    checkSession,
    register,
    login,
    logout,
    fetchUserProfile,
    updateProfile,
    forgotPassword,
    userFullName,
  };
});
