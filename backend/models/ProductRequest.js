const mongoose = require('mongoose');

const ProductRequestSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
    index: true
  },
  requestedBy: {
    type: String,
    required: true,
    index: true
  },
  requestedByName: {
    type: String,
    required: true
  },
  requestedByEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending',
    index: true
  },
  attemptCount: {
    type: Number,
    default: 1
  },
  lastAttemptDate: {
    type: Date,
    default: Date.now,
    index : true
  },
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  resolvedAt: Date,
  resolvedBy: {
    type: String
  }
});

// Index untuk query yang sering digunakan
ProductRequestSchema.index({ status: 1, createdAt: -1 });
ProductRequestSchema.index({ barcode: 1, status: 1 });
ProductRequestSchema.index({ requestedBy: 1 });
ProductRequestSchema.index({ lastAttemptDate: -1 });

module.exports = mongoose.model('ProductRequest', ProductRequestSchema);