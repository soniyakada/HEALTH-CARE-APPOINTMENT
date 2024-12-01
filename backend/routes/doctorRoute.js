const express = require('express');
const User = require('../models/User'); // Assuming your schema is in models/User.js
const router = express.Router();

// Route to filter doctors by specialization
router.get('/doctors/specialization/:specialization', async (req, res) => {
  const { specialization } = req.params;

  try {
    // Find doctors who match the specialization
    const doctors = await User.find({
      role: 'doctor',
      specialization: { $regex: specialization, $options: 'i' }, // Case-insensitive search
    });

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found for the specified specialization.' });
    }

    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error. Could not fetch doctors.' });
  }
});

module.exports = router;
