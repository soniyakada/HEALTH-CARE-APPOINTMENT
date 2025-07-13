import express from "express";
import authenticate from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorizerole.js";
import {
  searchDoctorsBySpecialization,
  getDoctorProfile,
  updateAppointmentStatus,
  getNotifications,
  markAllNotificationsAsRead,
  getAllDoctors,
  addPrescription,
  getPrescriptionsByPatient

} from "../controllers/doctorController.js";
import User from "../models/User.js";

const router = express.Router();

// Doctor search and profile routes
router.get("/doctors/specialization/:specialization", authenticate,searchDoctorsBySpecialization);
router.get("/doctor/:id",authenticate, getDoctorProfile);
router.get("/allDoctor",authenticate, getAllDoctors);

// Appointment management
router.put("/appointment/:id/status",authenticate, authorizeRoles("doctor"),updateAppointmentStatus);

// Notification routes
router.get("/notifications",authenticate, getNotifications);
router.put("/notifications/mark-all-read", markAllNotificationsAsRead);

// Add prescription
router.post('/postmedication',authenticate, authorizeRoles("doctor"), addPrescription);

// Get prescriptions for a patient
router.get('/prescription',authenticate, getPrescriptionsByPatient);

//For use Admin 
router.get("/admin/users", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

export default router;