const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path as needed
const Appointment = require("../models/appointment");
const authenticate = require("../middleware/authenticate.js")
const redisClient = require('../utils/redis.js');

router.get("/profile/:id", authenticate ,async (req, res) => {
  const userId = req.params.id;

  // Validate the ID format (Optional, depending on your database type)
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const redisKey = `user:${userId}`;

    //  Check Redis cache
    const cachedUser = await redisClient.get(redisKey);
    if (cachedUser) {
      console.log('📦 Served from Redis cache');
      return res.status(200).json({ user: JSON.parse(cachedUser) });
    }

     //If not cached, query DB
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

    // Cache the result
    await redisClient.setEx(redisKey, 300, JSON.stringify(userDetails)); // TTL: 5 min

    // Respond with user details
    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error("Error fetching user profile:", error); // Log error for debugging
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// POST route to book an appointment
router.post('/appointment', authenticate, async (req, res) => {
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

    // Update the doctor's profile with the new appointment
    doctorExists.appointments.push(newAppointment._id);
    await doctorExists.save();

    // Clear Redis cache for the doctor's patient history
    const redisKey = `doctor:${doctor}:patient-history`;
    await redisClient.del(redisKey);
    
    // Invalidate Redis cache for patient's appointment list
    await redisClient.del(`patient:${patient}:appointments`);


    // Send a success response
    res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

router.get('/doctor/:id/patient-history', async (req, res) => {
 
    const doctorId = req.params.id;
    const redisKey = `doctor:${doctorId}:patient-history`;

    try {

     //Check Redis cache first
     const cachedHistory = await redisClient.get(redisKey);
     if (cachedHistory) {
       console.log('📦 Served from Redis cache');
       return res.status(200).json({ patientHistory: JSON.parse(cachedHistory) });
     }

     // If not cached, fetch from the database
    const doctor = await User.findById(doctorId).populate({
      path: 'appointments',
      populate: { path: 'patient' },
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const patientHistory = doctor.appointments.map((appointment) => ({
      patientName: appointment.patient.name,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      status: appointment.status,
    }));

    //Cache the data in Redis with an expiration time (e.g., 300 seconds)      
    await redisClient.setEx(redisKey, 300, JSON.stringify(patientHistory));

    res.status(200).json({ patientHistory });
  } catch (error) {
    console.error('Error fetching patient history:', error);
    res.status(500).json({ error: 'Failed to fetch patient history' });
  }
});


router.get('/patients/:id', authenticate,async (req, res) => {

  const patientId = req.params.id;
  const redisKey = `patient:${patientId}:details`;

  try {

     // Step 1: Check Redis cache
     const cachedData = await redisClient.get(redisKey);
     if (cachedData) {
       console.log('📦 Served from Redis cache');
       return res.status(200).json({ patient: JSON.parse(cachedData) });
     }

    // Fetch the user by ID and populate appointments
      const patient = await User.findById(patientId)
      .populate({
        path: 'appointments',
        model: 'Appointment', // Ensure this matches your Appointment model name
      });

    // Ensure the user exsts and is a patient
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ error: 'Patient not found or invalid role' });
    }

    const patientData = {
      name: patient.name,
      email: patient.email,
      contactNumber: patient.contactNumber,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
      appointments: patient.appointments,
    };
 
     // Step 3: Save to Redis for 5 minutes
     await redisClient.setEx(redisKey, 300, JSON.stringify(patientData));
  
    // Return patient details
    res.json({ patient: patientData });
  } catch (err) {
    console.error('Error fetching patient details:', err);
    res.status(500).json({ error: 'Failed to fetch patient details' });
  }
});


router.get('/patients/:id/appointments', authenticate, async (req, res) => {

  const patientId = req.params.id;
  const redisKey = `patient:${patientId}:appointments`;

  try {
      // 1. Check Redis cache
      const cachedData = await redisClient.get(redisKey);
      if (cachedData) {
        console.log('📦 Served from Redis cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

    const patient = await User.findById(patientId);

    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ error: 'Patient not found or invalid role' });
    }

    // Fetch all appointments for the patient
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate('doctor', 'name') // Populate doctor details
      .sort({ date: 1 }); // Sort by date (ascending)

    const currentDate = new Date();

    // Separate appointments into upcoming and past
    const upcomingAppointments = appointments.filter(appointment => new Date(appointment.date) > currentDate);
    const pastAppointments = appointments.filter(appointment => new Date(appointment.date) <= currentDate);

    const result = { upcomingAppointments, pastAppointments };

    // 5. Store in Redis for 5 mins
    await redisClient.setEx(redisKey, 300, JSON.stringify(result));

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching patient appointments:', err);
    res.status(500).json({ error: 'Failed to fetch patient appointments' });
  }
});

module.exports = router;
