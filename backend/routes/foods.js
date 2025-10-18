

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Memanggil satpam kita
const Food = require('../models/Food');
const axios = require('axios');
const mongoose = require('mongoose');

// @route   POST /api/foods
// @desc    Menambah catatan makanan baru
// @access  Private (Dijaga oleh satpam 'auth')
router.post('/', auth, async (req, res) => {
  try {
    const { productName, calories, protein, carbs, fat, barcode } = req.body;

    const newFood = new Food({
      user: req.user.id, // ID pengguna didapat dari satpam (middleware)
      productName,
      calories,
      protein,
      carbs,
      fat,
      barcode
    });

    const food = await newFood.save();
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/foods
// @desc    Mendapatkan semua catatan makanan hari ini
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set ke awal hari

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Set ke awal hari besok

        const foods = await Food.find({
            user: req.user.id,
            date: { $gte: today, $lt: tomorrow } // Cari makanan antara hari ini dan besok
        }).sort({ date: -1 }); // Urutkan dari yang terbaru

        res.json(foods);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET /api/foods/barcode/:barcode
// @desc    Mencari produk berdasarkan barcode menggunakan Open Food Facts API
// @access  Private
router.get('/barcode/:barcode', async (req, res) => {
  const { barcode } = req.params;
  const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

  try {
    const response = await axios.get(apiUrl);
    
    // JIKA PRODUK TIDAK DITEMUKAN OLEH OPEN FOOD FACTS
    if (response.data.status === 0 || !response.data.product) {
      // Kirim pesan 404 yang jelas ke frontend
      return res.status(404).json({ message: 'Produk dengan barcode ini tidak ditemukan di database Open Food Facts.' });
    }

    const product = response.data.product;

    // Ekstrak dan rapikan data yang kita butuhkan
    const foodData = {
      productName: product.product_name || 'Nama tidak tersedia',
      calories: product.nutriments['energy-kcal_100g'] || 0,
      protein: product.nutriments.proteins_100g || 0,
      carbs: product.nutriments.carbohydrates_100g || 0,
      fat: product.nutriments.fat_100g || 0,
      imageUrl: product.image_url || '',
      barcode: barcode,
    };

    res.json(foodData);

  } catch (error) {
    // Ini hanya akan berjalan jika ada masalah jaringan, bukan jika produk tidak ditemukan
    console.error('Error saat menghubungi Open Food Facts API:', error.message);
    res.status(500).send('Server Error saat mencari data barcode.');
  }
});

// @route   DELETE /api/foods/:id
// @desc    Menghapus entri makanan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ msg: 'Makanan tidak ditemukan' });
    }
    // Pastikan pengguna yang menghapus adalah pemilik entri makanan
    if (food.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User tidak diotorisasi' });
    }
    await food.deleteOne();
    res.json({ msg: 'Makanan dihapus' });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/foods/summary
// @desc    Menghitung ringkasan nutrisi (harian, mingguan, bulanan)
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();

    //Harian
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    //Minggu (dimuali dari hari mingggu)
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - todayStart.getDay());

    //Bulanan
    const monthStart = new date(now.getFullYear(), now.getMonth(), 1);

    const calculateAverage = async (startDate) => {
      const result = await Food.aggregate([
        // 1. Filter makanan berdasarkan pengguna dan tanggal mulai
        { $match: { user: userId, date: { $gte: startDate } } },
        // 2. Kelompokkan berdasarkan hari untuk mendapatkan total harian
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            dailyCalories: { $sum: '$calories' },
            dailyProtein: { $sum: '$protein' },
            dailyCarbs: { $sum: '$carbs' },
            dailyFat: { $sum: '$fat' },
          },
        },
        // 3. Hitung rata-rata dari total harian tersebut
        {
          $group: {
            _id: null,
            avgCalories: { $avg: '$dailyCalories' },
            avgProtein: { $avg: '$dailyProtein' },
            avgCarbs: { $avg: '$dailyCarbs' },
            avgFat: { $avg: '$dailyFat' },
          },
        },
      ]);
      return result[0] || {}; // Kembalikan hasil atau objek kosong
    };
    // --- Hitung Semua Statistik ---
    const [todayResult, weeklyAvg, monthlyAvg] = await Promise.all([
      // Total hari ini
      Food.aggregate([
        { $match: { user: userId, date: { $gte: todayStart, $lte: todayEnd } } },
        { $group: {
            _id: null,
            totalCalories: { $sum: '$calories' },
            totalProtein: { $sum: '$protein' },
            totalCarbs: { $sum: '$carbs' },
            totalFat: { $sum: '$fat' },
          } 
        }
      ]),
      // Rata-rata mingguan
      calculateAverage(weekStart),
      // Rata-rata bulanan
      calculateAverage(monthStart),
    ]);

    const summary = {
      today: todayResult[0] || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
      weekly: {
        avgCalories: Math.round(weeklyAvg.avgCalories || 0),
        avgProtein: Math.round(weeklyAvg.avgProtein || 0),
        avgCarbs: Math.round(weeklyAvg.avgCarbs || 0),
        avgFat: Math.round(weeklyAvg.avgFat || 0),
      },
      monthly: {
        avgCalories: Math.round(monthlyAvg.avgCalories || 0),
        avgProtein: Math.round(monthlyAvg.avgProtein || 0),
        avgCarbs: Math.round(monthlyAvg.avgCarbs || 0),
        avgFat: Math.round(monthlyAvg.avgFat || 0),
      },
    };

    res.json(summary);
  } catch (err) {
    console.error('Summary Error:', err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;