const express = require('express');
const User = require('../models/User'); //Assuming your schema is in models/User.js
const Appointment = require('../models/appointment.js'); //Ensure you have the Appointment model imported
const Notification = require('../models/notification.js')
const router = express.Router();
const authenticate = require("../middleware/authenticate.js")
const redisClient = require("../utils/redis.js")

    // Search bar doctor {Patient use} 
    router.get('/doctors/specialization/:specialization', authenticate, async (req, res) => {
      const specialization = req.params.specialization;
      const cacheKey = `specialization:${specialization.toLowerCase()}`; // Case-insensitive caching
    
      try {
        // 🧳 Check if the result is cached
        const cachedDoctors = await redisClient.get(cacheKey);
        if (cachedDoctors) {
          return res.status(200).json({ doctors: JSON.parse(cachedDoctors), source: 'cache' });
        }
    
        // If not cached, fetch from DB
        const doctors = await User.find({
          role: 'doctor',
          specialization: { $regex: specialization, $options: 'i' }, // Case-insensitive search
        });
    
        if (doctors.length === 0) {
          return res.status(404).json({ message: 'No doctors found for the specified specialization.' });
        }
    
        // 🔄 Cache the result
        await redisClient.set(cacheKey, JSON.stringify(doctors), { EX: 3600 }); // Cache for 1 hour
    
        res.status(200).json({ doctors});
      } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error. Could not fetch doctors.' });
      }
    });
    

  // saare cards jo doctor ke dashboard par show hote hai jab user particular doctor ke liye appointment book krta hai toh
  router.get('/doctor/:id', authenticate, async (req, res) => {

  const doctorId = req.params.id;

  try {

      // Check Redis cache
      const cacheKey = `doctor:${doctorId}`;
      const cachedDoctor = await redisClient.get(cacheKey);
  
      if (cachedDoctor) {
        // Parse and return cached data
          console.log("---Doctor Dasboard------Redis cache")
        return res.status(200).json({ doctor: JSON.parse(cachedDoctor), cached: true });
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

      // Cache the result for 10 minutes (600 seconds)
      await redisClient.setEx(cacheKey, 600, JSON.stringify(doctor));
   
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
    // Fetch from MongoDB
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

      //Invalidate Redis cache for the doctor(doctor dashboard card ke liye)
      const doctorId = appointment.doctor._id.toString(); // ensure string type
      const cacheKey = `doctor:${doctorId}`;
      await redisClient.del(cacheKey);

      // Invalidate Redis cache for the doctor's patient history (optional)
      const patientHistoryCacheKey = `doctor:${doctorId}:patient-history`;
      await redisClient.del(patientHistoryCacheKey);
  

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

  


    const notifications = await Notification.find({ patient: userId }).sort({ date: -1 });
    // Cache the result in Redis


    
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
   });

module.exports = router;
