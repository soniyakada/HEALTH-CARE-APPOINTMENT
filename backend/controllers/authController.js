import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/otp.js";
import { sendOTPEmail } from "../routes/sendMails.js";
import redisClient from "../utils/redis.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT token
const generateToken = (userPayload) => {
  return jwt.sign(userPayload, JWT_SECRET_KEY, { expiresIn: "1d" });
};

// Controller methods
export const generateOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Upsert OTP
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const record = await Otp.findOne({ email });

    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteOne({ email }); // Clean up after verification

    // Mark email as verified in memory or DB (optional if used instantly)
    req.emailVerified = true;

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

export const registerController = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    contactNumber,
    gender,
    dateOfBirth,
    address,
    specialization,
    experience,
    fees,
  } = req.body;

  try {
    // Check if email verification was successful
    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) {
      return res.status(400).json({ message: "Email not verified" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user data object
    const userData = {
      name,
      email,
      password: hashedPassword, // Save the hashed password
      role,
      contactNumber,
      address,
    };

    // Add role-specific fields
    if (role === "patient") {
      userData.gender = gender;
      userData.dateOfBirth = dateOfBirth;
    } else if (role === "doctor") {
      userData.specialization = specialization;
      userData.experience = experience;
      userData.fees = fees;
    }

    // Save the user to the database
    const user = new User(userData);

    // Invalidate Redis cache for specialization-based search
    if (role === "doctor" && specialization) {
      const cacheKey = `specialization:${specialization.toLowerCase()}`;
      await redisClient.del(cacheKey); // Invalidate cache for this specialization
    }
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    // Respond with the token and user details
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,           // Set true in production (HTTPS)
      sameSite: "Strict",     // Or "Lax" depending on frontend-backend domains
      maxAge: 60 * 60 * 1000, // 1 hour
    }).status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const logoutController = async (req, res) => {
 

  try {
    const userId = req.user.id;
    console.log("Logout request for user:", userId);

      // Clear cookie with multiple approaches
    res.clearCookie("token");
    res.clearCookie("token", { path: "/" });
    res.clearCookie("token", { 
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      path: "/" 
    });

    console.log("Cookie cleared successfully");
    res.status(200).json({ 
      message: "User logged out successfully",
      userId: userId 
    });
    
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error logging out", error });
  }
};