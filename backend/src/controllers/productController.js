const Product = require('../models/Product');

// Create a New Product
const createProduct = async (req, res) => {
    const { name, category, description, price, images, brand, sku, countInStock } = req.body;

    try {
        // Check if a product with the same SKU already exists
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({ message: 'SKU must be unique' });
        }

        // Create a new product
        const product = new Product({
            name,
            category,
            description,
            price,
            images,
            brand,
            sku,
            countInStock,
        });

        // Save the product to the database
        await product.save();

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit an Existing Product
const editProduct = async (req, res) => {
    const { id } = req.params; // Product ID from the route
    const { name, category, description, price, images, brand, sku, countInStock } = req.body;

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product fields
        product.name = name || product.name;
        product.category = category || product.category;
        product.description = description || product.description;
        product.price = price || product.price;
        product.images = images || product.images;
        product.brand = brand || product.brand;
        product.sku = sku || product.sku;
        product.countInStock = countInStock || product.countInStock;

        // Save the updated product
        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a Product
const deleteProduct = async (req, res) => {
    const { id } = req.params; // Product ID from the route

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the product
        await product.deleteOne();

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Product by ID
const getProductById = async (req, res) => {
    const { id } = req.params; // Product ID from the route

    try {
        // Find the product by ID and populate category details
        const product = await Product.findById(id).populate('category', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateInventory = async (req, res) => {
    try {
        const { productId, count } = req.body;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Find and update the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.countInStock += count; // Example logic
        await product.save();

        res.json({ message: 'Inventory updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Add Review to a Product
const addReview = async (req, res) => {
    const { productId, rating, comment } = req.body; // Extract review details from the request body

    try {
        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user has already reviewed the product
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user.id.toString()
        );

        if (alreadyReviewed) {
            // If the user has already reviewed, return 400 error
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        // Create a new review
        const review = {
            user: req.user.id, // ID of the reviewing user
            name: req.user.name, // Name of the reviewing user
            rating: Number(rating), // Rating given by the user
            comment, // Review comment
        };

        // Add the review to the product's reviews array
        product.reviews.push(review);
        product.numReviews = product.reviews.length; // Update total number of reviews

        // Update the product's average rating
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        // Save the updated product to the database
        await product.save();

        // Respond with success message and updated product
        res.status(201).json({ message: 'Review added', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const applyDiscount = async (req, res) => {
    const { discountPercentage } = req.body; // Get discountPercentage from the request body
    const productId = req.params.id; // Get product ID from the route parameter

    console.log('Product ID:', productId);
    console.log('Discount Percentage:', discountPercentage);

    // Validate discount percentage
    if (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100) {
        console.error('Invalid discount percentage:', discountPercentage);
        return res.status(400).json({ message: 'Discount percentage must be a number between 0 and 100' });
    }

    try {
        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            console.error('Product not found:', productId);
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product found:', product);

        // Calculate the discounted price
        const discountedPrice = product.price - (product.price * discountPercentage) / 100;

        // Update the product's price
        product.price = discountedPrice;

        // Save the updated product to the database
        await product.save();

        console.log('Discount applied successfully:', product);
        res.status(200).json({ message: 'Discount applied successfully', product });
    } catch (error) {
        console.error('Error applying discount:', error.message);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
// Export all methods
module.exports = {
    createProduct,
    editProduct,
    deleteProduct,
    getProductById,
    updateInventory,
    addReview,
    applyDiscount,
};
