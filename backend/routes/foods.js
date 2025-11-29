const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Food = require('../models/Food');
const DailyAnalysis = require('../models/DailyAnalysis'); // ← IMPORT MODEL BARU
const axios = require('axios');
const mongoose = require('mongoose');
const util = require('util');
const { generateHeuristicAnalysis } = require('../utils/heuristic');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const preferredModel = process.env.GENERATIVE_MODEL || 'gemini-2.5-flash';
let model;
try {
  model = genAI.getGenerativeModel({ model: preferredModel });
} catch (e) {
  console.error(`Failed to initialize generative model '${preferredModel}':`, e.message || e);
  try {
    model = genAI.getGenerativeModel({ model: 'text-bison-001' });
  } catch (err) {
    console.error('Failed to initialize fallback generative model text-bison-001:', err.message || err);
    model = null;
  }
}


// Helper: clean possible code-fence wrappers and try to parse JSON from model output
function cleanAndParseAnalysisText(analysisText) {
  if (typeof analysisText !== 'string') return analysisText;

  let text = analysisText.replace(/\r/g, '').trim();

  const fenceMatch = text.match(/```(?:json|js|javascript)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    text = fenceMatch[1].trim();
  } else {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.slice(firstBrace, lastBrace + 1).trim();
    }
  }

  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    return text;
  }
}

// Helper: Mendapatkan start of day (00:00:00) untuk timezone lokal
function getStartOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper: Mendapatkan end of day (23:59:59) untuk timezone lokal
function getEndOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Helper: Invalidasi cache analisis harian
async function invalidateDailyCache(userId) {
  try {
    const today = getStartOfDay();
    const result = await DailyAnalysis.findOneAndDelete({
      user: userId,
      date: today
    });
    if (result) {
      console.info(`[cache] invalidated daily analysis cache for user ${userId}`);
    }
  } catch (err) {
    console.error('[cache] failed to invalidate cache:', err.message);
    // Non-blocking error - jangan throw
  }
}


// @route   GET /api/foods/analysis/today
// @desc    Mendapatkan analisis AI harian dengan smart caching
// @access  Private
router.get('/analysis/today', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getStartOfDay();
    
    console.info(`[analysis] request from user ${userId} for date ${today.toISOString()}`);

    // 1. CEK CACHE: Apakah sudah ada analisis hari ini?
    const cachedAnalysis = await DailyAnalysis.findOne({
      user: userId,
      date: today
    });

    if (cachedAnalysis) {
      console.info(`[analysis] CACHE HIT for user ${userId}`);
      return res.json({
        analysis: cachedAnalysis.analysisText,
        cached: true,
        generatedAt: cachedAnalysis.createdAt
      });
    }

    console.info(`[analysis] CACHE MISS for user ${userId} - generating new analysis`);

    // 2. CACHE MISS: Ambil data makanan hari ini
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    const foods = await Food.find({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd }
    }).sort({ date: -1 });

    // 3. Jika tidak ada makanan hari ini
    if (foods.length === 0) {
      const emptyMessage = {
        summary: "Belum ada data makanan untuk hari ini.",
        risks: [],
        warnings: ["Mulai catat makanan Anda untuk mendapatkan analisis nutrisi"],
        dietSuitability: "Data tidak cukup untuk analisis",
        recommendations: [
          "Tambahkan makanan pertama Anda hari ini",
          "Scan barcode produk atau input manual"
        ],
        disclaimer: "Ini bukan pengganti nasihat medis profesional."
      };

      // Simpan ke cache juga
      const newAnalysis = new DailyAnalysis({
        user: userId,
        date: today,
        analysisText: JSON.stringify(emptyMessage)
      });
      await newAnalysis.save();

      return res.json({
        analysis: emptyMessage,
        cached: false,
        generatedAt: new Date()
      });
    }

    // 4. Hitung total nutrisi
    const totals = foods.reduce((acc, food) => ({
      calories: acc.calories + (food.calories || 0),
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fat: acc.fat + (food.fat || 0),
      sugar: acc.sugar + (food.sugar || 0),
      salt: acc.salt + (food.salt || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, salt: 0 });

    // 5. Susun daftar makanan untuk prompt
    const foodList = foods.map((f, idx) => 
      `${idx + 1}. ${f.productName} (${f.calories} kcal, P:${f.protein}g, C:${f.carbs}g, F:${f.fat}g, Gula:${f.sugar}g, Garam:${f.salt}g)`
    ).join('\n');

    // 6. PANGGIL GEMINI AI
    if (!model) {
      console.warn('[analysis] AI model not initialized, using heuristic fallback');
      const heuristic = generateHeuristicAnalysis(
        'Ringkasan Harian',
        totals.calories,
        totals.protein,
        totals.carbs,
        totals.fat,
        totals.sugar,
        totals.salt
      );

      // Simpan heuristic ke cache
      const newAnalysis = new DailyAnalysis({
        user: userId,
        date: today,
        analysisText: JSON.stringify(heuristic)
      });
      await newAnalysis.save();

      return res.json({
        analysis: heuristic,
        cached: false,
        generatedAt: new Date()
      });
    }

    const prompt = `
      Anda adalah ahli gizi profesional di Indonesia. Analisis konsumsi produk makanan/minuman KEMASAN yang telah di-scan pengguna hari ini.
      
      PENTING: Ini adalah produk KEMASAN yang di-scan barcode-nya, bukan makanan yang dimasak sendiri.
      
      PRODUK KEMASAN YANG DIKONSUMSI HARI INI:
      ${foodList}
      
      TOTAL NUTRISI DARI SEMUA PRODUK KEMASAN:
      - Kalori: ${totals.calories} kcal
      - Protein: ${totals.protein} g
      - Karbohidrat: ${totals.carbs} g
      - Lemak: ${totals.fat} g
      - Gula: ${totals.sugar} g
      - Garam: ${totals.salt} g
      
      Berikan analisis dalam format JSON dengan struktur berikut:
      {
        "summary": "Ringkasan pola konsumsi produk kemasan hari ini (2-3 kalimat). Sebutkan apakah terlalu banyak makanan ultra-processed, tinggi gula/garam, atau sudah cukup seimbang.",
        "risks": ["Risiko dari konsumsi produk kemasan berlebih", "Risiko spesifik dari kandungan tinggi (gula/garam/lemak)", "Risiko kesehatan jangka panjang"],
        "warnings": ["Peringatan tentang konsumsi produk kemasan", "Peringatan khusus jika ada nutrisi berlebih"],
        "dietSuitability": "Evaluasi: apakah produk-produk ini cocok untuk diet sehat? Apakah terlalu banyak processed food? (1-2 kalimat)",
        "recommendations": ["Saran produk kemasan yang LEBIH SEHAT (misal: air mineral, yogurt plain, kacang tanpa garam)", "Saran untuk menyeimbangkan dengan makanan segar/whole foods"],
        "disclaimer": "Analisis ini berdasarkan produk kemasan yang di-scan dan bukan pengganti nasihat medis profesional."
      }
      
      PETUNJUK KHUSUS UNTUK PRODUK KEMASAN:
      - Fokus pada fakta bahwa ini adalah produk ultra-processed/kemasan
      - Bandingkan dengan pedoman: maks 2000 kcal, gula <50g, garam <2000mg per hari
      - Jika banyak produk tinggi gula/garam (snack, minuman manis, mie instan), beri peringatan tegas
      - Rekomendasikan alternatif kemasan yang LEBIH SEHAT atau saran untuk menambah makanan segar
      - Ingatkan dampak jangka panjang konsumsi processed food berlebihan (obesitas, diabetes, hipertensi)
      - Gunakan bahasa yang ramah tapi jujur tentang kualitas produk kemasan
      - Jika ada produk yang relatif sehat (misal: susu, yogurt, kacang), apresiasi itu
      
      Kembalikan HANYA objek JSON, tanpa teks tambahan.
    `;

    console.info(`[analysis] invoking Gemini AI for user ${userId}`);
    
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (genErr) {
      console.error('[analysis] Gemini API error:', genErr.message);
      // Fallback ke heuristic jika Gemini gagal
      const heuristic = generateHeuristicAnalysis(
        'Ringkasan Harian',
        totals.calories,
        totals.protein,
        totals.carbs,
        totals.fat,
        totals.sugar,
        totals.salt
      );

      const newAnalysis = new DailyAnalysis({
        user: userId,
        date: today,
        analysisText: JSON.stringify(heuristic)
      });
      await newAnalysis.save();

      return res.json({
        analysis: heuristic,
        cached: false,
        generatedAt: new Date(),
        fallback: true
      });
    }

    // 7. Parse response dari Gemini
    let analysisText = '';
    if (result?.response?.text) {
      analysisText = result.response.text();
    } else if (typeof result === 'string') {
      analysisText = result;
    } else if (result?.output) {
      analysisText = Array.isArray(result.output) ? result.output.join('\n') : String(result.output);
    } else {
      analysisText = JSON.stringify(result);
    }

    const cleaned = cleanAndParseAnalysisText(analysisText);
    
    // 8. SIMPAN KE CACHE
    const newAnalysis = new DailyAnalysis({
      user: userId,
      date: today,
      analysisText: typeof cleaned === 'object' ? JSON.stringify(cleaned) : cleaned
    });
    await newAnalysis.save();

    console.info(`[analysis] successfully generated and cached analysis for user ${userId}`);

    return res.json({
      analysis: cleaned,
      cached: false,
      generatedAt: newAnalysis.createdAt
    });

  } catch (err) {
    console.error('[analysis] error:', err.message);
    res.status(500).json({ 
      error: 'Gagal mengambil analisis harian',
      message: err.message 
    });
  }
});


// @route   POST /api/foods
// @desc    Menambah catatan makanan baru ke jurnal pribadi
// @access  Private (Dijaga oleh satpam 'auth')
router.post('/', auth, async (req, res) => {
  try {
    const { productName, calories, protein, carbs, fat, sugar, salt, imageUrl, barcode } = req.body;

    const newFood = new Food({
      user: req.user.id,
      productName,
      calories,
      protein,
      carbs,
      fat,
      sugar,
      salt,
      imageUrl,
      barcode
    });

    const food = await newFood.save();
    
    // ← INVALIDASI CACHE setelah menambah makanan
    await invalidateDailyCache(req.user.id);
    
    res.json(food);
  } catch (err) {
    console.error('Add Food Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/foods/:id
// @desc    Menghapus entri makanan dari jurnal pribadi
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ msg: 'Makanan tidak ditemukan' });
    }
    
    if (food.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User tidak diotorisasi' });
    }
    
    await food.deleteOne();
    
    // ← INVALIDASI CACHE setelah menghapus makanan
    await invalidateDailyCache(req.user.id);
    
    res.json({ msg: 'Makanan dihapus' });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).send('Server Error');
  }
});



// @route   GET /api/foods
// @desc    Mendapatkan semua catatan makanan hari ini (jurnal pribadi)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const foods = await Food.find({
            user: req.user.id,
            date: { $gte: today, $lt: tomorrow }
        }).sort({ date: -1 });

        res.json(foods);
    } catch (err) {
        console.error('Get Foods Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/foods/summary
// @desc    Menghitung ringkasan nutrisi (harian, mingguan, bulanan) - jurnal pribadi
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - todayStart.getDay());

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const calculateAverage = async (startDate) => {
      const result = await Food.aggregate([
        { $match: { user: userId, date: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            dailyCalories: { $sum: '$calories' },
            dailyProtein: { $sum: '$protein' },
            dailyCarbs: { $sum: '$carbs' },
            dailyFat: { $sum: '$fat' },
            dailySugar: { $sum: '$sugar' },
            dailySalt: { $sum: '$salt' },
          },
        },
        {
          $group: {
            _id: null,
            avgCalories: { $avg: '$dailyCalories' },
            avgProtein: { $avg: '$dailyProtein' },
            avgCarbs: { $avg: '$dailyCarbs' },
            avgFat: { $avg: '$dailyFat' },
            avgSugar: { $avg: '$dailySugar' },
            avgSalt: { $avg: '$dailySalt' },
          },
        },
      ]);
      return result[0] || {};
    };

    const [todayResult, weeklyAvg, monthlyAvg] = await Promise.all([
      Food.aggregate([
        { $match: { user: userId, date: { $gte: todayStart, $lte: todayEnd } } },
        { $group: {
            _id: null,
            totalCalories: { $sum: '$calories' },
            totalProtein: { $sum: '$protein' },
            totalCarbs: { $sum: '$carbs' },
            totalFat: { $sum: '$fat' },
            totalSugar: { $sum: '$sugar' },
            totalSalt: { $sum: '$salt' },
          } 
        }
      ]),
      calculateAverage(weekStart),
      calculateAverage(monthStart),
    ]);

    const todayTotals = todayResult[0] || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
    const weekly = {
      avgCalories: Math.round(weeklyAvg.avgCalories || 0),
      avgProtein: Math.round(weeklyAvg.avgProtein || 0),
      avgCarbs: Math.round(weeklyAvg.avgCarbs || 0),
      avgFat: Math.round(weeklyAvg.avgFat || 0),
      avgSugar: Math.round(weeklyAvg.avgSugar || 0),
      avgSalt: Math.round(weeklyAvg.avgSalt || 0),
    };
    const monthly = {
      avgCalories: Math.round(monthlyAvg.avgCalories || 0),
      avgProtein: Math.round(monthlyAvg.avgProtein || 0),
      avgCarbs: Math.round(monthlyAvg.avgCarbs || 0),
      avgFat: Math.round(monthlyAvg.avgFat || 0),
      avgSugar: Math.round(monthlyAvg.avgSugar || 0),
      avgSalt: Math.round(monthlyAvg.avgSalt || 0),
    };

    const period = (req.query.period || 'daily').toLowerCase();
    if (period === 'weekly') {
      return res.json({ calories: weekly.avgCalories, protein: weekly.avgProtein, carbs: weekly.avgCarbs, fat: weekly.avgFat, sugar: weekly.avgSugar || 0, salt: weekly.avgSalt || 0 });
    }
    if (period === 'monthly') {
      return res.json({ calories: monthly.avgCalories, protein: monthly.avgProtein, carbs: monthly.avgCarbs, fat: monthly.avgFat, sugar: monthly.avgSugar || 0, salt: monthly.avgSalt || 0 });
    }

    return res.json({ calories: todayTotals.totalCalories || 0, protein: todayTotals.totalProtein || 0, carbs: todayTotals.totalCarbs || 0, fat: todayTotals.totalFat || 0, sugar: todayTotals.totalSugar || 0, salt: todayTotals.totalSalt || 0 });
  } catch (err) {
    console.error('Summary Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/foods/barcode/:barcode
// @desc    Mencari produk berdasarkan barcode menggunakan Open Food Facts API
// @access  Public (Siapa saja bisa mencari produk)
router.get('/barcode/:barcode', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { barcode } = req.params;

    console.log(`🔍 [BARCODE SEARCH] Raw input: "${barcode}"`);

    // Validasi dan normalisasi barcode
    if (!barcode || barcode.trim() === '') {
      return res.status(400).json({ msg: 'Kode barcode tidak valid' });
    }

    const normalizedCode = barcode.trim().replace(/\D/g, '');
    
    if (normalizedCode.length < 8) {
      return res.status(400).json({ msg: 'Kode barcode terlalu pendek (minimal 8 digit)' });
    }

    console.log(`🔍 [BARCODE SEARCH] Normalized: "${normalizedCode}"`);

    //cek database
    console.log(`📁 [STEP 1] Checking local database for barcode: ${normalizedCode}`);
    
    const localProduct = await db.collection('products').findOne({ 
      code: normalizedCode 
    });

    if (localProduct) {
      console.log(`✅ [LOCAL DB HIT] Product found in local database!`);
      console.log(`   - Name: ${localProduct.product_name}`);
      console.log(`   - Source: ${localProduct.source}`);
      console.log(`   - Nutriments:`, localProduct.nutriments);
      
      // Return dengan format yang konsisten
      return res.json({
        code: localProduct.code,
        product_name: localProduct.product_name,
        brands: localProduct.brands || 'Tidak Diketahui',
        image_url: localProduct.image_url || '',
        nutriments: localProduct.nutriments,
        source: localProduct.source || 'local_cache',
        cached: true // Flag: data dari local DB
      });
    }

    // TIDAK ADA DI LOCAL → CEK OPEN FOOD FACTS API
    console.log(`🌐 [STEP 2] Not found in local DB. Querying Open Food Facts API...`);

    try {
      const offResponse = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${normalizedCode}.json`,
        { timeout: 8000 }
      );

      const offData = offResponse.data;

      // Validasi response dari API
      if (offData.status !== 1 || !offData.product) {
        console.log(`❌ [API] Product not found in Open Food Facts`);
        return res.status(404).json({ 
          msg: 'Produk tidak ditemukan di database manapun',
          suggestion: 'Silakan gunakan fitur input manual untuk menambahkan produk ini'
        });
      }

      const p = offData.product;
      const nutrients = p.nutriments || {};

      console.log(`✅ [API] Product found: ${p.product_name || 'Unnamed'}`);
      console.log(`   - Validating nutrition data...`);

      // Ambil nilai nutrisi dengan fallback
      const calories = nutrients["energy-kcal"] || nutrients["energy-kcal_100g"] || 0;
      const proteins = nutrients.proteins_100g || nutrients.proteins || 0;
      const carbs = nutrients.carbohydrates_100g || nutrients.carbohydrates || 0;
      const fat = nutrients.fat_100g || nutrients.fat || 0;

      // Validasi: Minimal ada 1 nilai nutrisi > 0
      const hasValidNutrition = calories > 0 || proteins > 0 || carbs > 0 || fat > 0;

      if (!hasValidNutrition) {
        console.log(`⚠️ [VALIDATION FAILED] Nutrition data is empty or invalid`);
        console.log(`   Calories: ${calories}, Protein: ${proteins}, Carbs: ${carbs}, Fat: ${fat}`);
        
        return res.status(404).json({ 
          msg: 'Produk ditemukan tetapi data nutrisi tidak lengkap',
          suggestion: 'Silakan gunakan fitur input manual untuk melengkapi data nutrisi',
          productName: p.product_name || 'Nama tidak tersedia'
        });
      }

      console.log(`✅ [VALIDATION PASSED] Nutrition data is valid`);
      console.log(`   - Calories: ${calories} kcal`);
      console.log(`   - Protein: ${proteins}g, Carbs: ${carbs}g, Fat: ${fat}g`);

      // STEP 3: SIMPAN KE DATABASE LOKAL (CACHE)
      const productToCache = {
        code: normalizedCode,
        product_name: p.product_name || 'Tanpa Nama',
        brands: p.brands || 'Tidak Diketahui',
        image_url: p.image_front_url || p.image_url || '',
        nutriments: {
          // PENTING: Gunakan format yang SAMA dengan input admin
          calories: parseFloat(calories) || 0,       
          proteins: parseFloat(proteins) || 0,       
          carbs: parseFloat(carbs) || 0,                       
          fat: parseFloat(fat) || 0,                 
          sugar: parseFloat(nutrients.sugars_100g || nutrients.sugars || 0),
          sodium: parseFloat(nutrients.sodium_100g || nutrients.sodium || 0)
        },
        source: 'open_food_facts',
        created_at: new Date(),
        last_updated: new Date()
      };

      await db.collection('products').insertOne(productToCache);
      console.log(`💾 [CACHE SAVED] Product cached to local database`);

      // Return data yang sudah disimpan
      return res.json({
        ...productToCache,
        cached: false // Flag: data fresh dari API
      });

    } catch (apiError) {
      // Handle error dari external API
      console.error(`❌ [API ERROR]`, apiError.message);

      if (apiError.code === 'ECONNABORTED' || apiError.code === 'ETIMEDOUT') {
        return res.status(504).json({ 
          msg: 'Koneksi ke server data eksternal timeout',
          suggestion: 'Silakan coba lagi atau gunakan input manual'
        });
      }

      if (apiError.response?.status === 404) {
        return res.status(404).json({ 
          msg: 'Produk tidak ditemukan di database manapun',
          suggestion: 'Silakan gunakan fitur input manual'
        });
      }

      // Error lainnya
      return res.status(503).json({ 
        msg: 'Gagal menghubungi server data eksternal',
        suggestion: 'Silakan coba lagi atau gunakan input manual',
        error: process.env.NODE_ENV === 'development' ? apiError.message : undefined
      });
    }

  } catch (err) {
    console.error('💥 [SERVER ERROR]', err.message);
    res.status(500).json({ 
      msg: 'Terjadi kesalahan pada server',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   POST /api/foods/analyze
// @desc    Menganalisis nutrisi makanan menggunakan AI (PUBLIK - tidak perlu login!)
// @access  Public
router.post('/analyze', async (req, res) => {
  try {
    const { productName, calories, protein, carbs, fat, sugar, salt } = req.body;

    console.info(`[foods] /analyze request for product: ${productName}`);

    if (!model) {
      console.warn('Generative model not initialized; returning heuristic analysis.');
      const heuristic = generateHeuristicAnalysis(productName, calories, protein, carbs, fat, sugar, salt);
      return res.json({ analysis: heuristic });
    }

    const prompt = `
      Anda adalah seorang ahli gizi yang ramah dan komunikatif. Analisis produk makanan berikut ini untuk pengguna di Indonesia.
      Output harus dalam bahasa Indonesia dan dikembalikan sebagai JSON yang valid dengan kunci-kunci: "summary", "risks", "warnings", "dietSuitability", "recommendations", "disclaimer".

      - "summary": ringkasan singkat (1-2 kalimat) tentang apakah produk ini umumnya sehat atau tidak.
      - "risks": sebuah array (list) berisi penyakit atau kondisi kesehatan yang dapat dipicu atau diperberat jika produk ini dikonsumsi secara berlebihan (mis. diabetes, hipertensi, obesitas, penyakit jantung). Sebutkan maksimum 3 risiko yang paling relevan.
      - "warnings": 1-2 singkat peringatan (kalimat pendek) seperti "Tidak sehat jika dikonsumsi berlebih" atau "Hindari jika Anda memiliki kondisi X".
      - "dietSuitability": nilai singkat seperti "Cocok untuk diet rendah karbohidrat", "Tidak cocok untuk diet rendah garam", atau "Netral". Jelaskan 1 kalimat mengapa.
      - "recommendations": array berisi 2 alternatif makanan/minuman yang lebih sehat dan mudah ditemukan di Indonesia (format bullet point sederhana).
      - "disclaimer": kalimat singkat (satu baris) yang menegaskan bahwa ini bukan pengganti nasihat medis profesional.

      Gunakan data nutrisi berikut (per 100g jika ada):
      Nama Produk: ${productName}
      Kalori: ${calories} kcal
      Karbohidrat: ${carbs} g
      Protein: ${protein} g
      Lemak: ${fat} g
      Gula: ${sugar} g
      Garam/Sodium: ${salt} g

      Instruksi tambahan:
      - Kembalikan hanya objek JSON yang valid tanpa teks penjelas tambahan.
      - Jaga respons singkat: ringkasan 1-2 kalimat, risks max 3 item, recommendations 2 item.
    `;

    console.info(`[foods] invoking generative model. preferredModel=${preferredModel}`);
    
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (genErr) {
      const msg = String(genErr && (genErr.message || genErr));
      const status = genErr?.status || genErr?.response?.status;
      if (status === 404 || /not found for API version|not supported for generateContent|models\/.+not found/i.test(msg)) {
        const fallbackModels = ['gemini-2.5-flash', 'text-bison-001'];
        let tried = [];
        for (const fm of fallbackModels) {
          try {
            console.warn(`[foods] model ${preferredModel} failed for generateContent; trying fallback ${fm}`);
            model = genAI.getGenerativeModel({ model: fm });
            tried.push(fm);
            result = await model.generateContent(prompt);
            console.info(`[foods] fallback model ${fm} succeeded`);
            break;
          } catch (fbErr) {
            console.warn(`[foods] fallback model ${fm} failed: ${fbErr?.message || fbErr}`);
          }
        }
        if (!result) {
          throw genErr;
        }
      } else {
        throw genErr;
      }
    }

    let analysisText = '';
    if (result?.response?.text) {
      analysisText = result.response.text();
    } else if (typeof result === 'string') {
      analysisText = result;
    } else if (result?.output) {
      analysisText = Array.isArray(result.output) ? result.output.join('\n') : String(result.output);
    } else {
      analysisText = JSON.stringify(result);
    }

    const cleaned = cleanAndParseAnalysisText(analysisText);
    if (cleaned && typeof cleaned === 'object' && !cleaned.source) cleaned.source = 'ai';
    
    console.info(`[foods] /analyze completed successfully for: ${productName}`);
    return res.json({ analysis: cleaned });

  } catch (err) {
    console.error('AI Analysis Error:', util.inspect(err, { depth: null }));
    res.status(500).json({ 
      error: 'Server Error saat menganalisis data makanan.',
      message: err?.message || 'Unknown error'
    });
  }
});

// @route   GET /api/foods/image-proxy
// @desc    Image proxy untuk menghindari CORS dan 406 errors
// @access  Public
router.get('/image-proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url query parameter' });

  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid url' });
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ error: 'Only http/https URLs are allowed' });
  }

  const hostWhitelist = [
    'world.openfoodfacts.org',
    'images.openfoodfacts.org',
    'static.openfoodfacts.org',
    'openfoodfacts.org'
  ];
  const hostname = parsed.hostname.toLowerCase();
  const allowed = hostWhitelist.some(h => hostname === h || hostname.endsWith('.' + h));
  if (!allowed) {
    return res.status(403).json({ error: 'Host not allowed' });
  }

  try {
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: { 'User-Agent': 'ScanBar-Image-Proxy/1.0 (+https://example.com)' },
      timeout: 10000,
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    response.data.pipe(res);
    response.data.on('error', (err) => {
      console.error('[image-proxy] stream error', err && err.message ? err.message : err);
      try { res.end(); } catch (_) {}
    });
  } catch (err) {
    console.error('[image-proxy] fetch error for', url, err && err.message ? err.message : err);
    const status = err?.response?.status || 502;
    const msg = err?.response?.statusText || err?.message || 'Failed to fetch image';
    return res.status(status).json({ error: msg });
  }
});

// @route   GET /api/foods/ai-status
// @desc    Cek status AI model
// @access  Public
router.get('/ai-status', async (req, res) => {
  try {
    const initialized = !!model;
    return res.json({
      modelInitialized: initialized,
      modelName: initialized ? (model?.name || preferredModel) : null,
      geminiEnvPresent: !!process.env.GEMINI_API_KEY
    });
  } catch (err) {
    console.error('ai-status error:', err);
    return res.status(500).json({ error: 'Failed to read AI status' });
  }
});

module.exports = router;