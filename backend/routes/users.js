// backend/routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const auth = require('../middleware/auth');

// @route   POST /api/users/register
// @desc    Mendaftarkan pengguna baru & mengirim email verifikasi
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }
    user = new User({ name, email, password });
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    await user.save();
    try {
      const verifyURL = `http://localhost:3000/api/users/verifyemail/${verificationToken}`;
      const message = `
        <h1>Verifikasi Akun ScanBar</h1>
        <p>Terima kasih sudah mendaftar! Silakan klik link di bawah ini untuk mengaktifkan akun Anda:</p>
        <a href="${verifyURL}" target="_blank">Aktifkan Akun Saya</a>
      `;
      await sendEmail({ email: user.email, subject: 'Verifikasi Akun ScanBar', message });
      res.status(201).json({ message: 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.' });
    } catch (err) {
      console.log('--- ERROR DETAIL DARI NODEMAILER ---');
      console.log(err);
      console.log('------------------------------------');
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: 'Email verifikasi gagal dikirim.' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/verifyemail/:token
// @desc    Memverifikasi email pengguna
router.get('/verifyemail/:token', async (req, res) => {
  try {
    const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(400).send('<h1>Token verifikasi tidak valid atau sudah digunakan!</h1>');
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).send('<h1>Email berhasil diverifikasi!</h1><p>Anda sekarang bisa login ke aplikasi ScanBar.</p>');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/users/login
// @desc    Melakukan login pengguna
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Cari pengguna berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // 2. Bandingkan password yang diinput dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // 3. Cek apakah akun sudah diverifikasi
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Akun Anda belum diverifikasi. Silakan cek email Anda.' });
    }

    // 4. Jika semua benar, buat "tiket masuk" (JWT)
    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // Token berlaku selama 7 hari
      (err, token) => {
        if (err) throw err;
        // Return a safe user object (exclude password) so the frontend has goal fields immediately
        const userResponse = {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age || null,
          weight: user.weight || null,
          height: user.height || null,
          dailyCalorieGoal: typeof user.dailyCalorieGoal !== 'undefined' ? user.dailyCalorieGoal : 0,
          dailyProteinGoal: typeof user.dailyProteinGoal !== 'undefined' ? user.dailyProteinGoal : 0,
          dailyCarbsGoal: typeof user.dailyCarbsGoal !== 'undefined' ? user.dailyCarbsGoal : 0,
          dailyFatGoal: typeof user.dailyFatGoal !== 'undefined' ? user.dailyFatGoal : 0,
          dailySugarGoal: typeof user.dailySugarGoal !== 'undefined' ? user.dailySugarGoal : 0,
          dailySaltGoal: typeof user.dailySaltGoal !== 'undefined' ? user.dailySaltGoal : 0,
          isVerified: !!user.isVerified,
        };

        res.json({ token, user: userResponse });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   PUT /api/users/goals
// @desc    Update target nutrisi pengguna
// @access  Private
router.put('/goals', auth, async (req, res) => {
  try {
    const {
      dailyCalorieGoal,
      dailyProteinGoal,
      dailyCarbsGoal,
      dailyFatGoal,
      dailySugarGoal,
      dailySaltGoal,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    user.dailyCalorieGoal = dailyCalorieGoal;
    user.dailyProteinGoal = dailyProteinGoal;
    user.dailyCarbsGoal = dailyCarbsGoal;
    user.dailyFatGoal = dailyFatGoal;
    // baru: simpan target gula & garam
    if (typeof dailySugarGoal !== 'undefined') user.dailySugarGoal = dailySugarGoal;
    if (typeof dailySaltGoal !== 'undefined') user.dailySaltGoal = dailySaltGoal;

    await user.save();

    // Kirim kembali data user yang sudah di-update (tanpa password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      dailyCalorieGoal: user.dailyCalorieGoal,
      dailyProteinGoal: user.dailyProteinGoal,
      dailyCarbsGoal: user.dailyCarbsGoal,
      dailyFatGoal: user.dailyFatGoal,
      dailySugarGoal: user.dailySugarGoal || 0,
      dailySaltGoal: user.dailySaltGoal || 0,
    };

    res.json(userResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST /api/users/forgotpassword
// @desc    Meminta link reset password
router.post('/forgotpassword', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ message: 'Email untuk reset password telah dikirim.' });
    }

    //buat token reset password
    const resetToken = crypto.randomBytes(20).toString('hex');
    //SIMPAN HASIL HASH DI DATABASE
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 menit
    await user.save();

    //KIRIM EMAIL DENGAN LINK RESET
    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;
    const message = `<h1>Reset Password Akun ScanBar</h1><p>Anda menerima email ini karena ada permintaan untuk reset password. Silakan klik link di bawah ini untuk melanjutkan:</p><a href="${resetUrl}">Reset Password Saya</a><p>Link ini akan kedaluwarsa dalam 15 menit.</p>`;

    await sendEmail({
      email: user.email,
      subject: 'Reset Password Akun ScanBar',
      message
    });

    res.status(200).json({ message: 'Email untuk reset password telah dikirim.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// @route   POST /api/users/forgotpassword
// @desc    Meminta link reset password
router.post('/forgotpassword', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ message: 'Jika email terdaftar, link reset akan dikirim.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // --- PERUBAHAN 1: Simpan token ASLI, bukan hash-nya ---
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Kedaluwarsa dalam 15 menit
    await user.save();

    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;
    const message = `<h1>Reset Password Akun ScanBar</h1><p>Silakan klik link di bawah ini untuk melanjutkan:</p><a href="${resetUrl}">Reset Password Saya</a><p>Link ini akan kedaluwarsa dalam 15 menit.</p>`;
    
    await sendEmail({ email: user.email, subject: 'Permintaan Reset Password', message });
    res.status(200).json({ message: 'Jika email terdaftar, link reset akan dikirim.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/resetpassword/:token
// @desc    Menyimpan password baru
router.put('/resetpassword/:token', async (req, res) => {
    try {
        // --- PERUBAHAN 2: Cari user berdasarkan token ASLI dari URL ---
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password berhasil diubah.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//@route GET / api/users/profile
// @desc Mendapatkan profil pengguna
// @access Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password ');
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});

//@route PUT/api/users/profile
// @desc Memperbarui profil pengguna
// @access Private
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      age,
      weight,
      height,
      dailyCalorieGoal,
      dailyProteinGoal,
      dailyCarbsGoal,
      dailyFatGoal,
      dailySugarGoal,
      dailySaltGoal,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Buat objek berisi field yang akan diupdate
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (age) fieldsToUpdate.age = age;
    if (weight) fieldsToUpdate.weight = weight;
    if (height) fieldsToUpdate.height = height;
    if (typeof dailyCalorieGoal !== 'undefined') fieldsToUpdate.dailyCalorieGoal = dailyCalorieGoal;
    if (typeof dailyProteinGoal !== 'undefined') fieldsToUpdate.dailyProteinGoal = dailyProteinGoal;
    if (typeof dailyCarbsGoal !== 'undefined') fieldsToUpdate.dailyCarbsGoal = dailyCarbsGoal;
    if (typeof dailyFatGoal !== 'undefined') fieldsToUpdate.dailyFatGoal = dailyFatGoal;
    if (typeof dailySugarGoal !== 'undefined') fieldsToUpdate.dailySugarGoal = dailySugarGoal;
    if (typeof dailySaltGoal !== 'undefined') fieldsToUpdate.dailySaltGoal = dailySaltGoal;

    // Update pengguna dengan data baru
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;