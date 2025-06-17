import express from "express";
import authenticate from "../middleware/authenticate.js";
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

const router = express.Router();

// Doctor search and profile routes
router.get("/doctors/specialization/:specialization", authenticate, searchDoctorsBySpecialization);
router.get("/doctor/:id", authenticate, getDoctorProfile);
router.get("/allDoctor", authenticate, getAllDoctors);

// Appointment management
router.put("/appointment/:id/status", authenticate, updateAppointmentStatus);

// Notification routes
router.get("/notifications", getNotifications);
router.put("/notifications/mark-all-read", markAllNotificationsAsRead);
// Add prescription
router.post('/postmedication', addPrescription);

// Get prescriptions for a patient
router.get('/prescription/:patientId', getPrescriptionsByPatient);
export default router;