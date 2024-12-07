import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import './Signup.css'

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
    <><div className="main">
    <div className="header">
      <div>Logo</div>
      <div>
        <Link to="/signin"><h3>Signin</h3></Link>
        <Link to="/signup"><h3>Signup</h3></Link>
      </div>
    </div>
    <div className="inner">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Signup</h2>
  
        {/* Name */}
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
  
        {/* Email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
  
        {/* Password */}
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
  
        {/* Role */}
        <div>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
  
        {/* Conditional Fields */}
        {role === "patient" && (
          <>
            <div>
              <label>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
          </>
        )}
  
        {role === "doctor" && (
          <>
            <div>
              <label>Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
            <div>
              <label>Availability</label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
            </div>
            <div>
              <label>Fees</label>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
              />
            </div>
          </>
        )}
  
        {/* Address */}
        <div>
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
  
        {/* Submit Button */}
        <button type="submit">Signup</button>
      </form>
    </div>
  </div>
  
    </>
    
  );
};

export default Signup;
