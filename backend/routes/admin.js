const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// @route   GET /api/admin/stats
// @desc    Ambil statistik dashboard (Total User, dll)
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (userError) throw userError;

    const { count: articleCount, error: articleError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    const totalArticles = articleError ? 0 : (articleCount || 0);

    res.json({
      totalUsers: userCount || 0,
      totalProducts: "4 Juta+",
      totalArticles: totalArticles
    });
  } catch (err) {
    console.error('Stats Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/users
// @desc    Ambil daftar semua pengguna dengan metadata tambahan
router.get('/users', auth, admin, async (req, res) => {
  try {
    // Gunakan RPC function
    const { data, error } = await supabase
      .rpc('admin_get_users_with_metadata');

    if (error) {
      console.error('❌ RPC Error:', error.message);
      throw error;
    }

    console.log(`✅ Fetched ${data.length} users via RPC`);
    if (data.length > 0) {
      console.log('Sample user:', {
        email: data[0].email,
        calories: data[0].daily_calorie_goal,
        protein: data[0].daily_protein_goal
      });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Route Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Hapus pengguna berdasarkan ID
router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', id)
      .single();

    if (targetUser && targetUser.role === 'admin') {
      return res.status(403).json({ msg: 'TIDAK BOLEH menghapus sesama Admin!' });
    }

    // Hapus dari profiles
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    console.log(` User ${id} deleted successfully`);
    res.json({ msg: 'Pengguna berhasil dihapus' });

  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
