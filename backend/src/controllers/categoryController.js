const mongoose = require('mongoose'); // To validate MongoDB ObjectIds
const Category = require('../models/Category'); // Import the Category model

// Fetch All Categories with Pagination and Sorting
const getCategories = async (req, res) => {
    // Get query parameters for pagination and sorting
    const page = Number(req.query.page) || 1; // Default to page 1
    const limit = Number(req.query.limit) || 10; // Default to 10 items per page
    const sortBy = req.query.sortBy || 'createdAt'; // Default sort by creation date
    const order = req.query.order === 'desc' ? -1 : 1; // Sort order: ascending or descending

    try {
        // Fetch categories from MongoDB
        const categories = await Category.find()
            .populate('parentCategory', 'name') // Populate parent category details
            .sort({ [sortBy]: order }) // Sort categories based on query parameter
            .skip((page - 1) * limit) // Skip items for pagination
            .limit(limit); // Limit the number of items per page

        // Send the categories as the response
        res.status(200).json(categories);
    } catch (error) {
        // Handle errors and return a 500 status code
        res.status(500).json({ message: error.message });
    }
};

// Fetch a Single Category by ID, Including Parent and Subcategories
const getCategoryById = async (req, res) => {
    const { id } = req.params; // Extract category ID from request parameters

    // Validate that the ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }

    try {
        // Find the category by ID and populate its parent and subcategories
        const category = await Category.findById(id)
            .populate('parentCategory', 'name') // Populate parent category details
            .populate('subcategories', 'name description'); // Populate subcategories

        if (!category) {
            // If the category is not found, return a 404 status
            return res.status(404).json({ message: 'Category not found' });
        }

        // Send the category details as the response
        res.status(200).json(category);
    } catch (error) {
        // Handle errors and return a 500 status code
        res.status(500).json({ message: error.message });
    }
};

// Create a New Category
const createCategory = async (req, res) => {
    const { name, description, parentCategory } = req.body; // Extract data from the request body

    try {
        // Create a new category document
        const category = new Category({ name, description, parentCategory });

        // Save the category to the database
        await category.save();

        // Send the newly created category as the response
        res.status(201).json(category);
    } catch (error) {
        // Handle errors and return a 500 status code
        res.status(500).json({ message: error.message });
    }
};

// Update an Existing Category
const updateCategory = async (req, res) => {
    const { id } = req.params; // Extract category ID from request parameters
    const { name, description, parentCategory } = req.body; // Extract updated data from the request body

    // Validate that the ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }

    try {
        // Find the category by ID
        const category = await Category.findById(id);

        if (!category) {
            // If the category is not found, return a 404 status
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update the category fields
        category.name = name || category.name;
        category.description = description || category.description;
        category.parentCategory = parentCategory || category.parentCategory;

        // Save the updated category to the database
        await category.save();

        // Send the updated category as the response
        res.status(200).json(category);
    } catch (error) {
        // Handle errors and return a 500 status code
        res.status(500).json({ message: error.message });
    }
};

// Delete a Category
// const deleteCategory = async (req, res) => {
//     const { id } = req.params; // Extract category ID from request parameters

//     // Validate that the ID is a valid MongoDB ObjectId
//     if (!mongoose.isValidObjectId(id)) {
//         return res.status(400).json({ message: 'Invalid category ID' });
//     }

//     try {
//         // Find the category by ID
//         const category = await Category.findById(id);

//         if (!category) {
//             // If the category is not found, return a 404 status
//             return res.status(404).json({ message: 'Category not found' });
//         }

//         // Remove the category from the database
//         await category.deleteOne();

//         // Send a success message as the response
//         res.status(200).json({ message: 'Category removed successfully' });
//     } catch (error) {
//         // Handle errors and return a 500 status code
//         res.status(500).json({ message: error.message });
//     }
// };


const deleteCategory = async (req, res) => {
    const { id } = req.params;

    // Validate that the ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }

    try {
        // Find the category by ID
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete all subcategories that reference this category as their parent
        await Category.deleteMany({ parentCategory: id });

        // Remove the parent category
        await category.deleteOne();

        res.status(200).json({ message: 'Category and its subcategories removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Export all controller methods
module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
