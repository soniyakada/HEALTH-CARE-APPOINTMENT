import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import Navbar from "./Navbar";
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL;

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
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [emailerror , setEmailerror] = useState('');
  const [contactError, setContactError] = useState('');
  const [passError, setPassError] = useState("");
  const [addError, setAddError] = useState("");
  const [feeError, setFeeError] = useState("");
  const [specialError, setSpecialError] = useState("");
  const [availableError , setAvailabilityError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear all errors before new validation
    setError("");
    setEmailerror("");
    setContactError("");
    setPassError("");
    setAddError("");
    setSpecialError("");
    setAvailabilityError("");
    setFeeError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const indianContactRegex = /^[6-9]\d{9}$/;

    if (!name.trim()) return setError("Please enter your name.");
    if (!email.trim()) return setEmailerror("Please enter your email.");
    if (!emailRegex.test(email.trim())) return setEmailerror("Please enter a valid email address.");
    if (!contactNumber.trim()) return setContactError("Please enter your contact number.");
    if (!indianContactRegex.test(contactNumber.trim())) return setContactError("Please enter a valid mobile number.");
    if (!password.trim()) return setPassError("Password cannot be empty.");
    if (!address.trim()) return setAddError("Please enter address.");

    if (role === "doctor") {
      if (!specialization.trim()) return setSpecialError("Specialization is required.");
      if (!availability.trim()) return setAvailabilityError("Availability is required.");
      if (!fees) return setFeeError("Fees is required.");
    }

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

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/register`, formData);
      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "User has been registered!",
        confirmButtonText: "OK",
      });

      // Reset form
      setName(""); setEmail(""); setPassword(""); setRole("patient");
      setContactNumber(""); setGender(""); setDateOfBirth("");
      setAddress(""); setSpecialization(""); setAvailability(""); setFees("");
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Navbar/>
        <div className="container">
          <form onSubmit={handleSubmit} className="signup-form">
            <h2>Sign up</h2>

            <div>
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setError("")} />
              {error && <span className="text-xs text-red-600">{error}</span>}
            </div>

            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailerror("")} />
              {emailerror && <span className="text-xs text-red-600">{emailerror}</span>}
            </div>

            <div>
              <label>Contact Number</label>
              <input type="number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} onFocus={() => setContactError("")} />
              {contactError && <span className="text-xs text-red-600">{contactError}</span>}
            </div>

            <div>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPassError("")} />
              {passError && <span className="text-xs text-red-600">{passError}</span>}
            </div>

            <div>
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {role === "patient" && (
              <>
                <div>
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label>Date of Birth</label>
                  <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div>
              </>
            )}

            {role === "doctor" && (
              <>
                <div>
                  <label>Specialization</label>
                  <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} onFocus={() => setSpecialError("")} />
                  {specialError && <span className="text-xs text-red-600">{specialError}</span>}
                </div>

                <div>
                  <label>Availability</label>
                  <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} onFocus={() => setAvailabilityError("")} />
                  {availableError && <span className="text-xs text-red-600">{availableError}</span>}
                </div>

                <div>
                  <label>Fees</label>
                  <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} onFocus={() => setFeeError("")} />
                  {feeError && <span className="text-xs text-red-600">{feeError}</span>}
                </div>
              </>
            )}

            <div>
              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} onFocus={() => setAddError("")} />
              {addError && <span className="text-xs text-red-600">{addError}</span>}
            </div>

            <button type="submit" disabled={loading} className="bg-blue-600">
              {loading ? "Signing Up..." : "Signup"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
