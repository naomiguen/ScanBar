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
    const visionPrompt = `Analisis foto makanan ini dengan HATI-HATI dan KONSERVATIF. 
    
Deskripsikan:
1. Jenis makanan yang terlihat
2. Estimasi porsi REALISTIS (jangan over-estimate)
3. Gunakan ukuran standar Indonesia: 1 centong nasi (~100g), 1 potong sedang lauk (~50-80g), 1 sendok makan sayur (~30g)

Contoh output yang baik:
"Nasi putih 1 centong (100g), ayam goreng 1 potong kecil (60g), tumis kangkung 2 sendok makan (50g), tempe goreng 2 potong kecil (40g)"

PENTING: Jika tidak yakin dengan porsi, pilih estimasi yang LEBIH KECIL.`;
    
    const visionResult = await visionModel.generateContent([visionPrompt, ...imageParts]);
    const foodDescription = visionResult.response.text();

    // Ambil deskripsi teks itu, dan tanya Gemini TEXT untuk "menganalisis nutrisi"
    
    const textModel = genAI.getGenerativeModel({ model: modelName });
    const nutritionPrompt = `
      Anda adalah ahli gizi. Berdasarkan deskripsi makanan berikut, berikan estimasi nutrisi (kalori, protein, karbohidrat, lemak).
      Deskripsi: "${foodDescription}"
      
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