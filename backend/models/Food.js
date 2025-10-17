

const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  // Menghubungkan catatan makanan ini ke seorang pengguna
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referensi ke model 'User'
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    default: 0,
  },
  carbs: {
    type: Number,
    default: 0,
  },
  fat: {
    type: Number,
    default: 0,
  },
  barcode: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now, // Otomatis mencatat waktu saat ini
  },
  imageUrl: { type: String }
});

module.exports = mongoose.model('Food', FoodSchema);