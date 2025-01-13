const Wishlist = require('../models/Wishlist');

// Add Product to Wishlist
const addToWishlist = async (req, res) => {
    const { productId } = req.body;

    try {
        // Check if the user already has a wishlist
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            // If no wishlist exists, create a new one
            wishlist = new Wishlist({ user: req.user.id, products: [productId] });
        } else {
            // Add product to the wishlist if not already present
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            } else {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }
        }

        // Save the updated wishlist
        await wishlist.save();

        res.status(200).json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Remove Product from Wishlist
const removeFromWishlist = async (req, res) => {
    const { productId } = req.body;

    try {
        // Find the user's wishlist
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Remove the product from the wishlist
        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );

        // Save the updated wishlist
        await wishlist.save();

        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Products in Wishlist
const getWishlist = async (req, res) => {
    try {
        // Find the user's wishlist and populate product details
      
        const wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
            'products',
            'name price images'
        );

       // console.log(wishlist);

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
 addToWishlist,
 removeFromWishlist,
 getWishlist
};
