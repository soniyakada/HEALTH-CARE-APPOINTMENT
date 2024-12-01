const express = require("express");
const router = express.Router();
const Appointment = require('../models/appointment');
const User = require("../models/User"); // Adjust the path as needed

router.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;

  // Validate the ID format (Optional, depending on your database type)
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare a clean response object
    const userDetails = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender || "Not specified",
      dateOfBirth: user.dateOfBirth || "Not specified",
      contactNumber: user.contactNumber || "Not specified",
      address: user.address || "Not specified",
      specialization: user.specialization || "N/A",
      experience: user.experience || "N/A",
      availability: user.availability || "N/A",
      fees: user.fees || "N/A",
    };

    // Respond with user details
    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error("Error fetching user profile:", error); // Log error for debugging
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// POST route to book an appointment
router.post('/appointment', async (req, res) => {
  try {
    const { patient, doctor, date, timeSlot } = req.body;

    // Validate all required fields
    if (!patient || !doctor || !date || !timeSlot) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Validate that the doctor and patient exist
    const patientExists = await User.findById(patient);
    const doctorExists = await User.findById(doctor);

    if (!patientExists || !doctorExists) {
      return res.status(400).json({ error: 'Invalid patient or doctor' });
    }

    // Ensure the doctor has a "doctor" role
    if (doctorExists.role !== 'doctor') {
      return res.status(400).json({ error: 'The selected doctor is not valid' });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      patient,
      doctor,
      date,
      timeSlot,
    });

    // Save the appointment to the database
    await newAppointment.save();

    // Send a success response
    res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});



module.exports = router;
