const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    code: String,
    product_name: String,
    brands: String,
    image_url: String,
    image_small_url: String,
    nutriments: Object,
    serving_size: String,
}, {
    strict: false,
    collection: 'products'
});

//indeks untuk pencarian barcode cepat
productSchema.index({ code: 1 });

module.exports = mongoose.model('Product', productSchema);