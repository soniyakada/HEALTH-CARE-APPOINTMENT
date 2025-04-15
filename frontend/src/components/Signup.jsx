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
  const [loading, setLoading] = useState(false); // New state for loading
  const [error, setError] = useState('');
  const [emailerror , setEmailerror] = useState('');
  const [contactError, setContactError] = useState('');
  const [passError, setPassError] = useState("")
  const [addError, setAddError] = useState("");
  const [feeError, setFeeError] = useState("");
  const [specialError, setSpecialError] = useState("");
  const [availableError , setAvailabilityError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if(!name.trim()){
    setError("Please enter your name.");
    return;
   }
   if (!email.trim()) {
    setEmailerror("Please enter your email.");
    return;
  }
  if (!emailRegex.test(email.trim())) {
    setEmailerror("Please enter a valid email address.");
    return;
  }
 
  const indianContactRegex = /^[6-9]\d{9}$/;

    // Check if the contact number field is empty or invalid
  if (!contactNumber.trim()) {
    setContactError("Please enter your contact number.");
      return;
  }
  if (!indianContactRegex.test(contactNumber.trim())) {
      setContactError("Please enter a valid mobile number.");
      return;
  }
  if (!password.trim()) {
    setPassError("Password cannot be empty.");
    return;
  }

  if(!address.trim()){
    setAddError("please enter address.");
    return;
  }

  if (!specialization.trim()) {
    setSpecialError("Specialization is required.");
    return;
  }
  if (!availability.trim()) {
    setAvailabilityError("Availability is required.");
    return;
  }
  if (!fees) {
    setFeeError("Fees is required.");
    return;
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

    console.log("Form Data Submitted:", formData);

    try {
      setLoading(true); // Set loading to true before API call
      const response = await axios.post(`${API_URL}/register`, formData); // Make sure the endpoint is correct
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
      setAddError("");
      setAvailabilityError("");
      setContactError("");
      setEmailerror("");
      setError("");
      setFeeError("");
      setSpecialError("");
       
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
            <h2>Sign up</h2>

            {/* Name */}
            <div>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                onFocus={()=>{
                  setError("");
                }}         
              />
              {error && <span className="text-xs text-red-600">{error}</span>}
            </div>

            {/* Email */}
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={()=>{
                  setEmailerror("");
                }}    
              />
                  {emailerror && <span className="text-xs text-red-600">{emailerror}</span>}
              </div>


          <div>
          <label>Contact Number</label>
          <input
          type="number"
          maxLength={10}
          onFocus={()=>{
            setContactError("");
          }}  
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}/>
          
          {contactError && <span className="text-xs text-red-600">{contactError}</span>}
          </div>

          
            {/* Password */}
          <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onFocus={()=>{
              setPassError("");
            }}  
            onChange={(e) => setPassword(e.target.value)}/>
            {passError && <span className="text-xs text-red-600">{passError}</span>}
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
                    onFocus={()=>{
                      setSpecialError("");
                    }}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                  {specialError && <span className="text-xs text-red-600">{specialError}</span>}
                </div>
                <div>
                  <label>Availability</label>
                  <input
                    type="text"
                    value={availability}
                    onFocus={()=>{
                      setAvailabilityError("");
                    }}
                    onChange={(e) => setAvailability(e.target.value)}/>
                  </div>
                  {availableError && <span className="text-xs text-red-600">{availableError}</span>}
                <div>
                  <label>Fees</label>
                  <input
                    type="number"
                    onFocus={()=>{
                      setFeeError("");
                    }}
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                  />
                  {feeError && <span className="text-xs text-red-600">{feeError}</span>}
                </div>
              </>
            )}

            {/* Address */}
            <div>
              <label>Address</label>
              <input
                type="text"
                value={address}
                onFocus={()=>{
                  setAddError("");
                }} 
                onChange={(e) => setAddress(e.target.value)}
                
              />
                {addError && <span className="text-xs text-red-600">{addError}</span>}
            </div>

            {/* Submit Button */}
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
