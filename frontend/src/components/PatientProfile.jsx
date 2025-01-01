import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import logo from "../assets/logo.webp"

const PatientProfile = ({ userId }) => {
  const [loading, setLoading] = useState(true);
    const [specialization, setSpecialization] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
const navigate = useNavigate();
const onHandleLogout = async()=>{
    try {
       await axios.post(`http://localhost:3000/logout/${userId}`);
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
      const res = await axios.get(`http://localhost:3000/token/${userId}`);
  
      // Extract the token from the response
        const token = res.data.token;
        const response = await axios.get(
        `http://localhost:3000/doctors/specialization/${specialization}`,{
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          }}
      );
     console.log("<-------- hello...>")
      setFilteredDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching filtered doctors:", error);
      setFilteredDoctors([]);
    }
  };


  return (
    <>
      <div className="">
                  <nav className=" text-black p-4">
          <div className="container mx-auto flex justify-between items-center">
              <div><img src={logo} className='h-12'></img></div>
              <div className="flex gap-4">
              <Link to={`/appointments/${userId}`} className="hover:underline">
                Appointments
              </Link>
              <Link to={`/notifications/${userId}`} className="hover:underline">
                Notifications
              </Link>
              <Link to="/signin" onClick={onHandleLogout} className="hover:underline">
                Logout
              </Link>
            </div>
          </div>
        </nav>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </>
  );
};

export default PatientProfile;
