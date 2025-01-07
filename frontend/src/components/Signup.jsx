import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import Navbar from "./Navbar";
import Swal from "sweetalert2";

const Signup = () => {
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
  const [loading, setLoading] = useState(false); // New state for loading

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setLoading(true); // Set loading to true before API call
      const response = await axios.post("http://localhost:3000/register", formData); // Make sure the endpoint is correct
      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "User has been registered!",
        confirmButtonText: "OK",
      });
      setName("");
      setEmail("");
      setPassword("");
      setRole("patient");
      setContactNumber("");
      setGender("");
      setDateOfBirth("");
      setAddress("");
      setSpecialization("");
      setAvailability("");
      setFees("");
      
      setLoading(false); // Set loading to false after response
    } catch (error) {
      setLoading(false); // Set loading to false if there's an error
      console.error("Error submitting form:", error.response?.data || error.message);
      alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <>
      <div className="">
       <Navbar/>
        <div className="container">
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
            <div>
  <label>Contact Number</label>
  <input
    type="text"
    value={contactNumber}
    onChange={(e) => setContactNumber(e.target.value)}
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
              <select value={role} onChange={(e) => setRole(e.target.value)}>
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
            <button type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Signup"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
