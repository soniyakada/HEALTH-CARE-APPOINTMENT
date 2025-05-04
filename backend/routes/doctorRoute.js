const express = require('express');
const User = require('../models/User'); //Assuming your schema is in models/User.js
const Appointment = require('../models/appointment.js'); //Ensure you have the Appointment model imported
const Notification = require('../models/notification.js')
const router = express.Router();
const authenticate = require("../middleware/authenticate.js")
const redisClient = require("../utils/redis.js")

    // Search bar doctor {Patient use} [invalidate] 
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
      const patientId = appointment.patient._id.toString();

       // Invalidate Redis cache
       const doctorDashboardCacheKey = `doctor:${doctorId}`;
       const patientHistoryCacheKey = `doctor:${doctorId}:patient-history`;
       const patientAppointmentsCacheKey = `patient:${patientId}:appointments`;
       const patientNotificationsCacheKey = `notifications:${patientId}`;
    
       await redisClient.del(doctorDashboardCacheKey);
       await redisClient.del(patientHistoryCacheKey);
       await redisClient.del(patientAppointmentsCacheKey);
       await redisClient.del(patientNotificationsCacheKey);  //NEW: Invalidate notifications cache
  

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
   const cacheKey = `notifications:${userId}`;
 
   try {
     // 1. Try to fetch from Redis cache
     const cachedNotifications = await redisClient.get(cacheKey);
     if (cachedNotifications) {
       return res.status(200).json({ notifications: JSON.parse(cachedNotifications), source: 'cache' });
     }

   // 2. Fetch from MongoDB if not in cache
    const notifications = await Notification.find({ patient: userId }).sort({ date: -1 });
    const unreadnotifcaitons = await Notification.find({ patient: userId ,status:"unread" });
    console.log("..............unread",unreadnotifcaitons.length)
    const countOfNotification = unreadnotifcaitons.length;
    console.log("---0-0-0-0-0-0-0",countOfNotification);
    // 3. Cache the result with expiry (e.g., 10 minutes = 600s)
    await redisClient.setEx(cacheKey, 600, JSON.stringify({ notifications, countOfNotification }));
    console.log("---------------all notifications",notifications);

    res.status(200).json({ notifications ,countOfNotification});
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
   });


   router.put('/notifications/mark-all-read', async (req, res) => {
    const { userId } = req.body;  // userId body se lena (PUT request body hoti hai)
    const cacheKey = `notifications:${userId}`; // same key jo tum GET notifications me use karte ho
    console.log("....Hello.")
    try {
      // Update all notifications where patient is userId and status is "unread"
      const result = await Notification.updateMany(
        { patient: userId, status: "unread" },
        { $set: { status: "read" } }
      );
  
      console.log("Notifications updated:", result.modifiedCount);
      // 2. Invalidate the cache
      await redisClient.del(cacheKey);
      
      res.status(200).json({ message: "All notifications marked as read", updatedCount: result.modifiedCount });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
  });
  




module.exports = router;
