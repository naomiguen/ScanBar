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
- TROUBLESHOOTING teknis yang berhubungan dengan fitur scan (kamera, permission, browser compatibility, pencahayaan, dll)

Jika user bertanya di luar topik tersebut (politik, teknologi umum yang tidak ada hubungannya dengan app, hiburan, dsb), tolak dengan halus dan arahkan kembali ke topik makanan/nutrisi. Contoh: "Maaf, saya hanya bisa membantu topik seputar makanan, nutrisi, dan fitur Scanbar ya 😊 Ada yang ingin ditanyakan tentang makanan atau nutrisi?"

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

TROUBLESHOOTING KAMERA & SCAN:
Jika user mengalami masalah dengan kamera atau scanning, bantu dengan solusi berikut:

**Masalah Kamera Tidak Bisa Diakses:**
1. Permission Browser:
   - Chrome: Settings > Privacy and security > Site settings > Camera > pastikan Scanbar diizinkan
   - Safari: Settings > Safari > Camera > pilih "Ask" atau "Allow"
   - Firefox: Klik icon gembok di address bar > Permissions > Camera > pilih "Allow"

2. Permission Sistem (Android/iOS):
   - Android: Settings > Apps > Scanbar > Permissions > Camera > izinkan
   - iOS: Settings > Scanbar > Camera > izinkan

3. Browser Compatibility:
   - Gunakan Chrome, Safari, atau Firefox versi terbaru
   - Hindari browser lama atau tidak populer
   - Update browser ke versi terbaru

4. Kamera Digunakan Aplikasi Lain:
   - Tutup aplikasi lain yang mungkin pakai kamera (Zoom, video call, dll)
   - Restart aplikasi Scanbar

**Masalah Scan Tidak Akurat:**
- Pastikan pencahayaan cukup (tidak terlalu gelap/terang)
- Pegang HP stabil, jangan goyang
- Jarak ideal: 15-20cm dari makanan/barcode
- Bersihkan lensa kamera dari sidik jari/debu
- Untuk barcode: pastikan barcode tidak rusak atau terlipat

**Error HTTPS/SSL:**
- Kamera hanya bisa diakses di website HTTPS (secure)
- Jika ada warning "Not Secure", hubungi admin

CARA MENJAWAB:
1. Jawab pertanyaan navigasi dengan jelas (step-by-step)
2. Untuk pertanyaan resep: berikan nama resep, bahan, cara masak, estimasi nutrisi per porsi
3. Untuk masalah teknis scan/kamera: berikan solusi troubleshooting yang relevan
4. Gunakan bahasa Indonesia yang ramah dan mudah dipahami
5. Jika ditanya di luar topik makanan/nutrisi/app, tolak dengan sopan
6. Fokus pada informasi yang akurat dan membantu

Contoh penolakan topik di luar scope:
User: "Siapa presiden Indonesia?"
Kamu: "Maaf, saya hanya bisa membantu dengan topik makanan, nutrisi, dan cara pakai Scanbar 😊 Mau tanya resep sehat atau cara scan makanan?"`;

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const lowerMsg = message.toLowerCase();
    
    // Quick responses untuk troubleshooting kamera
    if ((lowerMsg.includes('kamera') || lowerMsg.includes('camera')) && 
        (lowerMsg.includes('tidak bisa') || lowerMsg.includes('gabisa') || 
         lowerMsg.includes('ga bisa') || lowerMsg.includes('error') || 
         lowerMsg.includes('tidak berfungsi') || lowerMsg.includes('blocked'))) {
      return res.json({
        response: `**Solusi Kamera Tidak Bisa Diakses:**\n\n **Cek Permission Browser:**\n• Chrome: Settings > Privacy and security > Site settings > Camera > izinkan Scanbar\n• Safari (iOS): Settings > Safari > Camera > pilih "Allow"\n• Firefox: Klik icon gembok di URL > Camera > Allow\n\n📲 **Cek Permission HP:**\n• Android: Settings > Apps > Scanbar > Permissions > Camera ✓\n• iOS: Settings > Scanbar > Camera ✓\n\n🔄 **Langkah Lain:**\n1. Pastikan tidak ada app lain yang pakai kamera (Zoom, WhatsApp call, dll)\n2. Restart browser atau aplikasi\n3. Update browser ke versi terbaru\n4. Coba browser lain (Chrome/Safari/Firefox)\n\n💡 Kalau masih belum bisa, coba restart HP dulu ya!\n\nMasih ada masalah? Ceritakan error message yang muncul.`
      });
    }

    // Quick response untuk masalah scan tidak akurat
    if ((lowerMsg.includes('scan') || lowerMsg.includes('barcode') || lowerMsg.includes('deteksi')) && 
        (lowerMsg.includes('tidak akurat') || lowerMsg.includes('salah') || 
         lowerMsg.includes('tidak terdeteksi') || lowerMsg.includes('blur') || 
         lowerMsg.includes('tidak jelas'))) {
      return res.json({
        response: `**Tips Agar Scan Lebih Akurat:**\n\n **Pencahayaan:**\n• Pastikan ruangan cukup terang\n• Hindari cahaya terlalu terang atau backlight\n• Cahaya alami (siang hari) paling bagus\n\n **Teknik Scan:**\n• Pegang HP stabil (jangan goyang)\n• Jarak ideal: 15-20cm dari makanan/barcode\n• Posisi kamera tegak lurus\n• Untuk barcode: pastikan seluruh barcode masuk frame\n\n **Maintenance:**\n• Bersihkan lensa kamera dari sidik jari/debu\n• Pastikan barcode tidak rusak atau kusut\n\n **Koneksi:**\n• Pastikan internet stabil (untuk AI detection)\n\nCoba lagi dengan tips ini ya! Kalau masih bermasalah, screenshot error-nya.`
      });
    }
    
    // Quick responses untuk navigasi (existing code)
    if (lowerMsg.includes('scan barcode') || (lowerMsg.includes('barcode') && lowerMsg.includes('dimana'))) {
      return res.json({
        response: `**Cara Scan Barcode:**\n\n${APP_NAVIGATION.scanBarcode}\n\nLangkah-langkah:\n1. Arahkan kamera ke barcode produk\n2. Tunggu hingga terdeteksi otomatis\n3. Info nutrisi akan muncul\n4. Tap "Simpan ke Jurnal" untuk mencatat\n\n💡 Barcode biasanya ada di belakang atau samping kemasan produk.`
      });
    }
    
    if (lowerMsg.includes('scan makanan') || (lowerMsg.includes('foto makanan') && lowerMsg.includes('dimana'))) {
      return res.json({
        response: `**Cara Scan Makanan:**\n\n${APP_NAVIGATION.scanMakanan}\n\nLangkah-langkah:\n1. Arahkan kamera ke makanan\n2. Tap tombol "Analisis"\n3. AI akan deteksi jenis makanan dan nutrisinya\n4. Review hasilnya\n5. Tap "Simpan ke Jurnal"\n\n💡 Pastikan pencahayaan cukup agar deteksi lebih akurat!`
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
        parts: [{ text: 'Baik, saya siap membantu sebagai asisten Scanbar yang fokus pada topik makanan, nutrisi, panduan aplikasi, dan troubleshooting fitur scan!' }]
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