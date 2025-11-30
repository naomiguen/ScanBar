const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// HELPER FUNCTIONS

// Fungsi helper untuk mengubah buffer gambar
function bufferToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

// Fungsi helper untuk parse JSON yang mungkin ada markdown
function parseAIResponse(text) {
  try {
    // Hapus markdown code blocks
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/^[^{]*/, "") // Hapus text sebelum {
      .replace(/[^}]*$/, "") // Hapus text setelah }
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Parse error:", error);
    console.error("Raw text:", text);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

// ROUTE: ANALYZE IMAGE (OPTIMIZED - 1 REQUEST ONLY)

// @route   POST /api/ai/analyze-image
// @desc    Menganalisis gambar makanan dengan deteksi jarak kamera (SUPER OPTIMIZED)
// @access  Private
router.post('/analyze-image', auth, async (req, res) => {
  try {
    const { imageData, mimeType } = req.body;
    
    if (!imageData || !mimeType) {
      return res.status(400).json({ error: 'Image data and mimeType are required' });
    }

    const imageBuffer = Buffer.from(imageData, "base64");
    const imageParts = [bufferToGenerativePart(imageBuffer, mimeType)];

    // GUNAKAN FLASH 
    const modelName = process.env.GENERATIVE_MODEL || "gemini-1.5-flash-latest";
    const visionModel = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.4, // Lebih deterministik
        maxOutputTokens: 2048, // Batasi output
      }
    });

    console.log("🚀 Starting ONE-SHOT analysis with model:", modelName);
    
    const combinedPrompt = `Analisis foto makanan ini secara LENGKAP dan AKURAT dalam SATU respons:

═══════════════════════════════════════════════════════════════════
LANGKAH 1 - DETEKSI JARAK & SKALA
═══════════════════════════════════════════════════════════════════
Tentukan:
- Jarak kamera: close-up (<30cm) / medium (30-60cm) / far (>60cm)
- Identifikasi objek referensi (piring 20-25cm, sendok 15cm, gelas 7-8cm, dll)
- Hitung scale factor untuk koreksi ukuran

KATEGORI JARAK:
- CLOSE-UP: Makanan >70% frame, detail tekstur sangat jelas
- MEDIUM: Makanan 40-70% frame, piring/wadah lengkap terlihat
- FAR: Makanan <40% frame, terlihat meja/lingkungan

OBJEK REFERENSI STANDAR (Indonesia):
- Piring makan: 20-25cm diameter
- Piring kecil: 15-18cm diameter
- Sendok makan: 15cm panjang
- Gelas: 7-8cm diameter
- Mangkuk: 12-15cm diameter

═══════════════════════════════════════════════════════════════════
LANGKAH 2 - IDENTIFIKASI MAKANAN
═══════════════════════════════════════════════════════════════════
Untuk SETIAP item makanan:
1. Nama makanan spesifik
2. Estimasi dimensi visual (cm)
3. Deteksi metode masak (goreng/rebus/kukus/mentah/bakar)
4. Cek ada minyak/saus/kuah atau tidak
5. Bandingkan dengan objek referensi

═══════════════════════════════════════════════════════════════════
LANGKAH 3 - ESTIMASI BERAT (AKURAT!)
═══════════════════════════════════════════════════════════════════
Gunakan panduan berat standar Indonesia:

NASI & KARBOHIDRAT:
- Nasi 1 centong: 100-120g
- Nasi 1 porsi piring: 150-200g
- Mie goreng 1 porsi: 150-200g
- Roti tawar 1 lembar: 30-40g

LAUK PROTEIN HEWANI:
- Ayam goreng paha kecil: 60-80g
- Ayam goreng paha besar: 100-120g
- Ayam goreng dada: 80-100g
- Ikan goreng sedang: 70-100g
- Telur ayam: 50-60g

LAUK PROTEIN NABATI:
- Tempe goreng 1 potong: 20-30g
- Tahu goreng 1 potong: 40-50g

SAYURAN:
- Sayur 1 sendok makan: 20-30g
- Sayur 1 porsi: 60-80g
- Lalapan mentah: 30-50g

METODE MASAK (KOREKSI BERAT):
- Goreng minyak banyak: +15-25% (minyak terserap)
- Goreng minyak sedikit: +8-12%
- Berkuah/bersantan: +10-15%
- Rebus/kukus: +0%

KOREKSI JARAK KAMERA (PENTING!):
- Close-up: kalikan berat × 0.85 (cenderung over-estimate)
- Medium: kalikan berat × 1.0 (paling akurat)
- Far: kalikan berat × 1.15 (cenderung under-estimate)

═══════════════════════════════════════════════════════════════════
LANGKAH 4 - KALKULASI NUTRISI PER 100g
═══════════════════════════════════════════════════════════════════

KARBOHIDRAT (per 100g):
- Nasi putih: 130 kal, 2.7g protein, 28g karbo, 0.3g lemak, 0.4g fiber
- Mie goreng: 140 kal, 4.5g protein, 20g karbo, 5g lemak, 0.8g fiber
- Roti tawar: 265 kal, 9g protein, 49g karbo, 3.2g lemak, 2.7g fiber

PROTEIN HEWANI (per 100g):
- Ayam goreng: 250 kal, 27g protein, 0g karbo, 15g lemak, 0g fiber
- Ayam rebus: 165 kal, 31g protein, 0g karbo, 3.6g lemak, 0g fiber
- Ikan goreng: 200 kal, 20g protein, 0g karbo, 13g lemak, 0g fiber
- Telur goreng: 196 kal, 13.6g protein, 0.8g karbo, 15g lemak, 0g fiber
- Telur rebus: 155 kal, 12.6g protein, 1.1g karbo, 10.6g lemak, 0g fiber

PROTEIN NABATI (per 100g):
- Tempe goreng: 200 kal, 18.3g protein, 13.5g karbo, 10.8g lemak, 1.4g fiber
- Tahu goreng: 150 kal, 10.9g protein, 4g karbo, 10.7g lemak, 0.1g fiber

SAYURAN (per 100g):
- Sayur hijau (bayam, kangkung): 23 kal, 2.9g protein, 3.6g karbo, 0.4g lemak, 2.2g fiber
- Sayur berkuah: 30 kal, 1.5g protein, 4g karbo, 1.5g lemak, 1.5g fiber

ESTIMASI GULA & GARAM:
- Nasi/karbohidrat: 0g gula, 2-5mg sodium
- Goreng: 0-2g gula, 300-500mg sodium
- Berkuah/santan: 2-5g gula, 400-600mg sodium
- Sayur: 1-3g gula, 50-150mg sodium

OUTPUT FORMAT - JSON SAJA, TANPA MARKDOWN APAPUN

{
  "cameraDistance": "close-up/medium/far",
  "scaleFactor": 0.85-1.15,
  "scaleConfidence": "high/medium/low",
  "referenceObjects": ["piring", "sendok", "dll"],
  "items": [
    {
      "name": "nama makanan spesifik",
      "weight": 0,
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0,
      "fiber": 0,
      "cookingMethod": "goreng/rebus/kukus/mentah/bakar"
    }
  ],
  "total": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "fiber": 0,
    "sugar": 0,
    "sodium": 0
  },
  "confidence": "high/medium/low",
  "summary": "Ringkasan hasil analisis dalam 1-2 kalimat bahasa Indonesia"
}

PENTING:
- Output HANYA JSON, jangan ada teks lain
- Bulatkan angka nutrisi ke bilangan bulat yang wajar
- Gunakan koreksi jarak kamera
- Prioritas: AKURASI > PRESISI`;

    console.log("Sending request to Gemini...");
    const startTime = Date.now();

    // Set timeout untuk request (45 detik)
    const analysisPromise = visionModel.generateContent([combinedPrompt, ...imageParts]);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Analysis timeout after 45 seconds')), 45000)
    );

    const result = await Promise.race([analysisPromise, timeoutPromise]);
    const processingTime = Date.now() - startTime;
    
    console.log(` Analysis completed in ${processingTime}ms (${(processingTime/1000).toFixed(2)}s)`);

    const responseText = result.response.text();
    console.log("Raw AI response preview:", responseText.substring(0, 300) + "...");

    const nutritionData = parseAIResponse(responseText);

    // Validasi response
    if (!nutritionData.items || !nutritionData.total) {
      throw new Error('Invalid response format from AI - missing items or total');
    }

    // Validasi data nutrisi
    if (nutritionData.total.calories === 0) {
      console.warn("Warning: Total calories is 0");
    }

    const finalResponse = {
      ...nutritionData,
      metadata: {
        processingTimeMs: processingTime,
        processingTimeSec: (processingTime / 1000).toFixed(2),
        modelUsed: modelName,
        analysisType: 'one-shot-optimized',
        timestamp: new Date().toISOString()
      }
    };

    console.log("Sending response to client");
    console.log("Total calories:", finalResponse.total.calories);
    console.log("Items count:", finalResponse.items.length);
    
    res.json(finalResponse);

  } catch (err) {
    console.error("═══ ERROR DETAILS ═══");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    
    // Kirim error yang informatif ke frontend
    let errorMessage = 'Gagal menganalisis gambar';
    let userMessage = 'Terjadi kesalahan saat memproses gambar. Silakan coba lagi.';

    if (err.message.includes('timeout')) {
      errorMessage = 'Timeout';
      userMessage = 'Analisis memakan waktu terlalu lama. Coba dengan foto yang lebih sederhana atau pencahayaan lebih baik.';
    } else if (err.message.includes('parse') || err.message.includes('JSON')) {
      errorMessage = 'Parse Error';
      userMessage = 'Gagal memproses hasil analisis. Silakan coba foto yang lebih jelas.';
    } else if (err.message.includes('quota') || err.message.includes('limit')) {
      errorMessage = 'Quota Exceeded';
      userMessage = 'Batas penggunaan API tercapai. Silakan coba beberapa saat lagi.';
    }

    res.status(500).json({ 
      error: errorMessage,
      message: userMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// ROUTE: QUICK ANALYZE (SUPER FAST - BACKUP)

// @route   POST /api/ai/quick-analyze
// @desc    Analisis super cepat tanpa detail (untuk testing/fallback)
// @access  Private
router.post('/quick-analyze', auth, async (req, res) => {
  try {
    const { imageData, mimeType } = req.body;
    
    if (!imageData || !mimeType) {
      return res.status(400).json({ error: 'Image data and mimeType required' });
    }

    const imageBuffer = Buffer.from(imageData, "base64");
    const imageParts = [bufferToGenerativePart(imageBuffer, mimeType)];

    const visionModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      }
    });

    console.log(" Quick analyze started");
    const startTime = Date.now();

    const quickPrompt = `Analisis CEPAT foto makanan ini:

1. Deteksi jarak: close-up / medium / far
2. Identifikasi makanan (sebutkan semua)
3. Estimasi berat total (gram)
4. Kalori total (estimasi kasar)
5. Protein, karbo, lemak total

JSON output (tanpa markdown):
{
  "distance": "close-up/medium/far",
  "items": [
    {
      "name": "nama makanan",
      "weight": 0
    }
  ],
  "total": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0
  },
  "summary": "ringkasan singkat"
}`;

    const result = await Promise.race([
      visionModel.generateContent([quickPrompt, ...imageParts]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Quick analyze timeout')), 25000))
    ]);

    const processingTime = Date.now() - startTime;
    console.log(`Quick analysis done in ${processingTime}ms`);

    const text = result.response.text();
    const data = parseAIResponse(text);

    res.json({
      ...data,
      metadata: {
        processingTimeMs: processingTime,
        analysisType: 'quick',
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("❌ Quick analyze error:", err);
    res.status(500).json({ 
      error: 'Quick analysis failed',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});


// ROUTE: DETAILED ANALYZE (MULTI-STEP - MOST ACCURATE)

// @route   POST /api/ai/detailed-analyze
// @desc    Analisis detail 4-step (paling akurat tapi lebih lambat)
// @access  Private
router.post('/detailed-analyze', auth, async (req, res) => {
  try {
    const { imageData, mimeType } = req.body;
    
    if (!imageData || !mimeType) {
      return res.status(400).json({ error: 'Image data and mimeType required' });
    }

    const imageBuffer = Buffer.from(imageData, "base64");
    const imageParts = [bufferToGenerativePart(imageBuffer, mimeType)];

    const modelName = process.env.GENERATIVE_MODEL || "gemini-1.5-pro-latest";
    const visionModel = genAI.getGenerativeModel({ model: modelName });

    console.log("Starting DETAILED 4-step analysis with model:", modelName);
    const overallStartTime = Date.now();

    // STEP 1: ANALISIS JARAK & SKALA
    console.log("Step 1/4: Scale analysis...");
    const scalePrompt = `Analisis foto makanan untuk menentukan JARAK KAMERA dan SKALA.

TUGAS:
1. Tentukan jarak: close-up (<30cm) / medium (30-60cm) / far (>60cm)
2. Identifikasi objek referensi (piring 20-25cm, sendok 15cm, dll)
3. Estimasi scale factor

Output JSON (tanpa markdown):
{
  "cameraDistance": "close-up/medium/far",
  "estimatedDistanceCm": 0,
  "referenceObjects": ["piring", "sendok"],
  "scaleFactor": 1.0,
  "scaleConfidence": "high/medium/low"
}`;

    const scaleResult = await visionModel.generateContent([scalePrompt, ...imageParts]);
    const scaleData = parseAIResponse(scaleResult.response.text());
    console.log("Step 1 done:", scaleData);

    // STEP 2: IDENTIFIKASI MAKANAN
    console.log("Step 2/4: Food identification...");
    const foodPrompt = `Identifikasi semua makanan dengan konteks skala:
- Jarak: ${scaleData.cameraDistance}
- Scale factor: ${scaleData.scaleFactor}

Output JSON:
{
  "foodItems": [
    {
      "name": "nama makanan",
      "visualDimensions": "PxLxT cm",
      "cookingMethod": "goreng/rebus/kukus",
      "hasOilOrSauce": true/false
    }
  ]
}`;

    const foodResult = await visionModel.generateContent([foodPrompt, ...imageParts]);
    const foodData = parseAIResponse(foodResult.response.text());
    console.log("Step 2 done:", foodData.foodItems.length, "items");

    // STEP 3: ESTIMASI BERAT
    console.log("Step 3/4: Weight estimation...");
    const weightPrompt = `Estimasi berat dengan data:
${JSON.stringify(foodData.foodItems, null, 2)}

Jarak: ${scaleData.cameraDistance}, Scale: ${scaleData.scaleFactor}

Gunakan panduan berat Indonesia dan koreksi jarak.

Output JSON:
{
  "portionAnalysis": [
    {
      "name": "nama",
      "totalWeight": 0,
      "confidence": "high/medium/low"
    }
  ]
}`;

    const textModel = genAI.getGenerativeModel({ model: modelName });
    const weightResult = await textModel.generateContent(weightPrompt);
    const weightData = parseAIResponse(weightResult.response.text());
    console.log("Step 3 done");

    // STEP 4: KALKULASI NUTRISI
    console.log("Step 4/4: Nutrition calculation...");
    const nutritionPrompt = `Hitung nutrisi berdasarkan berat:
${JSON.stringify(weightData.portionAnalysis, null, 2)}

Gunakan database nutrisi Indonesia per 100g.

Output JSON:
{
  "items": [
    {
      "name": "nama",
      "weight": 0,
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0,
      "fiber": 0
    }
  ],
  "total": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "fiber": 0,
    "sugar": 0,
    "sodium": 0
  },
  "summary": "ringkasan"
}`;

    const nutritionResult = await textModel.generateContent(nutritionPrompt);
    const nutritionData = parseAIResponse(nutritionResult.response.text());

    const totalProcessingTime = Date.now() - overallStartTime;
    console.log(`All 4 steps completed in ${totalProcessingTime}ms (${(totalProcessingTime/1000).toFixed(2)}s)`);

    const finalResponse = {
      ...nutritionData,
      metadata: {
        processingTimeMs: totalProcessingTime,
        processingTimeSec: (totalProcessingTime / 1000).toFixed(2),
        modelUsed: modelName,
        analysisType: 'detailed-4-step',
        scaleAnalysis: scaleData,
        timestamp: new Date().toISOString()
      }
    };

    res.json(finalResponse);

  } catch (err) {
    console.error("Detailed analyze error:", err);
    res.status(500).json({ 
      error: 'Detailed analysis failed',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// @route   GET /api/ai/health
// @desc    Health check endpoint
// @access  Public
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AI Food Analysis Service',
    version: '2.0',
    endpoints: {
      analyzeImage: '/api/ai/analyze-image (recommended)',
      quickAnalyze: '/api/ai/quick-analyze (fast)',
      detailedAnalyze: '/api/ai/detailed-analyze (accurate)'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;