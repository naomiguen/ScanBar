const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Helper: normalisasi nutriments ke key yang konsisten untuk frontend
function normalizeNutriments(nutriments) {
  const n = nutriments || {};

  const pick = (candidates) => {
    for (const k of candidates) {
      if (n[k] !== undefined && n[k] !== null && n[k] !== '') {
        const v = Number(n[k]);
        return isNaN(v) ? 0 : v;
      }
    }
    return 0;
  };

  const normalized = {};

  normalized['energy-kcal_100g'] = pick(['energy-kcal_100g', 'energy_100g', 'energy-kcal', 'energy', 'calories']);
  normalized['calories'] = normalized['energy-kcal_100g'];

  normalized['proteins_100g'] = pick(['proteins_100g', 'proteins', 'protein']);
  normalized['proteins'] = normalized['proteins_100g'];

  normalized['carbohydrates_100g'] = pick(['carbohydrates_100g', 'carbohydrates', 'carbs', 'carbohydrate']);
  normalized['carbohydrates'] = normalized['carbohydrates_100g'];

  normalized['fat_100g'] = pick(['fat_100g', 'fat', 'fats']);
  normalized['fat'] = normalized['fat_100g'];

  normalized['sugars_100g'] = pick(['sugars_100g', 'sugars', 'sugar']);
  normalized['sugars'] = normalized['sugars_100g'];

  normalized['salt_100g'] = pick(['salt_100g', 'salt', 'sodium_100g', 'sodium']);
  normalized['salt'] = normalized['salt_100g'];

  return normalized;
}

// Toggle favorit (Tambah/Hapus)
router.post('/', auth, async (req, res) => {
  try {
    const { productCode, productData } = req.body;
    
    // Debug log lebih detail
    console.log('📥 Full request body:', req.body);
    console.log('📥 productCode:', productCode);
    console.log('📥 productData:', productData);
    console.log('👤 User:', req.user);
    
    if (!productCode) {
      console.log('❌ productCode is missing!');
      return res.status(400).json({ 
        error: 'productCode diperlukan',
        received: req.body  
      });
    }

    // Cari produk di database
    let product = await Product.findOne({ code: productCode });
    console.log('🔍 Product found:', !!product); // Debug log
    
    if (!product && productData) {
      console.log('💾 Creating new product...'); // Debug log
      
      // Buat produk baru dari data yang dikirim
      product = new Product({
        code: productCode,
        product_name: productData.product_name || productData.productName,
        brands: productData.brands,
        image_url: productData.image_url || productData.imageUrl,
        image_small_url: productData.image_small_url,
        nutriments: productData.nutriments,
        serving_size: productData.serving_size
      });
      
      await product.save();
      console.log('✅ Product saved:', product.code); // Debug log
    } else if (!product) {
      console.log('❌ No product and no productData'); // Debug log
      return res.status(404).json({ 
        error: 'Produk tidak ditemukan dan data produk tidak disertakan' 
      });
    }

    // Cek apakah sudah ada di favorit
    const existing = await Favorite.findOne({
      userId: req.user._id,
      productCode: productCode
    });

    if (existing) {
      // Hapus dari favorit
      await Favorite.deleteOne({ _id: existing._id });
      console.log('Removed from favorites'); // Debug log
      return res.json({
        success: true,
        isFavorited: false,
        message: 'Dihapus dari favorit'
      });
    } else {
      // Tambah ke favorit
      const favorite = new Favorite({
        userId: req.user._id,
        productCode: productCode
      });
      await favorite.save();
      console.log('Added to favorites'); // Debug log
      return res.json({
        success: true,
        isFavorited: true,
        message: 'Ditambahkan ke favorit'
      });
    }
  } catch (error) {
    console.error('❌ Error toggle favorite:', error);
    res.status(500).json({ 
      error: 'Gagal memproses favorit',
      details: error.message 
    });
  }
});


// Ambil semua favorit dengan data produk lengkap
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .sort({ addedAt: -1 }); // Terbaru dulu

    // Ambil data produk untuk setiap favorit
    const productCodes = favorites.map(f => f.productCode);
    const products = await Product.find({ code: { $in: productCodes } });

    // Buat map untuk lookup cepat; pastikan kita meng-serialize dokumen ke plain object
    const productMap = {};
    products.forEach(p => {
      const obj = p.toObject ? p.toObject() : p;

      // Pastikan field nutriments selalu ada (set empty object jika tidak ada)
      obj.nutriments = obj.nutriments || {};

      // Normalisasi berbagai variasi key nutriments agar frontend menerima nilai konsisten
      const norm = normalizeNutriments(obj.nutriments);

      // Gabungkan normalisasi ke objek nutriments (tidak menimpa nilai asli bila ada)
      obj.nutriments = Object.assign({}, obj.nutriments, norm);

      productMap[p.code] = obj;
    });

    // Gabungkan data favorit dengan data produk (selalu sertakan nutriments, bisa kosong)
    const favoritesWithProducts = favorites.map(fav => ({
      _id: fav._id,
      productCode: fav.productCode,
      addedAt: fav.addedAt,
      product: productMap[fav.productCode] || { code: fav.productCode, nutriments: {} }
    }));

    res.json({
      success: true,
      favorites: favoritesWithProducts
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Gagal mengambil favorit' });
  }
});

// Cek status favorit untuk satu produk
router.get('/check/:productCode', auth, async (req, res) => {
  try {
    const { productCode } = req.params;
    
    const favorite = await Favorite.findOne({
      userId: req.user._id,
      productCode: productCode
    });

    res.json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ error: 'Gagal memeriksa status favorit' });
  }
});

module.exports = router;