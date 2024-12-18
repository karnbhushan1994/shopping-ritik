const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/dashboard', protect, admin, (req, res) => {
    res.status(200).json({ message: 'Welcome to Admin Dashboard' });
});

module.exports = router;
