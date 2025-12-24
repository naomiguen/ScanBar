const express = require('express');
const ProductRequest = require('../models/ProductRequest');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// @route   GET /api/admin/product-requests
// @desc    Ambil semua product request dengan status pending
// @access  Private + Admin
router.get('/product-requests', auth, admin, async (req, res) => {
  try {
    const { status } = req.query;
    
    console.log(' [ADMIN] Fetching product requests');
    console.log('   - Filter status:', status || 'all');
    
    const query = status ? { status } : {};
    
    const requests = await ProductRequest.find(query)
      .sort({ lastAttemptDate: -1, createdAt: -1 })
      .limit(100);
    
    console.log('   - Found requests:', requests.length);
    
    res.json(requests);
  } catch (err) {
    console.error(' [ADMIN] Error fetching requests:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/admin/product-requests/count
// @desc    Hitung jumlah product request pending (untuk badge notifikasi)
// @access  Private + Admin
router.get('/product-requests/count', auth, admin, async (req, res) => {
  try {
    const count = await ProductRequest.countDocuments({ status: 'pending' });
    res.json({ count });
  } catch (err) {
    console.error('Error counting product requests:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/admin/product-requests/:id/status
// @desc    Update status product request (processing, completed, rejected)
// @access  Private + Admin
router.put('/product-requests/:id/status', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const validStatuses = ['pending', 'processing', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Status tidak valid' });
    }
    
    const updateData = {
      status,
      adminNotes: adminNotes || ''
    };
    
    if (status === 'completed' || status === 'rejected') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.user.id;
    }
    const request = await ProductRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('requestedBy', 'name email');
    
    if (!request) {
      return res.status(404).json({ msg: 'Request tidak ditemukan' });
    }
    
    res.json({ msg: 'Status berhasil diupdate', request });
  } catch (err) {
    console.error('Error updating product request status:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   DELETE /api/admin/product-requests/:id
// @desc    Hapus product request
// @access  Private + Admin
router.delete('/product-requests/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await ProductRequest.findByIdAndDelete(id);
    
    if (!request) {
      return res.status(404).json({ msg: 'Request tidak ditemukan' });
    }
    
    res.json({ msg: 'Request berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting product request:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/admin/product-requests/bulk-update
// @desc    Update multiple requests sekaligus (mark as completed after adding product)
// @access  Private + Admin
router.put('/product-requests/bulk-update', auth, admin, async (req, res) => {
  try {
    const { barcode, status = 'completed' } = req.body;
    
    if (!barcode) {
      return res.status(400).json({ msg: 'Barcode diperlukan' });
    }
    
    const normalizedBarcode = barcode.trim().replace(/\D/g, '');
    
    // Update semua request dengan barcode yang sama
    const result = await ProductRequest.updateMany(
      { barcode: normalizedBarcode, status: 'pending' },
      {
        status,
        resolvedAt: new Date(),
        resolvedBy: req.user.id,
        adminNotes: 'Product has been added to database'
      }
    );
    res.json({ 
      msg: `${result.modifiedCount} request(s) updated`,
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    console.error('Error bulk updating requests:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});


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


// @route   DELETE /api/admin/users/:id/permanent
// @desc    Hard Delete pengguna secara permanen dari database
router.delete('/users/:id/permanent', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Attempting to permanently delete user:', id);
    
    // Cek apakah user ada (termasuk yang sudah soft deleted)
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !user) {
      console.log('User not found:', id);
      return res.status(404).json({ 
        success: false, 
        msg: 'User tidak ditemukan' 
      });
    }
    
    console.log('User found:', user.email, 'Permanently deleting...');
    
    // Hard delete dari database (permanent delete)
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Delete error:', deleteError);
      throw deleteError;
    }
    
    console.log('User successfully deleted permanently:', id);
    
    return res.status(200).json({ 
      success: true, 
      msg: 'User berhasil dihapus permanen' 
    });
    
  } catch (error) {
    console.error('Error deleting user permanently:', error);
    return res.status(500).json({ 
      success: false, 
      msg: 'Gagal menghapus user: ' + error.message
    });
  }
});

module.exports = router;