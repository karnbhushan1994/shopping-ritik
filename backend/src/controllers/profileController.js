const User = require('../models/User');

// Update Profile
const updateProfile = async (req, res) => {
    const userId = req.user.id; // Retrieved from token
    const { name, email } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage Addresses
const manageAddresses = async (req, res) => {
    const userId = req.user.id;
    const { addresses } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.addresses = addresses;

        await user.save();

        res.status(200).json({ message: 'Addresses updated successfully', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateProfile, manageAddresses };
