const mongoose = require('mongoose');

const dailyAnalysisSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    index: true // Index untuk query yang lebih cepat
  },
  date: {
    type: Date,
    required: true,
    index: true // Index untuk query berdasarkan tanggal
  },
  analysisText: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Menambahkan createdAt dan updatedAt otomatis
});

// Compound index untuk query user + date yang lebih efisien
dailyAnalysisSchema.index({ user: 1, date: 1 }, { unique: true });

const DailyAnalysis = mongoose.model('DailyAnalysis', dailyAnalysisSchema);

module.exports = DailyAnalysis;