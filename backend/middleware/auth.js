

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Ambil token dari header permintaan
  const token = req.header('Authorization')?.split(' ')[1];

  // 2. Jika tidak ada token, tolak akses
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, tidak ada token.' });
  }

  // 3. Jika ada token, verifikasi kebenarannya
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Jika token valid, lampirkan info pengguna ke object request
    req.user = decoded.user;
    next(); // Lanjutkan ke loket tujuan
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid.' });
  }
};