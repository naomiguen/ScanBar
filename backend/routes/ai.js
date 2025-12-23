const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fungsi helper untuk mengubah buffer gambar
function bufferToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

// @route   POST /api/ai/analyze-image
// @desc    Menganalisis gambar makanan dan mengembalikan estimasi nutrisi
// @access  Private
router.post('/analyze-image', auth, async (req, res) => {
  try {
    // Data gambar dikirim dari frontend sebagai string base64
    const { imageData, mimeType } = req.body; 

    // 1. Ubah string base64 kembali menjadi buffer
    const imageBuffer = Buffer.from(imageData, "base64");
    const imageParts = [bufferToGenerativePart(imageBuffer, mimeType)];

    // GUNAKAN environment variable dari .env
    const modelName = process.env.GENERATIVE_MODEL || "gemini-1.5-flash-latest";

    // Tanya Gemini VISION untuk "melihat" dan "mendeskripsikan" gambar
    const visionModel = genAI.getGenerativeModel({ model: modelName });
    const visionPrompt = `Analisis foto makanan ini dengan TELITI dan deteksi konteks pengambilan foto:
    
LANGKAH 1 - DETEKSI JARAK & REFERENSI:
- Apakah foto diambil DEKAT (detail jelas) atau JAUH (tampak keseluruhan)?
- Apakah ada OBJEK REFERENSI seperti sendok (15cm), piring (24cm), atau gelas?
- Jika ADA objek referensi, gunakan itu untuk estimasi porsi
- Jika TIDAK ADA referensi dan foto JAUH, gunakan estimasi KONSERVATIF (lebih kecil)

LANGKAH 2 - ESTIMASI PORSI:
Gunakan ukuran standar Indonesia:
- 1 centong nasi = 100g
- 1 potong sedang ayam/ikan = 60-80g
- 1 potong kecil tempe/tahu = 30-40g
- 1 sendok makan sayur = 30g

CARA HITUNG:
- Dengan piring: "Nasi menutupi 40% piring = ~120g"
- Dengan sendok: "Ayam sepanjang 1.5x sendok = ~70g"
- Tanpa referensi: "Nasi tampak ~1 centong penuh = ~100g"

CONTOH OUTPUT:
"Nasi putih 120g (40% piring), ayam goreng 70g (1.5x sendok), tumis kangkung 50g (2 sdm), tempe goreng 35g (2 potong kecil)"

PENTING: Sebutkan CARA HITUNG porsi di setiap item!`;
    
    const visionResult = await visionModel.generateContent([visionPrompt, ...imageParts]);
    const foodDescription = visionResult.response.text();

    // Ambil deskripsi teks itu, dan tanya Gemini TEXT untuk "menganalisis nutrisi"
    
    const textModel = genAI.getGenerativeModel({ model: modelName });
    const nutritionPrompt = `
      Anda adalah ahli gizi. Berdasarkan deskripsi makanan berikut, berikan estimasi nutrisi (kalori, protein, karbohidrat, lemak, gula, garam).
      Deskripsi: "${foodDescription}"

      DATABASE NUTRISI per 100g (Indonesia):
      - Nasi putih: 130 kkal, 2.7g protein, 28g karbo, 0.3g lemak, 0g gula, 0g garam
      - Nasi merah: 110 kkal, 2.6g protein, 23g karbo, 0.9g lemak
      - Ayam goreng (+ kulit): 246 kkal, 27g protein, 0g karbo, 15g lemak, 0.5g garam
      - Ayam tanpa kulit: 165 kkal, 31g protein, 0g karbo, 3.6g lemak
      - Ikan goreng: 200 kkal, 22g protein, 0g karbo, 12g lemak, 0.6g garam
      - Tempe goreng: 193 kkal, 14g protein, 8g karbo, 13g lemak
      - Tahu goreng: 76 kkal, 8g protein, 1.9g karbo, 4.8g lemak
      - Sayur tumis: 35 kkal, 2g protein, 6g karbo, 0.5g lemak, 0.3g garam
      - Telur goreng (1 butir): 90 kkal, 6g protein, 0.5g karbo, 7g lemak
      - Sambal (per sdm): 35 kkal, 0.5g protein, 3g karbo, 2g lemak, 0.8g garam
      
      CARA HITUNG:
      1. Ambil berat dari deskripsi (contoh: 120g)
      2. Kalikan dengan nilai nutrisi per 100g
      3. Bulatkan ke 1 desimal

      CONTOH:
      Nasi 120g → Kalori: 130 × 1.2 = 156 kkal

      OUTPUT - HARUS JSON VALID TANPA MARKDOWN:
      PENTING: Semua angka HARUS berupa NUMBER (bukan string dalam kutip)
      CONTOH BENAR: "calories": 156.0
      CONTOH SALAH: "calories": "156"

      Tolong berikan jawaban HANYA dalam format JSON yang ketat seperti ini:
      {
        "description": "Deskripsi singkat dari Anda",
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "sugar": 0,
        "salt": 0
      }
    `;

    const nutritionResult = await textModel.generateContent(nutritionPrompt);
    const nutritionText = nutritionResult.response.text();

    // Bersihkan response dari markdown code blocks
    const jsonResponse = JSON.parse(nutritionText.replace(/```json/g, "").replace(/```/g, "").trim());
    
    res.json(jsonResponse);

  } catch (err) {
    console.error("Error detail:", err.message);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

module.exports = router;