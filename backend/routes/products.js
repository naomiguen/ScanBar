const express = require('express');
const ProductRequest = require('../models/ProductRequest');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//HELPER FUNCTION: Create or Update Product Request
async function createOrUpdateProductRequest(barcode, userId, userName, userEmail) {
  try {
    const normalizedBarcode = barcode.trim().replace(/\D/g, '');
    
    console.log('='.repeat(60));
    console.log('[CREATE REQUEST] Starting...');
    console.log('Barcode:', normalizedBarcode);
    console.log('User ID:', userId);
    console.log('User Email:', userEmail);
    console.log('User Name:', userName);
    console.log('='.repeat(60));

    // VALIDASI: Pastikan userId ada
    if (!userId) {
      console.error(' [CREATE REQUEST] FAILED: userId is undefined!');
      console.error(' This means auth middleware did not set req.user');
      return null;
    }

    // Cek apakah sudah ada request pending untuk barcode ini
    const existingRequest = await ProductRequest.findOne({
      barcode: normalizedBarcode,
      status: 'pending'
    });

    if (existingRequest) {
      console.log('[CREATE REQUEST] Found existing pending request!');
      console.log(' - Request ID:', existingRequest._id);
      console.log(' - Current attempt count:', existingRequest.attemptCount);
      console.log(' - Previous request date:', existingRequest.lastAttemptDate);
      
      // Update attempt count dan last attempt date
      existingRequest.attemptCount += 1;
      existingRequest.lastAttemptDate = new Date();
      
      const updatedRequest = await existingRequest.save();

      console.log(' [CREATE REQUEST] Updated existing request!');
      console.log('   - New attempt count:', updatedRequest.attemptCount);
      console.log('   - Updated date:', updatedRequest.lastAttemptDate);
      console.log('='.repeat(60));
      
      return updatedRequest;
    }

    // Tidak ada request pending, buat yang baru
    console.log(' [CREATE REQUEST] No existing request found. Creating new...');
    
    const newRequest = new ProductRequest({
      barcode: normalizedBarcode,
      requestedBy: userId,
      requestedByName: userName,
      requestedByEmail: userEmail,
      status: 'pending',
      attemptCount: 1,
      lastAttemptDate: new Date(),
      createdAt: new Date()
    });
    
    console.log(' [CREATE REQUEST] Saving to database...');
    console.log('   - Data to save:', JSON.stringify(newRequest, null, 2));
    
    const savedRequest = await newRequest.save();
    
    console.log(' [CREATE REQUEST] SUCCESS! New request created!');
    console.log('   - Request ID:', savedRequest._id);
    console.log('   - Barcode:', savedRequest.barcode);
    console.log('   - Status:', savedRequest.status);
    console.log('   - Requested by:', savedRequest.requestedByName);
    console.log('   - Attempt count:', savedRequest.attemptCount);
    console.log('='.repeat(60));
    
    return savedRequest;
    
  } catch (err) {
    console.error('[CREATE REQUEST] ERROR occurred!');
    console.error('   - Error message:', err.message);
    console.error('   - Error stack:', err.stack);
    console.error('='.repeat(60));
    return null;
  }
}

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

    try {
      const resolveResult = await ProductRequest.updateMany(
        { barcode: normalizedCode, status: 'pending' },
        {
          status: 'completed',
          resolvedAt: new Date(),
          resolvedBy: req.user.id,
          adminNotes: 'Product added by admin'
        }
      );

      if (resolveResult.modifiedCount > 0) {
        console.log(`Auto-resolved ${resolveResult.modifiedCount} product request(s) for ${normalizedCode}`);
      }
    } catch (resolveErr) {
      console.error(' Error auto-resolving requests:', resolveErr.message);
    }
    
    // Verify data after insert
    const storedProduct = await db.collection('products').findOne({ code: normalizedCode });
    console.log(' [ADMIN] Product stored successfully:');

    res.json({ 
      msg: 'Produk berhasil disimpan!', 
      product: newProduct,
    });

  } catch (err) {
    console.error('[ADMIN ERROR]', err.message);
    res.status(500).json({ 
      msg: 'Server Error saat input admin',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


//  RUTE CARI PRODUK (LAZY LOADING / HYBRID)
// Endpoint: GET /api/products/:code
router.get('/:code', auth, async (req, res) => {
  try {
    const db = req.app.locals.db; 
    const { code } = req.params; 

    console.log(`[BARCODE SEARCH] Raw input: "${code}"`);
    console.log(`[BARCODE SEARCH] User: ${req.user?.email || req.user?.id}`);
    console.log(`[BARCODE SEARCH] User object:`, req.user);
    console.log(`[BARCODE SEARCH] Normalized: "${normalizedCode}"`);

    // Validasi barcode
    if (!code || code.trim() === '') {
      return res.status(400).json({ msg: 'Kode barcode tidak valid' });
    }

    // Normalisasi barcode (hapus spasi, karakter non-digit)
    const normalizedCode = code.trim().replace(/\D/g, '');
    
    if (normalizedCode.length < 8) {
      return res.status(400).json({ msg: 'Kode barcode terlalu pendek' });
    }
    console.log(`[BARCODE SEARCH] Normalized: "${normalizedCode}"`);

    // CEK DATABASE LOKAL
    console.log(`[STEP 1] Checking local database for barcode: ${normalizedCode}`);
    
    const localProduct = await db.collection('products').findOne({ 
      code: normalizedCode 
    });

    if (localProduct) {
      console.log(' Found in local database!');
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
    console.log(' Tidak ada di lokal. Mencari di Open Food Facts...');
    
    try {
      const offResponse = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${normalizedCode}.json`,
        { timeout: 8000 }
      );
      
      const offData = offResponse.data;

      if (offData.status !== 1 || !offData.product) {
        console.log('[API] Product not found in Open Food Facts.');
        
        // CREATE NOTIFICATION FOR ADMIN
        console.log(' [NOTIFICATION] Creating product request...');
        console.log('   - req.user exists:', !!req.user);
        console.log('   - req.user.id:', req.user?.id);


        await createOrUpdateProductRequest(
          normalizedCode, 
          req.user.id,
          req.user.name || req.user.email || 'Unknown User',
          req.user.email || 'unknown@example.com'
        );

        return res.status(404).json({ 
          msg: 'Produk tidak ditemukan di database manapun',
          suggestion: 'Silakan gunakan fitur input manual untuk menambahkan produk ini'
        });
      }

      const p = offData.product;
      const nutrients = p.nutriments || {};
      
      console.log('Memvalidasi data nutrisi...');
      
      // Ambil nilai nutrisi
      const calories = nutrients["energy-kcal"] || nutrients["energy-kcal_100g"] || 0;
      const proteins = nutrients.proteins_100g || nutrients.proteins || 0;
      const carbs = nutrients.carbohydrates_100g || nutrients.carbohydrates || 0;
      const fat = nutrients.fat_100g || nutrients.fat || 0;
      
      // Validasi
      const hasValidNutrition = calories > 0 || proteins > 0 || carbs > 0 || fat > 0;

      if (!hasValidNutrition) {
        console.log('VALIDASI GAGAL: Data nutrisi kosong atau tidak valid');
        console.log(' [NOTIFICATION] Creating product request for incomplete nutrition');
        console.log('   - req.user exists:', !!req.user);
        console.log('   - req.user.id:', req.user?.id);

        await createOrUpdateProductRequest(
          normalizedCode,
          req.user.id,
          req.user.name || req.user.email || 'Unknown User',
          req.user.email || 'unknown@example.com'
        );

        return res.status(404).json({ 
          msg: 'Produk ditemukan tetapi data nutrisi tidak lengkap',
          suggestion: 'Silakan gunakan fitur input manual untuk melengkapi data nutrisi',
          productName: p.product_name || "Nama tidak tersedia"
        });
      }

      console.log('Validasi berhasil - Data nutrisi valid!');

      // FORMAT KONSISTEN
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
        console.error('Timeout saat menghubungi Open Food Facts');
        return res.status(504).json({ 
          msg: 'Koneksi ke server data eksternal timeout',
          suggestion: 'Silakan coba lagi atau gunakan input manual'
        });
      }
      
      if (apiError.response?.status === 404) {
        console.log('Produk tidak ditemukan di Open Food Facts (404)');

        await createOrUpdateProductRequest(
          normalizedCode,
          req.user.id,
          req.user.name || req.user.email || 'Unknown User',
          req.user.email || 'unknown@example.com'
        );

        return res.status(404).json({ 
          msg: 'Produk tidak ditemukan di database manapun',
          suggestion: 'Silakan gunakan fitur input manual'
        });
      }

      console.error('Error saat menghubungi Open Food Facts:', apiError.message);
      return res.status(503).json({ 
        msg: 'Gagal menghubungi server data eksternal',
        suggestion: 'Silakan coba lagi atau gunakan input manual'
      });
    }

  } catch (err) {
    console.error('Server Error:', err.message);
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
        calories: parseFloat(calories) || 0,
        proteins: parseFloat(proteins) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        sugar: parseFloat(sugar) || 0,
        sodium: parseFloat(sodium) || 0
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