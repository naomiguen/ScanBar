const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// RUTE TAMBAH PRODUK MANUAL (KHUSUS ADMIN)
// Endpoint: POST /api/products
router.post('/', auth, admin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { code, product_name, brands, calories, proteins, carbs, fat, sugar, sodium } = req.body;

    // Validasi input
    if (!code || !product_name) {
      return res.status(400).json({ msg: 'Kode barcode dan nama produk wajib diisi!' });
    }

    // Cek Duplikasi
    const existingProduct = await db.collection('products').findOne({ code: code });
    if (existingProduct) {
      return res.status(400).json({ msg: 'Produk dengan barcode ini sudah ada di database!' });
    }

    // Mapping Data sesuai format MongoDB
    const newProduct = {
      code: code,
      product_name: product_name,
      brands: brands || "Tidak Diketahui",
      image_url: "", // Kosongkan dulu kalau input manual
      nutriments: {
        "energy-kcal": parseFloat(calories) || 0,
        "proteins": parseFloat(proteins) || 0,
        "carbs": parseFloat(carbs) || 0,
        "fat": parseFloat(fat) || 0,
        "sugar": parseFloat(sugar) || 0, 
        "sodium": parseFloat(sodium) || 0
      },
      source: "local_admin_input", 
      created_at: new Date()
    };

    // Simpan ke MongoDB
    await db.collection('products').insertOne(newProduct);
    console.log(`[ADMIN] Produk ${code} berhasil ditambahkan manual.`);

    res.json({ msg: 'Produk berhasil disimpan!', product: newProduct });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error saat input admin');
  }
});


