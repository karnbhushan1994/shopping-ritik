const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(morgan('dev'));

// Default Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Register Route 
app.use('/api/auth', authRoutes);

//for admin

app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
