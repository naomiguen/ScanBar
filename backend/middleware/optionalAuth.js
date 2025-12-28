require('dotenv').config();

const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function (req, res, next) {
  // 1. Ambil token dari header permintaan
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  // 2. Jika tidak ada token, lanjutkan sebagai guest
  if (!token) {
    console.log('[OPTIONAL AUTH] No token provided, continuing as guest');
    req.user = null;
    return next();
  }

  // 3. Verifikasi token (tidak wajib valid)
  try {
    // Decode token tanpa verifikasi dulu
    const decodedUnverified = jwt.decode(token, { complete: true });

    if (!decodedUnverified) {
      console.log('[OPTIONAL AUTH] Invalid token format, continuing as guest');
      req.user = null;
      return next();
    }

    // Cek apakah token berasal dari Supabase
    const issuer = decodedUnverified.payload.iss;
    const isSupabaseToken = issuer && issuer.includes('supabase');

    let decoded;

    if (isSupabaseToken) {
      const supabaseSecret = process.env.SUPABASE_JWT_SECRET;

      if (!supabaseSecret) {
        console.error('[OPTIONAL AUTH] SUPABASE_JWT_SECRET is not set');
        req.user = null;
        return next();
      }

      // Verifikasi token dengan secret Supabase
      decoded = jwt.verify(token, supabaseSecret, {
        algorithms: ['HS256'],
      });

      // CEK APAKAH USER MASIH ADA DI DATABASE
      const userId = decoded.sub;
      
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Jika user tidak ditemukan atau sudah dihapus
      if (error || !user) {
        console.log('[OPTIONAL AUTH] User not found or deleted:', userId);
        req.user = null;
        return next();
      }

      // Jika user sudah soft deleted
      if (user.deleted_at !== null) {
        console.log('[OPTIONAL AUTH] User is soft deleted:', userId);
        req.user = null;
        return next();
      }

      // Simpan data user ke request
      req.user = {
        _id: decoded.sub,
        id: decoded.sub,
        email: decoded.email,
        name: user.name || user.email,
        role: user.role || decoded.role,
        ...decoded,
        profile: user
      };

      console.log('[OPTIONAL AUTH] Supabase token verified for user:', decoded.email);

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
          console.log('[OPTIONAL AUTH] Legacy user not found or deleted');
          req.user = null;
          return next();
        }

        req.user = {
          ...decoded.user,
          ...decoded,
          _id: userId,
          id: userId,
          name: user.name || user.email,
          role: user.role,
          profile: user
        };
      } else {
        req.user = decoded.user || decoded;
        if (!req.user._id && req.user.id) {
          req.user._id = req.user.id;
        }
      }

      console.log('[OPTIONAL AUTH] Legacy JWT token verified');
    }

    // Jika semua verifikasi sukses
    next();

  } catch (err) {
    // Jika token invalid atau expired, lanjutkan sebagai guest
    console.log('[OPTIONAL AUTH] Token verification failed, continuing as guest:', err.message);
    req.user = null;
    next();
  }
};