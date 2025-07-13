import dotenv from 'dotenv';
dotenv.config(); // This should be at the very top

import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI; // Access the MongoDB URI from .env


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  
  }
};

export default connectDB;

