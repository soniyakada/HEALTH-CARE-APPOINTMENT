import React, { useState } from "react";
import axios from 'axios';

const Signup= () => {
  // Separate state variables for each field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availability, setAvailability] = useState("");
  const [fees, setFees] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Prepare data for submission
    const formData = {
      name,
      email,
      password,
      role,
      contactNumber,
      gender: role === "patient" ? gender : undefined,
      dateOfBirth: role === "patient" ? dateOfBirth : undefined,
      address,
      specialization: role === "doctor" ? specialization : undefined,
      availability: role === "doctor" ? availability : undefined,
      fees: role === "doctor" ? fees : undefined,
    };

    console.log("Form Data Submitted:", formData);

    
  try {
    const response = await axios.post("http://localhost:3000/signup", formData);
    console.log("API Response:", response.data);
    alert("Signup successful!");
  } catch (error) {
    console.error(
      "Error submitting form:",
      error.response?.data || error.message
    );
    alert("Failed to sign up. Please try again.");
  }
};

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Conditional Fields */}
        {role === "patient" && (
          <>
            {/* Gender */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        {role === "doctor" && (
          <>
            {/* Specialization */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Availability */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Availability</label>
              <input
                type="text"
                placeholder="e.g., Monday 9-11 AM"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Fees */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Fees</label>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        {/* Address */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Signup
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