//  RUTE CARI PRODUK (LAZY LOADING / HYBRID)
// Endpoint: GET /api/products/:code
// Desc: Cek Lokal -> Jika Gagal -> Cek API Luar -> Simpan
router.get('/:code', async (req, res) => {
  try {
    const db = req.app.locals.db; 
    const { code } = req.params; 

    // Validasi barcode
    if (!code || code.trim() === '') {
      return res.status(400).json({ msg: 'Kode barcode tidak valid' });
    }

    // Normalisasi barcode (hapus spasi, karakter non-digit)
    const normalizedCode = code.trim().replace(/\D/g, '');
    
    if (normalizedCode.length < 8) {
      return res.status(400).json({ msg: 'Kode barcode terlalu pendek' });
    }

    // CEK DATABASE LOKAL
    console.log(`🔍 [STEP 1] Mencari produk ${normalizedCode} di database lokal...`);
    
    const localProduct = await db.collection('products').findOne({ 
      code: normalizedCode 
    });

    if (localProduct) {
      console.log('Ditemukan di database lokal!');
      
      // Format response yang konsisten
      return res.json({
        code: localProduct.code,
        product_name: localProduct.product_name,
        brands: localProduct.brands,
        image_url: localProduct.image_url || "",
        nutriments: localProduct.nutriments,
        source: localProduct.source,
        cached: true // Penanda bahwa ini dari cache
      });
    }

    // KALAU TIDAK ADA, CARI DI OPEN FOOD FACTS
    console.log('🌍 Tidak ada di lokal. Mencari di Open Food Facts...');
    
    try {
      const offResponse = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const offData = offResponse.data;

      // Cek apakah produk ditemukan di API
      if (offData.status !== 1 || !offData.product) {
        console.log('❌ [STEP 2] Produk tidak ditemukan di Open Food Facts.');
        return res.status(404).json({ 
          msg: 'Produk tidak ditemukan di database manapun',
          suggestion: 'Silakan gunakan fitur input manual untuk menambahkan produk ini'
        });
      }

      const p = offData.product;

      console.log('Memvalidasi data nutrisi...');
      
      const nutrients = p.nutriments || {};
      
      // Ambil nilai nutrisi
      const calories = nutrients["energy-kcal"] || nutrients["energy-kcal_100g"] || 0;
      const proteins = nutrients.proteins_100g || nutrients.proteins || 0;
      const carbs = nutrients.carbohydrates_100g || nutrients.carbohydrates || 0;
      const fat = nutrients.fat_100g || nutrients.fat || 0;
      
      // Validasi: Minimal harus ada salah satu nilai nutrisi yang > 0
      const hasValidNutrition = calories > 0 || proteins > 0 || carbs > 0 || fat > 0;

      if (!hasValidNutrition) {
        console.log('VALIDASI GAGAL: Data nutrisi kosong atau tidak valid');
        console.log(`   Kalori: ${calories}, Protein: ${proteins}, Karbo: ${carbs}, Lemak: ${fat}`);
        
        return res.status(404).json({ 
          msg: 'Produk ditemukan tetapi data nutrisi tidak lengkap',
          suggestion: 'Silakan gunakan fitur input manual untuk melengkapi data nutrisi',
          productName: p.product_name || "Nama tidak tersedia"
        });
      }

      console.log('Validasi berhasil - Data nutrisi valid!');
       

        //  Mapping Data (Format harus sama dengan input Admin di atas)
        const newProduct = {
        code: normalizedCode,
        product_name: p.product_name || "Tanpa Nama",
        brands: p.brands || "Tidak Diketahui",
        image_url: p.image_front_url || p.image_url || "",
        nutriments: {
          "energy-kcal": parseFloat(calories) || 0,
          "proteins": parseFloat(proteins) || 0,
          "carbs": parseFloat(carbs) || 0,
          "fat": parseFloat(fat) || 0,
          "sugar": parseFloat(nutrients.sugars_100g || nutrients.sugars || 0),
          "sodium": parseFloat(nutrients.sodium_100g || nutrients.sodium || 0)
        }, 
        source: "open_food_facts", 
        created_at: new Date(),
        last_updated: new Date()
      };

      // D. Simpan Cache ke MongoDB
      await db.collection('products').insertOne(newProduct);
      console.log('💾 Produk dari OFF berhasil disimpan ke database lokal.');

      return res.json({
        ...newProduct,
        cached: false // Penanda bahwa ini data fresh dari API
      });


    } catch (apiError) {
      // Handle error dari API eksternal
      if (apiError.code === 'ECONNABORTED') {
        console.error('⏱️ Timeout saat menghubungi Open Food Facts');
        return res.status(504).json({ 
          msg: 'Koneksi ke server data eksternal timeout',
          suggestion: 'Silakan coba lagi atau gunakan input manual'
        });
      }
      
      if (apiError.response?.status === 404) {
        console.log('❌ Produk tidak ditemukan di Open Food Facts (404)');
        return res.status(404).json({ 
          msg: 'Produk tidak ditemukan di database manapun',
          suggestion: 'Silakan gunakan fitur input manual'
        });
      }

      console.error('❌ Error saat menghubungi Open Food Facts:', apiError.message);
      return res.status(503).json({ 
        msg: 'Gagal menghubungi server data eksternal',
        suggestion: 'Silakan coba lagi atau gunakan input manual'
      });
    }

  } catch (err) {
    console.error('💥 Server Error:', err.message);
    res.status(500).json({ 
      msg: 'Terjadi kesalahan pada server',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.put('/:code', auth, admin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { code } = req.params;
    const { product_name, brands, calories, proteins, carbs, fat, sugar, sodium } = req.body;

    // Update data
    const updateData = {
      product_name: product_name,
      brands: brands,
      nutriments: {
        "energy-kcal": parseFloat(calories) || 0,
        "proteins": parseFloat(proteins) || 0,
        "carbs": parseFloat(carbs) || 0,
        "fat": parseFloat(fat) || 0,
        "sugar": parseFloat(sugar) || 0,
        "sodium": parseFloat(sodium) || 0
      },
      last_updated: new Date()
    };

    const result = await db.collection('products').updateOne(
      { code: code },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: 'Produk tidak ditemukan' });
    }

    console.log(`[ADMIN] Produk ${code} berhasil diupdate.`);
    res.json({ msg: 'Produk berhasil diupdate!', product: updateData });

  } catch (err) {
    console.error('Error saat update produk:', err.message);
    res.status(500).json({ msg: 'Server Error saat update produk' });
  }
});

// RUTE HAPUS PRODUK (KHUSUS ADMIN)
// Endpoint: DELETE /api/products/:code
router.delete('/:code', auth, admin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { code } = req.params;

    const result = await db.collection('products').deleteOne({ code: code });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'Produk tidak ditemukan' });
    }

    console.log(`[ADMIN] Produk ${code} berhasil dihapus.`);
    res.json({ msg: 'Produk berhasil dihapus!' });

  } catch (err) {
    console.error('Error saat hapus produk:', err.message);
    res.status(500).json({ msg: 'Server Error saat hapus produk' });
  }
});



module.exports = router;