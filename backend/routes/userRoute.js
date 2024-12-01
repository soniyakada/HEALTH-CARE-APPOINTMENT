const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path as needed

router.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;

  // Validate the ID format (Optional, depending on your database type)
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    // Find the user by ID
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

    // Respond with user details
    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error("Error fetching user profile:", error); // Log error for debugging
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
