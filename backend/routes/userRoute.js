import express from "express";
import authenticate from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorizeRole.js";
import {
  getUserProfile,
  bookAppointment,
  getBookedSlots,
  getPatientHistory,
  getPatientDetails,
  getPatientAppointments,
  addReview,
  getDoctorReviews,
  verifyDoctorController
} from "../controllers/userController.js";

const router = express.Router();

// Profile routes
router.get("/profile", authenticate,getUserProfile);

// Appointment routes
router.post("/appointment",authenticate, authorizeRoles("patient"), bookAppointment);
router.get('/doctor/:doctorId/booked-slots', getBookedSlots);
router.get("/doctor/:id/patient-history", getPatientHistory);

// Patient routes
router.get("/patients",authenticate, getPatientDetails);
router.get("/patients/appointments", authenticate, getPatientAppointments);

// Review routes
router.post('/reviews',authenticate,addReview);
router.get('/reviews/:doctorId', getDoctorReviews);

//Admin routes
router.put('/admin/verifydoctor/:doctorId',authenticate, authorizeRoles("admin"),verifyDoctorController);
export default router;