const express = require('express');
const User = require('../models/User'); // Assuming your schema is in models/User.js
const router = express.Router();


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
router.get('/doctor/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id)
      .populate({
        path: 'appointments',
        populate: {
          path: 'patient', // Populate patient details
          select: 'name', // Only include the patient's name
        },
      });

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ error: 'Doctor not found or invalid role' });
    }

    // Return the doctor's profile along with populated appointments
    res.status(200).json({ doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctor profile' });
  }
});



module.exports = router;
