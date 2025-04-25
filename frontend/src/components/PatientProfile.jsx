import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logo from "../assets/logo.webp"
const API_URL = import.meta.env.VITE_API_URL;
import io from 'socket.io-client';
import PatientNavbar from './PatientNavbar';
// connect to your backend socket server
const socket = io(`${API_URL}`); // or wherever your backend is hosted


const PatientProfile = ({ userId }) => {

const [loading, setLoading] = useState(true);
const [specialization, setSpecialization] = useState("");
const [filteredDoctors, setFilteredDoctors] = useState([]);
const navigate = useNavigate();



useEffect(() => {
  if (userId) {
    socket.emit("join", userId);
  }

  socket.on("receive_notification", ({ message }) => {
    toast.info(message);  // or push a toast/notification
  });

  return () => {
    socket.off("receive_notification");
  };
}, [userId]);
const onHandleLogout = async()=>{
    try {
       await axios.post(`${API_URL}/logout/${userId}`);
    } catch (error) {
      console.log("Error");
    }
  }

  const onHandleappointment=(doctor)=>{
    console.log("doctorname",doctor.name)
    navigate(`/appointment/${userId}`,{state:{doctor}});
  }

  const handleDoctorFilter = async () => {
    try {
      const res = await axios.get(`${API_URL}/token/${userId}`);
  
        // Extract the token from the response
        const token = res.data.token;
        const response = await axios.get(
        `${API_URL}/doctors/specialization/${specialization}`,{
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          }}
      );
      setFilteredDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching filtered doctors:", error);
      setFilteredDoctors([]);
    }
  };

  const features = [
    {
      title: "Appointments",
      desc: "Schedule or view your upcoming appointments",
      icon: "📅", // You can replace this with an image or emoji
    },
    {
      title: "Medical Records",
      desc: "Access your complete health history",
      icon: "📋",
    },
    {
      title: "Medications",
      desc: "Track your prescriptions and refills",
      icon: "💊",
    },
    {
      title: "Find Doctor",
      desc: "Search for specialists near you",
      icon: "🧑‍⚕️",
    },
  ];

 return (
    <>
      
      <div className="">
       <PatientNavbar userId={userId}/>
       <div className='h-72 bg-blue-400 '>
        <div className='flex flex-col gap-5 p-20'>
          <h1 className='text-3xl font-semibold text-white'>Your health is our priority</h1>
        < h1 className='text-md text-white'>Schedule appointments, track your health metrics, and communicate with<br></br>
           doctors - all in one place.</h1>
           <div className='mt-2'>
           <span className='bg-white p-3 rounded-md'> Book Appointments</span>
           </div>
           
           
        </div>
       
        <div className=''></div>

       </div>
       <div className="flex flex-wrap justify-center gap-6 p-6 bg-gray-50">
      {features.map((feature, index) => (
        <div
          key={index}
          className="w-full sm:w-64 bg-white rounded-2xl shadow-md p-6 text-center transition hover:shadow-lg"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-2 rounded-xl text-4xl">{feature.icon}</div>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
        </div>
      ))}
    </div>
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-800">HealthCare+</h2>
            <p className="text-sm text-gray-600 mt-1">
              Your trusted partner in managing health.
            </p>
          </div>
          <div className="flex space-x-6 text-gray-600 text-sm">
            <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition">Contact Us</a>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} HealthCare+. All rights reserved.
        </div>
      </div>
    </footer>

                  
          <div className="flex justify-center items-center">
           <h3 className="font-bold mb-4 text-xl">Find your Doctor</h3>
           </div>
           <div className="flex justify-center items-center gap-2">
           <input
             type="text"
             placeholder="Enter specialization (e.g., Cardiology)"
             value={specialization}
             onChange={(e) => setSpecialization(e.target.value)}
             className=" px-3 py-2 border rounded mb-4 w-96"
           />
           <button
             onClick={handleDoctorFilter}
             className="p-3 bg-blue-600 mb-4 text-white py-2 rounded hover:bg-blue-700"
           >
             Search
           </button>
           </div>
           <div className="mt-4">
          {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
           {filteredDoctors.map((doctor) => (
           <div
           key={doctor.id}
           className="border border-gray-300 shadow-md rounded-lg p-4 bg-white"
           >
           <h2 className="text-lg font-semibold text-gray-800 mb-2">Dr. 
            {doctor.name}
           </h2>
           <p className="text-sm text-gray-600 mb-1">
            <strong>Specialization:</strong> {doctor.specialization}
           </p>
           <p className="text-sm text-gray-600 mb-1">
            <strong>Experience:</strong> {doctor.experience} years
           </p>
           <p className="text-sm text-gray-600 mb-1">
            <strong>Fees:</strong> ₹{doctor.fees}
           </p>
           <p className="text-sm text-gray-600 mb-1">
            <strong>Availability:</strong> {doctor.availability}
          </p>
          <button
            onClick={() => onHandleappointment(doctor)}
            className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Take Appointment
          </button>
         </div>
           ))}
          </div>
          ) : (
         <div className="flex justify-center"><p className="text-md text-red-500">
          No doctors found for the specified specialization.
         </p></div>
          )}
        </div>
        </div>
        
        <ToastContainer position="top-right" autoClose={3000} />
        </>

        
        );
      };

      export default PatientProfile;
