const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Sign-Up API
router.post('/signup', async (req, res) => {
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

    // Create user object
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

    // Save the user
    const user = new User(userData);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});


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
      const token = jwt.sign(
        { id: user._id, role: user.role },
        "kjfskjf",
        { expiresIn: '1d' }
      );
  
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
  
module.exports = router;
