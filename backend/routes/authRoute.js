import express from "express";
import {
  generateOtpController,
  verifyOtpController,
  registerController,
  signinController,
  logoutController
} from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// OTP Routes
router.post("/generate-otp", generateOtpController);
router.post("/verify-otp", verifyOtpController);

// Authentication Routes
router.post("/register", registerController);
router.post("/signin", signinController);
router.post("/logout",authenticate, logoutController);

export default router;