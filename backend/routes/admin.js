const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Cek Login
const admin = require('../middleware/admin'); // Cek Role Admin
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// @route   GET /api/admin/stats
// @desc    Ambil statistik dashboard (Total User, dll)
router.get('/stats', auth, admin, async (req, res) => {
  try {
    //Hitung Total User dari tabel profiles
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (userError) throw userError;

    res.json({
      totalUsers: userCount || 0,
      totalProducts: "4 Juta+", // Hardcode sesuai request, atau ambil dari MongoDB
      totalArticles: 0 // Placeholder
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/users
// @desc    Ambil daftar semua pengguna
router.get('/users', auth, admin, async (req, res) => {
  try {
    // Ambil data user: nama, email (kalau ada di profile), role
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error.message); 
      throw error;
    }

    res.json(data);
  } catch (err) {
    console.error("Route Error:", err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;