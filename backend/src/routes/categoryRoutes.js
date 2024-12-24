const express = require('express');
const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getCategories); // Public
router.get('/:id', getCategoryById); // Public
router.post('/', protect, admin, createCategory); // Admin
router.put('/update/:id', protect, admin, updateCategory); // Admin
router.delete('/delete/:id', protect, admin, deleteCategory); // Admin

module.exports = router;
