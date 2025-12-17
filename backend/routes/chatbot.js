const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const APP_NAVIGATION = {
  scanBarcode: "Di halaman Home, tap card 'Scan Barcode makanan' di bagian Dua Cara Mudah Tracking Nutrisi",
  scanMakanan: "Di halaman Home, tap card 'Foto Makanan' tepat di samping tombol Scan Barcode. atau bisa langsung klik 'Scan Makanan' di bottom navigation, atau icon ☰ di pojok kanan atas",
  journal: "Tap icon 'Dashboard' di bottom navigation, atau icon ☰ di pojok kanan atas",
  editBMI: "Tap icon 'Calculator' di bottom navigation, atau icon ☰ di pojok kanan atas",
  profile: "Tap icon 'Profil' di bottom navigation, atau icon ☰ di pojok kanan atas"
};

// System prompt untuk chatbot
const SYSTEM_PROMPT = `Kamu adalah asisten virtual untuk aplikasi Scanbar - aplikasi tracking nutrisi makanan dan minuman.

BATASAN TOPIK:
Kamu HANYA membahas topik seputar:
- Makanan dan minuman
- Nutrisi (kalori, protein, karbohidrat, lemak, gula, garam)
- Resep masakan sehat
- Tips diet dan pola makan sehat
- Cara menggunakan fitur aplikasi Scanbar

Jika user bertanya di luar topik tersebut (politik, teknologi umum, hiburan, dsb), tolak dengan halus dan arahkan kembali ke topik makanan/nutrisi. Contoh: "Maaf, saya hanya bisa membantu topik seputar makanan, nutrisi, dan fitur Scanbar ya 😊 Ada yang ingin ditanyakan tentang makanan atau nutrisi?"

INFORMASI APLIKASI SCANBAR:
Fitur-fitur:
1. Scan Barcode - Scan barcode kemasan untuk info nutrisi otomatis
2. Scan Makanan - Foto makanan, AI deteksi dan hitung nutrisi realtime
3. Jurnal Harian - Catat semua makanan dengan total nutrisi harian
4. Target Nutrisi - Set target berdasarkan BMI (berat, tinggi, usia)

Navigasi Aplikasi:
- Scan Barcode: ${APP_NAVIGATION.scanBarcode}
- Scan Makanan: ${APP_NAVIGATION.scanMakanan}
- Lihat Jurnal: ${APP_NAVIGATION.journal}
- Atur BMI/Target: ${APP_NAVIGATION.editBMI}
- Profil: ${APP_NAVIGATION.profile}

CARA MENJAWAB:
1. Jawab pertanyaan navigasi dengan jelas (step-by-step)
2. Untuk pertanyaan resep: berikan nama resep, bahan, cara masak, estimasi nutrisi per porsi
3. Gunakan bahasa Indonesia yang ramah dan mudah dipahami
4. Jika ditanya di luar topik makanan/nutrisi/app, tolak dengan sopan
5. Fokus pada informasi yang akurat dan membantu

Contoh penolakan topik di luar scope:
User: "Siapa presiden Indonesia?"
Kamu: "Maaf, saya hanya bisa membantu dengan topik makanan, nutrisi, dan cara pakai Scanbar 😊 Mau tanya resep sehat atau cara scan makanan?"`;

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const lowerMsg = message.toLowerCase();
    
    // Quick responses untuk navigasi
    if (lowerMsg.includes('scan barcode') || (lowerMsg.includes('barcode') && lowerMsg.includes('dimana'))) {
      return res.json({
        response: `**Cara Scan Barcode:**\n\n${APP_NAVIGATION.scanBarcode}\n\nLangkah-langkah:\n1. Arahkan kamera ke barcode produk\n2. Tunggu hingga terdeteksi otomatis\n3. Info nutrisi akan muncul\n4. Tap "Simpan ke Jurnal" untuk mencatat\n\n Barcode biasanya ada di belakang atau samping kemasan produk.`
      });
    }
    
    if (lowerMsg.includes('scan makanan') || (lowerMsg.includes('foto makanan') && lowerMsg.includes('dimana'))) {
      return res.json({
        response: `**Cara Scan Makanan:**\n\n${APP_NAVIGATION.scanMakanan}\n\nLangkah-langkah:\n1. Arahkan kamera ke makanan\n2. Tap tombol "Analisis"\n3. AI akan deteksi jenis makanan dan nutrisinya\n4. Review hasilnya\n5. Tap "Simpan ke Jurnal"\n\n Pastikan pencahayaan cukup agar deteksi lebih akurat!`
      });
    }
    
    if (lowerMsg.includes('bmi') || lowerMsg.includes('atur ulang') || lowerMsg.includes('edit target') || lowerMsg.includes('ubah target')) {
      return res.json({
        response: `**Cara Atur Ulang BMI/Target Nutrisi:**\n\n${APP_NAVIGATION.editBMI}\n\nYang perlu diisi:\n- Berat badan (kg)\n- Tinggi badan (cm)\n- Usia (tahun)\n- Jenis kelamin\n- Tingkat aktivitas\n\nSistem akan otomatis hitung target kalori dan nutrisi harian kamu. Tap "Simpan" jika sudah selesai!`
      });
    }

    if (lowerMsg.includes('jurnal') && lowerMsg.includes('dimana')) {
      return res.json({
        response: `**Cara Lihat Jurnal Harian:**\n\n${APP_NAVIGATION.journal}\n\nDi jurnal kamu bisa:\n- Lihat semua makanan yang sudah di-scan hari ini\n- Cek total kalori, protein, karbo, lemak, gula, garam\n- Bandingkan dengan target nutrisi harian\n- Hapus atau edit entri makanan`
      });
    }

    // Jika bukan pertanyaan navigasi, gunakan Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    let chatHistory = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'Baik, saya siap membantu sebagai asisten Scanbar yang fokus pada topik makanan, nutrisi, dan panduan aplikasi!' }]
      }
    ];

    // Add previous messages (max 10 untuk efisiensi)
    if (history && history.length > 0) {
      const recentHistory = history.slice(-10);
      recentHistory.forEach(msg => {
        chatHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({ response });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Maaf, terjadi kesalahan. Coba lagi ya!' 
    });
  }
});

module.exports = router;