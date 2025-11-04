

const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  // Menghubungkan catatan makanan ini ke seorang pengguna
  user: {
    type: String,
    ref: 'User', // Referensi ke model 'User'
    required: true,
    index: true,
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
    index: true,
  },
  sugar: {
    type: Number,
    default: 0,
  },
  salt: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now, // Otomatis mencatat waktu saat ini
    index: true
  },
  imageUrl: { type: String }
});

FoodSchema.index({ user: 1, date: -1 }); // Index gabungan untuk user dan date

module.exports = mongoose.model('Food', FoodSchema);