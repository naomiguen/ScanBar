

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Memanggil satpam kita
const Food = require('../models/Food');
const axios = require('axios');
const mongoose = require('mongoose');
const util = require('util');
const { generateHeuristicAnalysis } = require('../utils/heuristic');

// impor Google Generative AI
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inisiasi generative client dengan API Key dari .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Pilih model generatif. Default ke model yang umumnya tersedia (text-bison-001)
// Anda bisa mengoverride dengan env GENERATIVE_MODEL (mis. 'gemini-1.5-pro' jika tersedia)
// Default to a supported Gemini model; override with GENERATIVE_MODEL if needed
const preferredModel = process.env.GENERATIVE_MODEL || 'gemini-2.5-flash';
let model;
try {
  model = genAI.getGenerativeModel({ model: preferredModel });
} catch (e) {
  console.error(`Failed to initialize generative model '${preferredModel}':`, e.message || e);
  // fallback ke text-bison-001 jika terjadi error
  try {
    model = genAI.getGenerativeModel({ model: 'text-bison-001' });
  } catch (err) {
    console.error('Failed to initialize fallback generative model text-bison-001:', err.message || err);
    // Leave model undefined; analyze route will return a 503 if not initialized
    model = null;
  }
}

// Helper: clean possible code-fence wrappers and try to parse JSON from model output
function cleanAndParseAnalysisText(analysisText) {
  // If not a string, return as-is (may already be an object)
  if (typeof analysisText !== 'string') return analysisText;

  // Normalize line endings and trim
  let text = analysisText.replace(/\r/g, '').trim();

  // 1) If the model wrapped JSON in a code fence like ```json ... ``` extract the inner content
  const fenceMatch = text.match(/```(?:json|js|javascript)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    text = fenceMatch[1].trim();
  } else {
    // 2) If there is any leading label like "JSON:" or similar, drop up to the first brace
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.slice(firstBrace, lastBrace + 1).trim();
    }
  }

  // 3) Attempt to parse JSON; return parsed object on success, otherwise return cleaned string
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    return text;
  }
}

// Heuristic analysis is provided by backend/utils/heuristic.js and imported above

// @route   POST /api/foods
// @desc    Menambah catatan makanan baru
// @access  Private (Dijaga oleh satpam 'auth')
router.post('/', auth, async (req, res) => {
  try {
    const { productName, calories, protein, carbs, fat, sugar, salt, imageUrl, barcode } = req.body;

    const newFood = new Food({
      user: req.user.id, // ID pengguna didapat dari satpam (middleware)
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
  const raw = req.params.barcode;
  // sanitize: keep digits only
  const barcode = String(raw || '').replace(/\D/g, '');
  console.info(`[foods] /barcode lookup requested. raw="${raw}" sanitized="${barcode}"`);

  if (!barcode) {
    return res.status(400).json({ message: 'Barcode tidak valid (harus berisi angka).' });
  }

  try {
    // 1) Try local DB
    const food = await Food.findOne({ barcode });
    if (food) {
      console.info(`[foods] barcode ${barcode} found in local DB (id=${food._id})`);
      // Return product object directly for frontend compatibility
      return res.json(food.toObject());
    }

    // Helper to truncate long objects for logs
    const truncateForLog = (obj, max = 200) => {
      try {
        const s = JSON.stringify(obj);
        return s.length > max ? s.slice(0, max) + '…' : s;
      } catch (e) {
        return String(obj).slice(0, max);
      }
    };

    // 2) Try OpenFoodFacts v2 first, then fallback to v0 if needed
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
          // v2 returns { product } while v0 returns { status: 1, product }
          const product = ofRes.data.product || (ofRes.data.status === 1 ? ofRes.data.product : null);
          console.info(`[foods] OF ${attempt.name} response preview: ${truncateForLog(ofRes.data)}`);

          if (product) {
            // Return product object directly for frontend compatibility
            return res.json(product);
          }
        }
      } catch (innerErr) {
        // Log the error and continue to next attempt
        console.warn(`[foods] OpenFoodFacts ${attempt.name} request failed for ${barcode}: ${innerErr.message}`);
      }
    }

    // If we reach here, no product found
    console.info(`[foods] barcode ${barcode} not found in DB nor OpenFoodFacts`);
    return res.status(404).json({ message: 'Produk dengan barcode tersebut tidak ditemukan di database maupun OpenFoodFacts.' });
  } catch (err) {
    console.error('[foods] barcode lookup error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mencari produk.' });
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

    // Hari ini (start & end)
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Minggu (mulai dari hari minggu)
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - todayStart.getDay());

    // Bulanan (awal bulan)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

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
            dailySugar: { $sum: '$sugar' },
            dailySalt: { $sum: '$salt' },
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
            avgSugar: { $avg: '$dailySugar' },
            avgSalt: { $avg: '$dailySalt' },
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
            totalSugar: { $sum: '$sugar' },
            totalSalt: { $sum: '$salt' },
          } 
        }
      ]),
      // Rata-rata mingguan
      calculateAverage(weekStart),
      // Rata-rata bulanan
      calculateAverage(monthStart),
    ]);
    // Normalize results
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

    // Support ?period=daily|weekly|monthly for frontend convenience
    const period = (req.query.period || 'daily').toLowerCase();
    if (period === 'weekly') {
      return res.json({ calories: weekly.avgCalories, protein: weekly.avgProtein, carbs: weekly.avgCarbs, fat: weekly.avgFat, sugar: weekly.avgSugar || 0, salt: weekly.avgSalt || 0 });
    }
    if (period === 'monthly') {
      return res.json({ calories: monthly.avgCalories, protein: monthly.avgProtein, carbs: monthly.avgCarbs, fat: monthly.avgFat, sugar: monthly.avgSugar || 0, salt: monthly.avgSalt || 0 });
    }

    // Default: daily totals
    return res.json({ calories: todayTotals.totalCalories || 0, protein: todayTotals.totalProtein || 0, carbs: todayTotals.totalCarbs || 0, fat: todayTotals.totalFat || 0, sugar: todayTotals.totalSugar || 0, salt: todayTotals.totalSalt || 0 });
  } catch (err) {
    console.error('Summary Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/foods/analyze
// @desc    Menganalisis nutrisi makanan menggunakan AI
// @access  Private

router.post('/analyze', auth, async (req, res) => {
  try {
    const { productName, calories, protein, carbs, fat, sugar, salt } = req.body;

    // If the generative model is not initialized, return a lightweight heuristic analysis
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

    // Call model.generateContent - the client library may return different shapes depending on model
    // Debug: log model readiness and prompt size to help diagnose runtime errors
    try {
      console.info(`[foods] invoking generative model. preferredModel=${preferredModel} modelObjPresent=${!!model} hasGenerate=${typeof model?.generateContent === 'function'} promptLength=${String(prompt).length}`);
    } catch (logErr) {
      console.warn('[foods] failed to log model debug info', logErr);
    }
    // Try generateContent, but if the model is not supported by the API (404),
    // attempt a small set of fallback models and retry once.
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (genErr) {
      // If model appears to be unavailable for generateContent (404 Not Found), try fallbacks
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
            // continue to next fallback
          }
        }
        if (!result) {
          // none of the fallbacks worked; rethrow original error for full logging
          throw genErr;
        }
      } else {
        // Not a model-not-found error, rethrow
        throw genErr;
      }
    }
    // Some clients return a response wrapper; try to normalize
    let analysisText = '';
    if (result?.response?.text) {
      analysisText = result.response.text();
    } else if (typeof result === 'string') {
      analysisText = result;
    } else if (result?.output) {
      analysisText = Array.isArray(result.output) ? result.output.join('\n') : String(result.output);
    } else {
      // As a last resort, stringify the whole result
      analysisText = JSON.stringify(result);
    }

  // Clean potential code fences / wrappers and attempt to parse JSON server-side
  const cleaned = cleanAndParseAnalysisText(analysisText);
  // Mark result as coming from AI so frontend can distinguish from heuristic fallback
  if (cleaned && typeof cleaned === 'object' && !cleaned.source) cleaned.source = 'ai';
  return res.json({ analysis: cleaned });

  } catch (err) {
    // Log full error detail for debugging (inspecting non-enumerable props)
    console.error('AI Analysis Error:', util.inspect(err, { depth: null }));
    res.status(500).send('Server Error saat menganalisis data makanan.');
  }
});

// Temporary unprotected test route for quick smoke testing of the generative model.
// Keep this for local/dev only. It uses the same cleaning/parsing logic as the protected endpoint
// so the frontend can rely on receiving an object when the model returns valid JSON.
router.post('/analyze-test', async (req, res) => {
  try {
    const { productName, calories, protein, carbs, fat, sugar, salt } = req.body;

    // If the generative model is not initialized, return heuristic analysis so frontend still shows useful info
    if (!model) {
      console.warn('Generative model not initialized; returning heuristic analysis (test route).');
      const heuristic = generateHeuristicAnalysis(productName, calories, protein, carbs, fat, sugar, salt);
      return res.json({ analysis: heuristic });
    }

    const prompt = `
      Anda adalah seorang ahli gizi yang ramah dan komunikatif. Analisis produk makanan berikut ini untuk pengguna di Indonesia.
      Output harus dalam bahasa Indonesia dan dikembalikan sebagai JSON yang valid dengan kunci-kunci: "summary", "risks", "warnings", "dietSuitability", "recommendations", "disclaimer".

      Nama Produk: ${productName}
      Kalori: ${calories} kcal
      Karbohidrat: ${carbs} g
      Protein: ${protein} g
      Lemak: ${fat} g
      Gula: ${sugar} g
      Garam/Sodium: ${salt} g
    `;

    const result = await model.generateContent(prompt);
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
  return res.json({ analysis: cleaned });
  } catch (err) {
    console.error('AI Analysis Test Error:', util.inspect(err, { depth: null }));

    // Build a compact error object to return to clients for local debugging
    const errorDetails = {
      message: err?.message || String(err),
      status: err?.status || err?.response?.status || null,
      statusText: err?.statusText || err?.response?.statusText || null,
      // include small portion of response body if present
      responseData: (() => {
        try {
          const d = err?.response?.data;
          if (!d) return null;
          const s = typeof d === 'string' ? d : JSON.stringify(d);
          return s.length > 2000 ? s.slice(0, 2000) + '…' : s;
        } catch (_) {
          return String(err?.response?.data).slice(0, 500);
        }
      })(),
      // short stack for quick inspection
      stack: err?.stack ? err.stack.split('\n').slice(0, 8).join('\n') : null
    };

    return res.status(500).json({ error: 'Server Error saat menganalisis data makanan (test).', errorDetails });
  }
});

// Simple AI status endpoint so we can verify whether the generative model initialized
// GET /api/foods/ai-status
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

// Diagnostics endpoint: runs a tiny test prompt against the model and returns either
// the cleaned sample response or an inspected error to help debug auth/network issues.
// GET /api/foods/ai-diagnostics
router.get('/ai-diagnostics', async (req, res) => {
  try {
    const geminiEnvPresent = !!process.env.GEMINI_API_KEY;
    if (!model) {
      console.warn('[foods] ai-diagnostics: model not initialized');
      return res.json({ modelInitialized: false, modelName: null, geminiEnvPresent });
    }

    // Small safe prompt that should return a short text
    const diagPrompt = `Please return a single-line JSON object with a field "ok": true and "note": "diagnostic test".`;
    console.info(`[foods] ai-diagnostics invoking model ${preferredModel} promptLength=${diagPrompt.length}`);

    try {
      let diagResult;
      try {
        diagResult = await model.generateContent(diagPrompt);
      } catch (genErr) {
        const msg = String(genErr && (genErr.message || genErr));
        const status = genErr?.status || genErr?.response?.status;
        if (status === 404 || /not found for API version|not supported for generateContent|models\/.+not found/i.test(msg)) {
          const fallbackModels = ['gemini-2.5-flash', 'text-bison-001'];
          for (const fm of fallbackModels) {
            try {
              console.warn(`[foods] ai-diagnostics: model ${preferredModel} failed; trying fallback ${fm}`);
              model = genAI.getGenerativeModel({ model: fm });
              diagResult = await model.generateContent(diagPrompt);
              console.info(`[foods] ai-diagnostics: fallback model ${fm} succeeded`);
              break;
            } catch (fbErr) {
              console.warn(`[foods] ai-diagnostics: fallback ${fm} failed: ${fbErr?.message || fbErr}`);
            }
          }
          if (!diagResult) throw genErr;
        } else {
          throw genErr;
        }
      }

      let analysisText = '';
      if (diagResult?.response?.text) {
        analysisText = diagResult.response.text();
      } else if (typeof diagResult === 'string') {
        analysisText = diagResult;
      } else if (diagResult?.output) {
        analysisText = Array.isArray(diagResult.output) ? diagResult.output.join('\n') : String(diagResult.output);
      } else {
        analysisText = JSON.stringify(diagResult);
      }

      const cleaned = cleanAndParseAnalysisText(analysisText);
      return res.json({ modelInitialized: true, modelName: model?.name || preferredModel, geminiEnvPresent, diagnostic: cleaned });
    } catch (innerErr) {
      console.error('AI Diagnostics Error:', util.inspect(innerErr, { depth: null }));
      return res.status(500).json({ modelInitialized: true, modelName: model?.name || preferredModel, geminiEnvPresent, error: util.inspect(innerErr, { depth: 1 }) });
    }
  } catch (err) {
    console.error('ai-diagnostics outer error:', util.inspect(err, { depth: null }));
    return res.status(500).json({ error: 'ai-diagnostics failed' });
  }
});



// Image proxy to avoid remote-host 406/deny issues and CORS problems.
// Usage: GET /api/foods/image-proxy?url=<encoded-image-url>
router.get('/image-proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url query parameter' });

  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid url' });
  }

  // Only allow http(s)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ error: 'Only http/https URLs are allowed' });
  }

  // Whitelist hostnames to reduce SSRF risk. Add more hosts if needed.
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
      // Set a benign User-Agent to avoid some hosts rejecting generic requests
      headers: { 'User-Agent': 'ScanBar-Image-Proxy/1.0 (+https://example.com)' },
      timeout: 10000,
    });

    // Forward content-type and length if present
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }
    res.setHeader('Content-Type', contentType);
    // Cache images for a short period to reduce repeated requests
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day

    // Pipe the remote stream directly to client
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

module.exports = router;