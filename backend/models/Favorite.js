const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
        index: true
    },
    productCode: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now

    }

}, {
    timestamps: true
});

//indels untuk query cepat dan mencegah dyuplikat
favoriteSchema.index({ userId: 1, productCode: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);