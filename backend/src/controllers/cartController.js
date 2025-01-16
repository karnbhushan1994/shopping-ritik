const Cart = require('../models/Cart');

// Add Product to Cart
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // Find the user's cart
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Create a new cart if one doesn't exist
            cart = new Cart({ user: req.user.id, items: [{ product: productId, quantity }] });

        } else {
            // Check if the product already exists in the cart
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                // If product exists, update the quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Else, add the product to the cart
                cart.items.push({ product: productId, quantity });
            }
        }

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Product Quantity in Cart
const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Update quantity if product exists
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            return res.status(200).json({ message: 'Cart updated', cart });
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Remove Product from Cart
const removeFromCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Filter out the product to remove it
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Cart for the Logged-In User
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            'items.product',
            'name price images'
        );

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { addToCart, updateCart ,removeFromCart,getCart};