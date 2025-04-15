const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redis.js');
require('dotenv').config(); // This should be at the very topq

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; // Access the MongoDB URI from .env


const router = express.Router();

// Sign-Up API
router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    contactNumber,
    gender,
    dateOfBirth,
    address,
    specialization,
    experience,
    availability,
    fees,
  } = req.body;
  
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user data object
    const userData = {
      name,
      email,
      password: hashedPassword, // Save the hashed password
      role,
      contactNumber,
      address,
    };

    // Add role-specific fields
    if (role === 'patient') {
      userData.gender = gender;
      userData.dateOfBirth = dateOfBirth;
    } else if (role === 'doctor') {
      userData.specialization = specialization;
      userData.experience = experience;
      userData.availability = availability;
      userData.fees = fees;
    }

    // Save the user to the database
    const user = new User(userData);
    await user.save();

    if (role === 'doctor' && specialization) {
      const redisKey = `specialization:${specialization.toLowerCase()}:doctors`;
      await redisClient.del(redisKey);
      console.log(`🧹 Redis cache invalidated: ${redisKey}`);
    }


    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

const generateToken = (userPayload) => {
  return jwt.sign(userPayload,JWT_SECRET_KEY, { expiresIn: "1d" });
};

// Sign-In API
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
   
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
     
     // Generate JWT token
     const token = generateToken({ id: user._id, role: user.role });

     // Store the token in the database
     user.token = token;
     await user.save();
  
      // Respond with the token and user details
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  });
  

  // Get JWT Token Route
router.get("/token/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has a token
    if (!user.token) {
      return res.status(404).json({ message: "No token found for this user" });
    }

    // Respond with the token
    res.status(200).json({
      message: "Token retrieved successfully",
      token: user.token,
    });
  } catch (error) {
    console.error("Error fetching token:", error);
    res.status(500).json({ message: "Error fetching token", error });
  }
});

// Logout API
router.post('/logout/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear the token
    user.token = null;
    await user.save();

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Error logging out', error });
  }
});

module.exports = router;
