import express from "express";
import {
  generateOtpController,
  verifyOtpController,
  registerController,
  signinController,
  logoutController
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

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role"); // sirf ye fields lo
    if (!user) return res.status(404).json({ message: "User not found" });

    // Custom response object
    const filteredUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ user: filteredUser });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});



export default router;