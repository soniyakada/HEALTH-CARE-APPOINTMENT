const express = require('express');
const User = require('../models/User'); //Assuming your schema is in models/User.js
const Appointment = require('../models/Appointment'); //Ensure you have the Appointment model imported
const Notification = require('../models/notification.js')
const router = express.Router();
const authenticate = require("../middleware/authenticate.js")
const redisClient = require("../utils/redis.js")


router.get('/doctors/specialization/:specialization', authenticate, async (req, res) => {

  const { specialization } = req.params;
  const redisKey = `specialization:${specialization.toLowerCase()}:doctors`;

  try {

     // Check Redis cache first
     const cachedDoctors = await redisClient.get(redisKey);

     if (cachedDoctors) {
       console.log(`Cache hit: ${redisKey}`);
       return res.status(200).json({ doctors: JSON.parse(cachedDoctors) });
     }

    // Find doctors who match the specialization
    const doctors = await User.find({
      role: 'doctor',
      specialization: { $regex: specialization, $options: 'i' }, // Case-insensitive search
    });

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found for the specified specialization.' });
    }

    // Save result to Redis (set expiration to 1 hour)
    await redisClient.setEx(redisKey, 3600, JSON.stringify(doctors));
    console.log(`Cache set: ${redisKey}`);

    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error. Could not fetch doctors.' });
  }
});


router.get('/doctor/:id', authenticate, async (req, res) => {

  const doctorId = req.params.id;
  const redisKey = `doctor:${doctorId}:profile`;

  try {

    // Try Redis cache first
    const cachedDoctor = await redisClient.get(redisKey);

    if (cachedDoctor) {
      console.log(` Cache hit: ${redisKey}`);
      return res.status(200).json({ doctor: JSON.parse(cachedDoctor) });
    }

    // If not in cache, fetch from MongoDB
    const doctor = await User.findById(doctorId)
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

     // Store in Redis with 1-hour expiration
     await redisClient.setEx(redisKey, 3600, JSON.stringify(doctor));
     console.log(`Cache set: ${redisKey}`);

    // Return the doctor's profile along with populated appointments
    res.status(200).json({ doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctor profile' });
  }
});



router.get('/patients/:id/appointments', authenticate, async (req, res) => {

  const patientId = req.params.id;
  try {

    // 1. Try fetching from Redis
    const cachedData = await redisClient.get(`patient:${patientId}:appointments`);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

      // 2. Fetch from MongoDB
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

    const responseData = {
      upcomingAppointments,
      pastAppointments,
    };

    // 3. Store in Redis with optional expiration
    await redisClient.set(`patient:${patientId}:appointments`, JSON.stringify(responseData), 'EX', 60 * 5); // expires in 5 mins

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error fetching patient appointments:', err);
    res.status(500).json({ error: 'Failed to fetch patient appointments' });
  }
});


router.put('/appointment/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;  // "approved" or "rejected"
    const appointment = await Appointment.findById(req.params.id).populate('patient doctor');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Update appointment status
    appointment.status = status;
    await appointment.save();

    
    // Invalidate doctor's cached profile (as appointments have changed)
    await redisClient.del(`doctor:${appointment.doctor._id}:profile`);
    // After appointment.save()
    await redisClient.del(`patient:${appointment.patient._id}:appointments`);


    // Invalidate the patient's notifications cache (if you're caching the notifications for the patient)
    try {
      await redisClient.del(`notifications:${appointment.patient._id}`);
    } catch (error) {
      console.error(`Error invalidating cache for notifications of patient ${appointment.patient._id}:`, error);
    }


    // Create a notification for the patient
    const notification = new Notification({
      patient: appointment.patient._id,
      message: `Your appointment with Dr. ${appointment.doctor.name} has been ${status}.`,
      date: new Date(),
    });

    await notification.save();

    res.status(200).json({ message: 'Appointment status updated and notification sent', appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});


// Fetch notifications for a specific patient using userId in query parameters
router.get('/notifications', async (req, res) => {

  const { userId } = req.query;  // Get userId from query string

  try {

     // Check if notifications are already in Redis cache
     const redisCacheKey = `notifications:${userId}`;
     const cachedNotifications = await redisClient.get(redisCacheKey);
 
     if (cachedNotifications) {
       console.log('Fetching notifications from Redis cache');
       return res.status(200).json({ notifications: JSON.parse(cachedNotifications) });
     }


    const notifications = await Notification.find({ patient: userId }).sort({ date: -1 });
    // Cache the result in Redis
    await redisClient.set(redisCacheKey, JSON.stringify(notifications), 'EX', 3600); // Set cache for 1 hour

    
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;
