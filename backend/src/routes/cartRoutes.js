// routes/cartRoutes.js

const express = require('express');
const { addToCart, updateCart, removeFromCart, getCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware'); // Make sure the path is correct

const router = express.Router();

// Route to add a product to the cart
router.post('/add', protect, addToCart);

// Route to update product quantity in the cart
router.put('/update', protect, updateCart);

// Route to remove a product from the cart
router.post('/remove', protect, removeFromCart);

// Route to get the cart
router.get('/', protect, getCart);

module.exports = router;
