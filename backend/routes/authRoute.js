import express from "express";
import {
  generateOtpController,
  verifyOtpController,
  registerController,
  signinController,
  logoutController,
  getMe
} from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";
import User from "../models/User.js";

const router = express.Router();

// OTP Routes
router.post("/generate-otp", generateOtpController);
router.post("/verify-otp", verifyOtpController);

// Authentication Routes
router.post("/register", registerController);
router.post("/signin", signinController);
router.post("/logout",authenticate, logoutController);

router.get("/me", authenticate, getMe);



export default router;