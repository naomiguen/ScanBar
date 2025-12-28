
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Setiap email harus unik
  },
  password: {
    type: String,
    required: true,
  },
  dailyCalorieGoal: {
  type: Number,
  default: 2000
  },
  dailyProteinGoal: {
    type: Number,
    default: 100
  },
  dailyCarbsGoal: {
    type: Number,
    default: 250
  },
  dailyFatGoal: {
    type: Number,
    default: 60
  },
  dailySugarGoal: {
    type: Number,
    default: 50
  },
  dailySaltGoal: {
    type: Number,
    default: 6
  },
  isVerified: {
    type: Boolean,
    default: false, // Defaultnya false saat pertama daftar
  },
  verificationToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  age: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  dailyCalorieGoal: {
    type: Number,
    default: 0,
  },
  dailyProteinGoal: {
    type: Number,
    default: 0,
  },
  dailyCarbsGoal: {
    type: Number,
    default: 0,
  },
  dailyFatGoal: {
    type: Number,
    default: 0,
  },
  dailySugarGoal: {
    type: Number,
    default: 0,
  },
  dailySaltGoal: {
    type: Number,
    default: 0,
  },
});

// Perintah Ajaib: Sebelum data pengguna disimpan...
userSchema.pre('save', async function (next) {
  // ...jika password-nya baru atau diubah, hash dulu password-nya
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);