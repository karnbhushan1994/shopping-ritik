const express = require('express');
const {
    createProduct,
    editProduct,
    deleteProduct,
    getProductById,
    updateInventory,
    addReview,
    applyDiscount,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware'); // Middleware for authentication and admin check

const validateObjectId = require('../middlewares/validateObjectId');

const router = express.Router();

// Route to create a new product (Admin only)
router.post('/', protect, admin, createProduct);

// Route to edit an existing product (Admin only)
router.put('/:id', protect, admin, editProduct);

// Route to delete a product (Admin only)
router.delete('/:id', protect, admin, deleteProduct);

// Route to fetch a product by ID (Public)
router.get('/:id', getProductById);

// Route to update inventory after a purchase
router.put('/update-inventory', protect, updateInventory); // Dedicated route for updating inventory
router.get('/:id', validateObjectId, getProductById); // Fetch product by ID


// Route to add a review to a product (Authenticated users)
router.post('/add-review', protect, addReview);

// Route to apply a discount to a product (Admin only)
//router.put('/apply-discount', protect, admin, applyDiscount);

//router.put('/apply-discount', protect, admin, validateObjectId, applyDiscount);

router.put('/apply-discount/:id', validateObjectId, applyDiscount);

module.exports = router;
