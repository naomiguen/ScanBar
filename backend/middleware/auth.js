const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
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

      // Simpan data user ke request
      req.user = {
        _id: decoded.sub,
        id: decoded.sub, // ID user dari Supabase (field 'sub')
        email: decoded.email,
        role: decoded.role,
        ...decoded
      };

      console.log('Supabase token verified for user:', decoded.email);

    } else {
      // Jika bukan token Supabase, gunakan JWT_SECRET lokal
      decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Simpan user dari token ke req.user
      req.user = decoded.user || decoded;
      if (!req.user._id && req.user.id) {
        req.user._id = req.user.id;
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
