const mongoose = require('mongoose'); // Mongoose for MongoDB schema definition and interaction
const bcrypt = require('bcryptjs'); // bcryptjs for hashing passwords securely

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

// Pre-save middleware to hash the password before saving it to the database
userSchema.pre('save', async function (next) {  // Fixed "pre" instead of "prev"
    // Check if the password field has been modified
    if (!this.isModified('password')) return next(); // Skip hashing if password hasn't changed
    
    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt(10); // 10 rounds of salt complexity
    
    // Hash the password using bcrypt and the generated salt
    this.password = await bcrypt.hash(this.password, salt); // Replace the plain text password with the hash

    // Continue to the next middleware or save the user document
    next();
});

module.exports = mongoose.model('User', userSchema);
