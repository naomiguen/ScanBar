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
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/users/trash
// @desc    Ambil daftar pengguna yang sudah dihapus (Recycle Bin)
router.get('/users/trash', auth, admin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Trash Fetch Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/users/:id/restore
// @desc    Restore pengguna yang sudah dihapus (set deleted_at = NULL)
router.put('/users/:id/restore', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('profiles')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) throw error;

    console.log(`User ${id} restored successfully`);
    res.json({ msg: 'Pengguna berhasil dipulihkan!' });

  } catch (err) {
    console.error('Restore Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Soft Delete pengguna (Menandai deleted_at dengan waktu sekarang)
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

    const { error } = await supabase
      .from('profiles')
      .update({ deleted_at: new Date() }) 
      .eq('id', id);

    if (error) throw error;

    console.log(`User ${id} soft-deleted successfully`);
    res.json({ msg: 'Pengguna berhasil dinonaktifkan (Soft Delete)' });

  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;