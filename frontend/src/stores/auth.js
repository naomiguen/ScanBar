import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/supabaseClient';
import { toast } from 'vue-sonner';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const profile = ref(null);
  const role = ref('user');
  const isProfileLoaded = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => {
    const currentRole = String(role.value || '').trim().toLowerCase();
    console.log('🔍 isAdmin computed:', { role: role.value, trimmed: currentRole, result: currentRole === 'admin' });
    return currentRole === 'admin';
  });

  // Cek sesi login saat halaman di-refresh
  async function checkSession() {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user || null;

    // Kalau user login, otomatis ambil profilnya
    if (user.value) {
      await fetchUserProfile();
    } else {
      role.value = 'user';
      isProfileLoaded.value = true;
    }
  }

  // Update user state saat login/logout berubah
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
    if (session?.user) {
      fetchUserProfile();
    } else {
      profile.value = null;
      role.value = 'user';
      isProfileLoaded.value = false;
    }
  });

  //  Login
  async function login(credentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw error;

      user.value = data.user;
      await fetchUserProfile();

      // TAMBAHAN DEBUG
      console.log('=== AFTER LOGIN DEBUG ===');
      console.log('Login berhasil');
      console.log('role.value:', role.value);
      console.log('isAdmin.value:', isAdmin.value);
      console.log('typeof role.value:', typeof role.value);
      console.log('role === "admin":', role.value === 'admin');
      console.log('=========================');

      // Redirect ke route yang sesuai, router guard akan validasi
      const targetRoute = isAdmin.value ? '/admin' : '/';
      console.log('Attempting redirect to:', targetRoute);

      // Gunakan nextTick untuk pastikan state sudah ter-update sepenuhnya
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push(targetRoute);

      return true;
    } catch (error) {
      console.error('Login Error:', error.message);
      toast.error('Gagal Masuk:', {
        description: error.message || 'Email atau password salah.',
      });
      return false;
    }
  }

  //  Register
  async function register(credentials) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: { name: credentials.name },
          emailRedirectTo: `${window.location.origin}/`
        },
      });
      if (error) throw error;

      // Cek apakah user perlu verifikasi email
      const needsEmailVerification = data.user && !data.user.confirmed_at;

      if (needsEmailVerification) {
        toast.success('Berhasil Mendaftar!', {
          description: 'Silakan cek email Anda untuk verifikasi. Periksa folder Spam/Junk jika tidak menemukan email.',
          duration: 5000
        });
      } else {
        // Jika email confirmation dimatikan, buat profile langsung
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: credentials.email,
              name: credentials.name,
              role: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
            console.warn('Failed to create profile:', profileError.message);
          }
        }

        toast.success('Berhasil Mendaftar!', {
          description: 'Anda sudah bisa login sekarang.',
          duration: 4000
        });
      }

      return true;
    } catch (error) {
      console.error('Register Error:', error.message);
      toast.error('Pendaftaran Gagal:', {
        description: error.message,
      });
      return false;
    }
  }

  //  Logout
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Gagal Keluar:', {
        description: error.message
      });
      return false;
    }
    user.value = null;
    profile.value = null;
    role.value = 'user';
    isProfileLoaded.value = false;

    toast.success('Berhasil Logout', {
      description: 'Anda telah keluar dari akun',
      duration: 2000
    });

    router.push('/login');

    return true;
  }

  //  Update Profil
 //  Update Profil (PERBAIKAN)
async function updateProfile(dataToUpdate) {
  try {
    // 1. Update user metadata di Supabase Auth (opsional, untuk backward compatibility)
    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: dataToUpdate,
    });
    if (authError) throw authError;

    // 2. PENTING: Update juga ke table profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        age: dataToUpdate.age,
        weight: dataToUpdate.weight,
        height: dataToUpdate.height,
        daily_calorie_goal: dataToUpdate.dailyCalorieGoal,
        daily_protein_goal: dataToUpdate.dailyProteinGoal,
        daily_carbs_goal: dataToUpdate.dailyCarbsGoal,
        daily_fat_goal: dataToUpdate.dailyFatGoal,
        daily_sugar_goal: dataToUpdate.dailySugarGoal,
        daily_sodium_goal: dataToUpdate.dailySodiumGoal,
        daily_salt_goal: dataToUpdate.dailySaltGoal,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.value.id)
      .select()
      .single();

    if (profileError) throw profileError;

    // 3. Update state lokal
    user.value = authData.user;
    profile.value = profileData;

    toast.success('Berhasil!', {
      description: 'Profil Anda telah diperbarui.',
      duration: 2000
    });

    return profileData;
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    toast.error('Gagal', {
      description: 'Gagal memperbarui profil: ' + error.message
    });
    throw error;
  }
}

  // Fetch profil dari tabel "profiles"
  async function fetchUserProfile() {
    if (!user.value) {
      isProfileLoaded.value = true;
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .maybeSingle();

      //  Ignore error PGRST116 (data tidak ditemukan)
      if (error && error.code !== 'PGRST116') {
        console.warn('Gagal mengambil profil:', error.message);
        profile.value = null;
        role.value = 'user';
        isProfileLoaded.value = true;
        return null;
      }

      //  Jika data tidak ada, set profile null tapi jangan throw error
      if (!data) {
        console.warn('Profile belum dibuat untuk user:', user.value.id);
        profile.value = null;
        role.value = 'user';
        isProfileLoaded.value = true;
        return null;
      }

      profile.value = data;
      const rawRole = data.role || 'user';
      role.value = String(rawRole)
        .trim()
        .replace(/^['"]|['"]$/g, '') // Hapus tanda petik di awal/akhir
        .toLowerCase();
      isProfileLoaded.value = true;

      // DEBUG LOG - Lihat raw data
      console.log("=== FETCH PROFILE DEBUG ===");
      console.log("Raw role dari DB:", rawRole);
      console.log("Role setelah clean:", role.value);
      console.log("Role length:", role.value.length);
      console.log("isAdmin computed:", isAdmin.value);
      console.log("==========================");

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      profile.value = null;
      role.value = 'user';
      isProfileLoaded.value = true;
      return null;
    }
  }

  // Lupa Password
  async function forgotPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Forgot Password Error:', error.message);
      throw error;
    }
  }

  async function resetPassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Reset Password Error:', error.message);
      throw error;
    }
  }

  // Nama pengguna (fallback ke metadata/email)
  const userFullName = computed(() => {
    return (
      profile.value?.name ||
      user.value?.user_metadata?.name ||
      user.value?.email ||
      'Pengguna'
    );
  });

  //  Return semua fungsi
  return {
    user,
    profile,
    role,
    isAuthenticated,
    isAdmin,
    isProfileLoaded,
    checkSession,
    register,
    login,
    logout,
    fetchUserProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    userFullName,
  };
});
