const express = require('express');
const {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware'); // Middleware for authentication

const router = express.Router();

// Route to add a product to the wishlist
router.post('/add', protect, addToWishlist);

// Route to remove a product from the wishlist
router.post('/remove', protect, removeFromWishlist);

// Route to get all products in the wishlist
router.get('/', protect, getWishlist);

module.exports = router;
