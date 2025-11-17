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

    // Tanya Gemini VISION untuk "melihat" dan "mendeskripsikan" gambar
    const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const visionPrompt = "Tolong deskripsikan makanan di dalam foto ini secara detail, fokus pada item dan estimasi porsinya. Contoh: 'Satu piring berisi nasi putih (1 mangkuk), 1 potong rendang daging sapi, dan sayur daun singkong (2 sendok makan)'.";
    
    const visionResult = await visionModel.generateContent([visionPrompt, ...imageParts]);
    const foodDescription = visionResult.response.text();

    // Ambil deskripsi teks itu, dan tanya Gemini TEXT untuk "menganalisis nutrisi"
    const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });
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

    const jsonResponse = JSON.parse(nutritionText.replace(/```json/g, "").replace(/```/g, ""));
    
    res.json(jsonResponse);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;