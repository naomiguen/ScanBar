const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

module.exports = async function (req, res, next) {
  // 1. Ambil token dari header permintaan
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  // 2. Jika tidak ada token, tolak akses
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, tidak ada token.' });
  }

  // 3. Verifikasi token
  try {
    // Decode token tanpa verifikasi dulu
    const decodedUnverified = jwt.decode(token, { complete: true });

    if (!decodedUnverified) {
      return res.status(401).json({ message: 'Token tidak valid.' });
    }

    // Cek apakah token berasal dari Supabase (issuer mengandung 'supabase')
    const issuer = decodedUnverified.payload.iss;
    const isSupabaseToken = issuer && issuer.includes('supabase');

    let decoded;

    if (isSupabaseToken) {
      const supabaseSecret = process.env.SUPABASE_JWT_SECRET;

      if (!supabaseSecret) {
        console.error('SUPABASE_JWT_SECRET is not set in environment variables.');
        return res.status(500).json({
          message: 'Server configuration error: Supabase secret is missing.'
        });
      }

      // Verifikasi token dengan secret Supabase
      decoded = jwt.verify(token, supabaseSecret, {
        algorithms: ['HS256'],
      });

      //  CEK APAKAH USER MASIH ADA DI DATABASE
      const userId = decoded.sub;
      
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Jika user tidak ditemukan atau sudah dihapus
      if (error || !user) {
        console.log('User not found or deleted:', userId);
        return res.status(401).json({ 
          message: 'Akun tidak ditemukan atau telah dihapus. Silakan login kembali.' 
        });
      }

      // Jika user sudah soft deleted
      if (user.deleted_at !== null) {
        console.log('User is soft deleted:', userId);
        return res.status(403).json({ 
          message: 'Akun Anda telah dinonaktifkan. Hubungi administrator.' 
        });
      }

      // Simpan data user ke request
      req.user = {
        _id: decoded.sub,
        id: decoded.sub,
        email: decoded.email,
        role: user.role || decoded.role, // Ambil role terbaru dari database
        ...decoded,
        profile: user // Simpan data profile lengkap
      };

      console.log('Supabase token verified for user:', decoded.email);

    } else {
      // Jika bukan token Supabase, gunakan JWT_SECRET lokal
      decoded = jwt.verify(token, process.env.JWT_SECRET);

      // CEK USER UNTUK LEGACY TOKEN
      const userId = decoded.user?.id || decoded.id;
      
      if (userId) {
        const { data: user, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error || !user || user.deleted_at !== null) {
          return res.status(401).json({ 
            message: 'Akun tidak ditemukan atau telah dihapus. Silakan login kembali.' 
          });
        }

        req.user = {
          ...decoded.user,
          ...decoded,
          _id: userId,
          id: userId,
          role: user.role,
          profile: user
        };
      } else {
        req.user = decoded.user || decoded;
        if (!req.user._id && req.user.id) {
          req.user._id = req.user.id;
        }
      }

      console.log('Legacy JWT token verified');
    }

    // Jika semua verifikasi sukses
    next();

  } catch (err) {
    console.error('Token verification failed:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token sudah expired, silakan login kembali.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token tidak valid.' });
    } else {
      return res.status(401).json({ message: 'Verifikasi token gagal.' });
    }
  }
};