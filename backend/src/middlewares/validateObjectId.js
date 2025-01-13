const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    const id = req.params.id || req.body.productId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ObjectId format' });
    }
    next();
};

module.exports = validateObjectId;

