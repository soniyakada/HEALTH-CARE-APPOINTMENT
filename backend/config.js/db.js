const mongoose = require('mongoose');

// const mongoURI = process.env.MONGO_URI; // Access the MongoDB URI from .env


const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://soniyakada:MCj3g7nJaaHBStW2@cluster0.951ho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  
  }
};

module.exports = connectDB;

