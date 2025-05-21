import express from "express";
import {
  generateOtpController,
  verifyOtpController,
  registerController,
  signinController,
  getTokenController,
  logoutController
} from "../controllers/authController.js";

const router = express.Router();

// OTP Routes
router.post("/generate-otp", generateOtpController);
router.post("/verify-otp", verifyOtpController);

// Authentication Routes
router.post("/register", registerController);
router.post("/signin", signinController);
router.get("/token/:userId", getTokenController);
router.post("/logout/:userId", logoutController);

export default router;