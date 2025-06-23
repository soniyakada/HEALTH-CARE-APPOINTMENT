import User from "../models/User.js";
import Appointment from "../models/appointment.js";
import Review from "../models/review.js";
import redisClient from "../utils/redis.js";
import mongoose from 'mongoose';

// Get user profile
export const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  // Validate the ID format
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }
  const cacheKey = `user:profile:${userId}`;

  try {
    // Check Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res
        .status(200)
        .json({ user: JSON.parse(cachedData), source: "cache" });
    }

    // If not cached, query DB
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

    // Store in Redis with expiry (1 hour)
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(userDetails));

    // Respond with user details
    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, timeSlot } = req.body;

    // Validate all required fields
    if (!patient || !doctor || !date || !timeSlot) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Validate that the doctor and patient exist
    const patientExists = await User.findById(patient);
    const doctorExists = await User.findById(doctor);

    if (!patientExists || !doctorExists) {
      return res.status(400).json({ error: "Invalid patient or doctor" });
    }

    // Ensure the doctor has a "doctor" role
    if (doctorExists.role !== "doctor") {
      return res
        .status(400)
        .json({ error: "The selected doctor is not valid" });
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

    // Invalidate doctor's profile cache(Doctor dashboard)
    const doctorCacheKey = `doctor:${doctor}`;
    await redisClient.del(doctorCacheKey);

    // Clear Redis cache for the doctor's patient history
    const redisKey = `doctor:${doctor}:patient-history`;
    await redisClient.del(redisKey);

    // Send a success response
    res
      .status(201)
      .json({
        message: "Appointment booked successfully!",
        appointment: newAppointment,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to book appointment" });
  }
};

// Get booked time slots for a specific doctor and date
export const getBookedSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  try {
    if (!date) return res.status(400).json({ message: "Date is required" });

    // Use UTC to avoid timezone mismatch
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: new mongoose.Types.ObjectId(doctorId),
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'approved',
    });

    const bookedSlots = bookedAppointments.map(app => app.timeSlot);
    res.status(200).json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get patient history for doctor
export const getPatientHistory = async (req, res) => {
  const doctorId = req.params.id;
  const cacheKey = `doctor:${doctorId}:patient-history`;

  try {
    // Check cache first Patient history
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res
        .status(200)
        .json({ patientHistory: JSON.parse(cachedData), source: "cache" });
    }

    // If not cached, fetch from the database
    const doctor = await User.findById(doctorId).populate({
      path: "appointments",
      populate: { path: "patient" },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const patientHistory = doctor.appointments.map((appointment) => ({
      patientName: appointment.patient.name,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      status: appointment.status,
    }));

    // Cache the result
    await redisClient.set(cacheKey, JSON.stringify(patientHistory), {
      EX: 3600,
    }); // 1 hour
    res.status(200).json({ patientHistory });
  } catch (error) {
    console.error("Error fetching patient history:", error);
    res.status(500).json({ error: "Failed to fetch patient history" });
  }
};

// Get patient details
export const getPatientDetails = async (req, res) => {
  const patientId = req.params.id;

  try {
    // Fetch the user by ID and populate appointments
    const patient = await User.findById(patientId).populate({
      path: "appointments",
      model: "Appointment",
    });

    // Ensure the user exists and is a patient
    if (!patient || patient.role !== "patient") {
      return res
        .status(404)
        .json({ error: "Patient not found or invalid role" });
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

    // Return patient details
    res.json({ patient: patientData });
  } catch (err) {
    console.error("Error fetching patient details:", err);
    res.status(500).json({ error: "Failed to fetch patient details" });
  }
};

// Get patient appointments
export const getPatientAppointments = async (req, res) => {
  const patientId = req.params.id;
  const cacheKey = `patient:${patientId}:appointments`;
  try {
    // Check if cached in Redis
    const cachedAppointments = await redisClient.get(cacheKey);
    if (cachedAppointments) {
      return res.status(200).json(JSON.parse(cachedAppointments));
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res
        .status(404)
        .json({ error: "Patient not found or invalid role" });
    }

    // Fetch all appointments for the patient
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate("doctor", "name specialization") // Populate doctor details
      .sort({ createdAt: -1 }); // Sort by date (ascending)
    
    const approveAppointments = appointments.filter(
      (appointment) => appointment.status === "approved"
    );
    const currentDate = new Date();

    // Separate appointments into upcoming and past
    const upcomingAppointments = approveAppointments.filter(
      (appointment) => new Date(appointment.date) > currentDate
    );
    const pastAppointments = approveAppointments.filter(
      (appointment) => new Date(appointment.date) <= currentDate
    );

    const result = { upcomingAppointments, pastAppointments };

    // Cache the result in Redis with TTL (e.g., 5 mins = 300 seconds)
    await redisClient.set(cacheKey, JSON.stringify(result), "EX", 300);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ error: "Failed to fetch patient appointments" });
  }
};

// Add a review
export const addReview = async (req, res) => {
  try {
    const { userId, rating, review, doctorId } = req.body;
    // Create and save review
    const newReview = new Review({
      reviewer: userId,
      doctor: doctorId,
      rating,
      comment: review,
      createdAt: new Date()
    });
    await newReview.save();
    
    // Push review id to doctor's reviewsReceived
    await User.findByIdAndUpdate(doctorId, {
      $push: { reviewsReceived: newReview._id }
    });
   
    // Push review id to user's reviewsGiven
    await User.findByIdAndUpdate(userId, {
      $push: { reviewsGiven: newReview._id }
    });
    
    // Invalidate the Redis cache for that doctor
    await redisClient.del(`reviews:${doctorId}`);
     
    res.status(201).json({ message: 'Review saved successfully', review: newReview });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reviews for a doctor
export const getDoctorReviews = async (req, res) => {
  const doctorId = req.params.doctorId;
  const redisKey = `reviews:${doctorId}`;

  try {
    // Check cache
    const cachedReviews = await redisClient.get(redisKey);
    if (cachedReviews) {
      return res.status(200).json({
        success: true,
        reviews: JSON.parse(cachedReviews),
        source: 'cache'
      });
    }
    
    // If not in cache, fetch from DB
    const totalReview = await Review.find({ doctor: doctorId })
      .populate('reviewer', 'name email'); // optional, if you want to show who reviewed
      
    res.status(200).json({
      success: true,
      reviews: totalReview,
      source: 'database'
    });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};