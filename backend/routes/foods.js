const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Food = require('../models/Food');
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
    res.json(food);
  } catch (err) {
    console.error('Add Food Error:', err.message);
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
    res.json({ msg: 'Makanan dihapus' });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/foods/summary
// @desc    Menghitung ringkasan nutrisi (harian, mingguan, bulanan) - jurnal pribadi
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    // Gunakan user.id langsung (string UUID dari Supabase)
    // Tidak perlu convert ke ObjectId lagi
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
  const raw = req.params.barcode;
  const barcode = String(raw || '').replace(/\D/g, '');
  console.info(`[foods] /barcode lookup requested. raw="${raw}" sanitized="${barcode}"`);

  if (!barcode) {
    return res.status(400).json({ message: 'Barcode tidak valid (harus berisi angka).' });
  }

  try {
    const food = await Food.findOne({ barcode });
    if (food) {
      console.info(`[foods] barcode ${barcode} found in local DB (id=${food._id})`);
      return res.json(food.toObject());
    }

    const truncateForLog = (obj, max = 200) => {
      try {
        const s = JSON.stringify(obj);
        return s.length > max ? s.slice(0, max) + '…' : s;
      } catch (e) {
        return String(obj).slice(0, max);
      }
    };

    const attempts = [
      { name: 'v2', url: `https://world.openfoodfacts.org/api/v2/product/${barcode}` },
      { name: 'v0', url: `https://world.openfoodfacts.org/api/v0/product/${barcode}.json` },
    ];

    for (const attempt of attempts) {
      try {
        console.info(`[foods] trying OpenFoodFacts ${attempt.name} endpoint for barcode ${barcode}`);
        const ofRes = await axios.get(attempt.url, { timeout: 6000 });
        console.info(`[foods] OF ${attempt.name} status=${ofRes.status} for barcode ${barcode}`);

        if (ofRes.status === 200 && ofRes.data) {
          const product = ofRes.data.product || (ofRes.data.status === 1 ? ofRes.data.product : null);
          console.info(`[foods] OF ${attempt.name} response preview: ${truncateForLog(ofRes.data)}`);

          if (product) {
            return res.json(product);
          }
        }
      } catch (innerErr) {
        console.warn(`[foods] OpenFoodFacts ${attempt.name} request failed for ${barcode}: ${innerErr.message}`);
      }
    }

    console.info(`[foods] barcode ${barcode} not found in DB nor OpenFoodFacts`);
    return res.status(404).json({ message: 'Produk dengan barcode tersebut tidak ditemukan di database maupun OpenFoodFacts.' });
  } catch (err) {
    console.error('[foods] barcode lookup error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mencari produk.' });
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