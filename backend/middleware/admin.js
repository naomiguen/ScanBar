const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function (req, res, next) {
  try {
    // User ID didapat dari middleware 'auth' sebelumnya
    const userId = req.user.id;

    // Cek ke database: Apa rolenya?
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.status(403).json({ msg: 'Akses ditolak. Profil tidak ditemukan.' });
    }

    if (data.role !== 'admin') {
      return res.status(403).json({ msg: 'Akses ditolak. Anda bukan Admin.' });
    }

    // Jika admin, gass
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error pada Admin Middleware');
  }
};