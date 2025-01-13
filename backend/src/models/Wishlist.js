const mongoose = require('mongoose');

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Each wishlist is associated with a user
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference to Product model
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
