const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }], // Array of image URLs
    brand: { type: String },
    sku: { type: String, unique: true, required: true }, // Unique SKU for each product
    countInStock: { type: Number, required: true }, // Inventory count
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String, required: true },
        },
    ],
    rating: { type: Number, default: 0 }, // Average rating
    numReviews: { type: Number, default: 0 }, // Total number of reviews
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
