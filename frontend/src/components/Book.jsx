import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
const API_URL = import.meta.env.VITE_API_URL;
import { useParams } from "react-router-dom";


function Book(){
 const { userId } = useParams();
 const [Doctors, setDoctors] = useState([]);
 const navigate = useNavigate();

 const onHandleappointment=(doctor)=>{
    console.log("doctorname",doctor.name)
    navigate(`/appointment/${userId}`,{state:{doctor}});
  }

    const handleDoctor = async () => {
    try {
      const res = await axios.get(`${API_URL}/token/${userId}`);
  
        // Extract the token from the response
        const token = res.data.token;
        const response = await axios.get(
        `${API_URL}/allDoctor`,{
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          }}
      );
      console.log("..............f",response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching filtered doctors:", error);
      setDoctors([]);
    }
  };

  useEffect(()=>{
    handleDoctor();
  },[userId])
 
  return(
    <>
     <PatientNavbar userId={userId} isShow={true}/>
        <div className="flex justify-center items-center">
       
           <h3 className="font-bold mb-3 mt-4 text-xl">Find your Doctor</h3>
           </div>
           <div className="mt-4">
          {Doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
           {Doctors.map((doctor) => (
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
           
    </>
  )


}

export default Book;