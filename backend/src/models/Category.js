const mongoose = require('mongoose'); // Mongoose is used to interact with MongoDB

// Define the schema for Category
const categorySchema = new mongoose.Schema(
    {
        // The name of the category
        name: {
            type: String, // Data type is String
            required: [true, 'Category name is required'], // This field is mandatory
            unique: true, // Each category name must be unique
        },
        // A description of the category
        description: {
            type: String, // Data type is String
        },
        // Reference to the parent category, allowing nested categories
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
            ref: 'Category', // Reference to another Category document
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Define a virtual field to fetch subcategories of a category
categorySchema.virtual('subcategories', {
    ref: 'Category', // Refers to the same `Category` model
    localField: '_id', // The local field in this schema
    foreignField: 'parentCategory', // Matches the `parentCategory` field in subcategories
});

// Enable virtual fields when converting documents to JSON or Object
categorySchema.set('toObject', { virtuals: true }); // Include virtuals in plain objects
categorySchema.set('toJSON', { virtuals: true }); // Include virtuals in JSON responses

// Export the model so it can be used in other parts of the app
module.exports = mongoose.model('Category', categorySchema);


//Parent Category:


// {
//     "_id": "64b1f2d5f42e880012345678",
//     "name": "Electronics",
//     "description": "Devices and gadgets",
//     "createdAt": "2024-12-10T10:00:00Z",
//     "updatedAt": "2024-12-10T10:00:00Z"
// }


//Subcategory (with parentCategory):

// {
//     "_id": "64b1f2d5f42e880012345679",
//     "name": "Laptops",
//     "description": "Portable computers",
//     "parentCategory": "64b1f2d5f42e880012345678", // Refers to "Electronics"
//     "createdAt": "2024-12-10T11:00:00Z",
//     "updatedAt": "2024-12-10T11:00:00Z"
// }
