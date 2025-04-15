const mongoose = require('mongoose');
require('dotenv').config(); // This should be at the very topq

const MONGO_URI = process.env.MONGO_URI; // Access the MongoDB URI from .env


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  
  }
};

module.exports = connectDB;

