const express = require('express');
const { updateProfile, manageAddresses } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.put('/update', protect, updateProfile);
router.put('/addresses', protect, manageAddresses);

module.exports = router;
