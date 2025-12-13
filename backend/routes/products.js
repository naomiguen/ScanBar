const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// TEMPORARY DEBUG ENDPOINT (no auth) - for testing image_url storage
// Endpoint: POST /api/products/debug/test-add
router.post('/debug/test-add', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { code, product_name, brands, image_url, calories, proteins, carbs, fat, sugar, sodium } = req.body;

    console.log(' [DEBUG-ADD] Request body received:', JSON.stringify(req.body, null, 2));
    console.log(' [DEBUG-ADD] image_url extracted:', image_url);

    if (!code || !product_name) {
      return res.status(400).json({ msg: 'Code and product_name required' });
    }

    const normalizedCode = code.trim().replace(/\D/g, '');
    
    const newProduct = {
      code: normalizedCode,
      product_name: product_name,
      brands: brands || "Unknown",
      image_url: image_url || "",
      nutriments: {
        calories: parseFloat(calories) || 0,
        proteins: parseFloat(proteins) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        sugar: parseFloat(sugar) || 0,
        sodium: parseFloat(sodium) || 0
      },
      source: "test_debug",
      created_at: new Date()
    };

    console.log(' [DEBUG-ADD] Product object before insert:', JSON.stringify(newProduct, null, 2));
    
    const insertResult = await db.collection('products').insertOne(newProduct);
    
    console.log(' [DEBUG-ADD] Insert result:', insertResult);
    
    // Verify it was stored
    const storedProduct = await db.collection('products').findOne({ code: normalizedCode });
    console.log(' [DEBUG-ADD] Retrieved from DB after insert:', JSON.stringify(storedProduct, null, 2));

    return res.json({
      success: true,
      msg: 'Debug product added',
      sent_image_url: image_url,
      stored_image_url: storedProduct?.image_url,
      full_product: storedProduct
    });
  } catch (err) {
    console.error(' [DEBUG-ADD] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// RUTE TAMBAH PRODUK MANUAL (KHUSUS ADMIN)
// Endpoint: POST /api/products
router.post('/', auth, admin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { code, product_name, brands, image_url, calories, proteins, carbs, fat, sugar, sodium } = req.body;

    console.log('[ADMIN INPUT] Received product data:', { code, product_name, brands });
    console.log('[ADMIN INPUT] Full request body:', JSON.stringify(req.body, null, 2));
    console.log('[ADMIN INPUT] Extracted image_url:', { image_url, typeOf: typeof image_url });
    console.log('[ADMIN INPUT] Extracted sodium:', { sodium, typeOf: typeof sodium });

    // Validasi input
    if (!code || !product_name) {
      return res.status(400).json({ msg: 'Kode barcode dan nama produk wajib diisi!' });
    }

    // Normalisasi barcode
    const normalizedCode = code.trim().replace(/\D/g, '');

    // Cek Duplikasi
    const existingProduct = await db.collection('products').findOne({ code: normalizedCode });
    if (existingProduct) {
      return res.status(400).json({ msg: 'Produk dengan barcode ini sudah ada di database!' });
    }

    //  Handle image_url dengan default fallback
    const finalImageUrl = (image_url && String(image_url).trim() !== '') 
      ? String(image_url).trim() 
      : 'https://placehold.co/400?text=No+Image';

    //  Parse sodium dengan benar
    const finalSodium = parseFloat(sodium) || 0;

    const newProduct = {
      code: normalizedCode,
      product_name: product_name,
      brands: brands || "Tidak Diketahui",
      image_url: finalImageUrl, 
      nutriments: {
        calories: parseFloat(calories) || 0,
        proteins: parseFloat(proteins) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        sugar: parseFloat(sugar) || 0,
        sodium: finalSodium, 
        sodium_100g: finalSodium 
      },
      source: "local_admin_input", 
      created_at: new Date()
    };

    // Debug sebelum insert
    console.log(' [ADMIN] Product object before INSERT:');
    console.log('   - image_url:', newProduct.image_url);
    console.log('   - nutriments.sodium:', newProduct.nutriments.sodium);
    console.log('   - nutriments.sodium_100g:', newProduct.nutriments.sodium_100g);
    
    await db.collection('products').insertOne(newProduct);
    
    // Verify data after insert
    const storedProduct = await db.collection('products').findOne({ code: normalizedCode });
    console.log(' [ADMIN] Product stored successfully:');
    console.log('   - Stored image_url:', storedProduct?.image_url);
    console.log('   - Stored sodium:', storedProduct?.nutriments?.sodium);

    res.json({ 
      msg: 'Produk berhasil disimpan!', 
      product: newProduct,
      debug: {
        received_image_url: image_url,
        stored_image_url: storedProduct?.image_url,
        received_sodium: sodium,
        stored_sodium: storedProduct?.nutriments?.sodium
      }
    });

  } catch (err) {
    console.error('❌ [ADMIN ERROR]', err.message);
    res.status(500).json({ 
      msg: 'Server Error saat input admin',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


//  RUTE CARI PRODUK (LAZY LOADING / HYBRID)
// Endpoint: GET /api/products/:code
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
    console.log(`� [STEP 1] Checking local database for barcode: ${normalizedCode}`);
    console.log(`   - Original code: ${code}`);
    console.log(`   - Normalized code: ${normalizedCode}`);
    console.log(`   - Searching with query: { code: "${normalizedCode}" }`);
    
    const localProduct = await db.collection('products').findOne({ 
      code: normalizedCode 
    });
    
    if (localProduct) {
      console.log(`   ✅ Found in local DB:`, JSON.stringify(localProduct, null, 2));
    } else {
      console.log(`   ❌ Not found - checking what codes exist in collection...`);
      const allCodes = await db.collection('products').find({}).project({ code: 1 }).toArray();
      console.log(`   Available codes in DB:`, allCodes.map(p => p.code));
    }

    if (localProduct) {
      console.log('✅ Found in local database!');
      console.log(`   - Source: ${localProduct.source}`);
      console.log(`   - Product Name: ${localProduct.product_name}`);
      
      // Format response yang konsisten
      return res.json({
        code: localProduct.code,
        product_name: localProduct.product_name,
        brands: localProduct.brands,
        image_url: localProduct.image_url || "",
        nutriments: localProduct.nutriments,
        source: localProduct.source,
        cached: true
      });
    }

    // KALAU TIDAK ADA, CARI DI OPEN FOOD FACTS
    console.log('🌍 Tidak ada di lokal. Mencari di Open Food Facts...');
    
    try {
      const offResponse = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${normalizedCode}.json`,
        { timeout: 8000 }
      );
      
      const offData = offResponse.data;

      if (offData.status !== 1 || !offData.product) {
        console.log('❌ [STEP 2] Produk tidak ditemukan di Open Food Facts.');
        return res.status(404).json({ 
          msg: 'Produk tidak ditemukan di database manapun',
          suggestion: 'Silakan gunakan fitur input manual untuk menambahkan produk ini'
        });
      }

      const p = offData.product;
      const nutrients = p.nutriments || {};
      
      console.log('✅ Memvalidasi data nutrisi...');
      
      // Ambil nilai nutrisi
      const calories = nutrients["energy-kcal"] || nutrients["energy-kcal_100g"] || 0;
      const proteins = nutrients.proteins_100g || nutrients.proteins || 0;
      const carbs = nutrients.carbohydrates_100g || nutrients.carbohydrates || 0;
      const fat = nutrients.fat_100g || nutrients.fat || 0;
      
      // Validasi
      const hasValidNutrition = calories > 0 || proteins > 0 || carbs > 0 || fat > 0;

      if (!hasValidNutrition) {
        console.log('⚠️ VALIDASI GAGAL: Data nutrisi kosong atau tidak valid');
        
        return res.status(404).json({ 
          msg: 'Produk ditemukan tetapi data nutrisi tidak lengkap',
          suggestion: 'Silakan gunakan fitur input manual untuk melengkapi data nutrisi',
          productName: p.product_name || "Nama tidak tersedia"
        });
      }

      console.log('✅ Validasi berhasil - Data nutrisi valid!');

      // ⭐ FORMAT KONSISTEN
      const newProduct = {
        code: normalizedCode,
        product_name: p.product_name || "Tanpa Nama",
        brands: p.brands || "Tidak Diketahui",
        image_url: p.image_front_url || p.image_url || "",
        nutriments: {
          calories: parseFloat(calories) || 0,
          proteins: parseFloat(proteins) || 0,
          carbs: parseFloat(carbs) || 0,
          fat: parseFloat(fat) || 0,
          sugar: parseFloat(nutrients.sugars_100g || nutrients.sugars || 0),
          sodium: parseFloat(nutrients.sodium_100g || nutrients.sodium || 0)
        }, 
        source: "open_food_facts", 
        created_at: new Date(),
        last_updated: new Date()
      };

      // Simpan Cache
      await db.collection('products').insertOne(newProduct);
      console.log('💾 Produk dari OFF berhasil disimpan ke database lokal.');

      return res.json({
        ...newProduct,
        cached: false
      });

    } catch (apiError) {
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
});//  RUTE CARI PRODUK (LAZY LOADING / HYBRID)
// Endpoint: GET /api/products/:code
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
    console.log(`Mencari produk ${normalizedCode} di database lokal...`);
    
    const localProduct = await db.collection('products').findOne({ 
      code: normalizedCode 
    });

    if (localProduct) {
      console.log(' Ditemukan di database lokal!');
      console.log(`   - Source: ${localProduct.source}`);
      
      // Format response yang konsisten
      return res.json({
        code: localProduct.code,
        product_name: localProduct.product_name,
        brands: localProduct.brands,
        image_url: localProduct.image_url || "",
        nutriments: localProduct.nutriments,
        source: localProduct.source,
        cached: true
      });
    }

    // KALAU TIDAK ADA, CARI DI OPEN FOOD FACTS
    console.log('Tidak ada di lokal. Mencari di Open Food Facts...');
    
    try {
      const offResponse = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${normalizedCode}.json`,
        { timeout: 8000 }
      );
      
      const offData = offResponse.data;

      if (offData.status !== 1 || !offData.product) {
        console.log('Produk tidak ditemukan di Open Food Facts.');
        return res.status(404).json({ 
          msg: 'Produk tidak ditemukan di database manapun',
          suggestion: 'Silakan gunakan fitur input manual untuk menambahkan produk ini'
        });
      }

      const p = offData.product;
      const nutrients = p.nutriments || {};
      
      console.log(' Memvalidasi data nutrisi...');
      
      // Ambil nilai nutrisi
      const calories = nutrients["energy-kcal"] || nutrients["energy-kcal_100g"] || 0;
      const proteins = nutrients.proteins_100g || nutrients.proteins || 0;
      const carbs = nutrients.carbohydrates_100g || nutrients.carbohydrates || 0;
      const fat = nutrients.fat_100g || nutrients.fat || 0;
      
      // Validasi
      const hasValidNutrition = calories > 0 || proteins > 0 || carbs > 0 || fat > 0;

      if (!hasValidNutrition) {
        console.log('⚠️ VALIDASI GAGAL: Data nutrisi kosong atau tidak valid');
        
        return res.status(404).json({ 
          msg: 'Produk ditemukan tetapi data nutrisi tidak lengkap',
          suggestion: 'Silakan gunakan fitur input manual untuk melengkapi data nutrisi',
          productName: p.product_name || "Nama tidak tersedia"
        });
      }

      console.log(' Validasi berhasil - Data nutrisi valid!');

      const newProduct = {
        code: normalizedCode,
        product_name: p.product_name || "Tanpa Nama",
        brands: p.brands || "Tidak Diketahui",
        image_url: p.image_front_url || p.image_url || "",
        nutriments: {
          calories: parseFloat(calories) || 0,
          proteins: parseFloat(proteins) || 0,
          carbs: parseFloat(carbs) || 0,
          fat: parseFloat(fat) || 0,
          sugar: parseFloat(nutrients.sugars_100g || nutrients.sugars || 0),
          sodium: parseFloat(nutrients.sodium_100g || nutrients.sodium || 0)
        }, 
        source: "open_food_facts", 
        created_at: new Date(),
        last_updated: new Date()
      };

      // Simpan Cache
      await db.collection('products').insertOne(newProduct);
      console.log('Produk dari OFF berhasil disimpan ke database lokal.');

      return res.json({
        ...newProduct,
        cached: false
      });

    } catch (apiError) {
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