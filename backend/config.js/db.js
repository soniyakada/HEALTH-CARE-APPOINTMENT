const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const mongoURI = process.env.MONGO_URI; // Access the MongoDB URI from .env


const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  
  }
};

module.exports = connectDB;

