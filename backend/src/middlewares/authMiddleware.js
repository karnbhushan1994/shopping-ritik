const jwt = require('jsonwebtoken'); // JSON Web Token library for verifying tokens
const User = require('../models/User'); // User model for database operations

// Protect Routes Middleware
const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user associated with the token, excluding the password field
            req.user = await User.findById(decoded.id).select('-password');
            next(); // Move to the next middleware or route handler
        } catch (error) {
            // Handle token verification failure
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is found, return an error response
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Role-Based Access Control for Admin
const admin = (req, res, next) => {
    // Check if the user exists and has the 'Admin' role
    if (req.user && req.user.role === 'Admin') {
        next(); // Move to the next middleware or route handler
    } else {
        // Return an error response if the user is not an admin
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

// Role-Based Access Control for Super Admin
const superAdmin = (req, res, next) => {
    // Check if the user exists and has the 'SuperAdmin' role
    if (req.user && req.user.role === 'SuperAdmin') {
        next(); // Move to the next middleware or route handler
    } else {
        // Return an error response if the user is not a super admin
        res.status(403).json({ message: 'Not authorized as super admin' });
    }
};

// Export the middleware functions for use in other parts of the application
module.exports = { protect, admin, superAdmin };
