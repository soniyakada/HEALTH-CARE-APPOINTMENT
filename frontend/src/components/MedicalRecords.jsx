import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientNavbar from './PatientNavbar';
import { useParams } from 'react-router-dom';
import loader from "../assets/loader.gif"
import "./Appointment.css"
import { ToastContainer, toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;
import io from 'socket.io-client';
// connect to your backend socket server
const socket = io(`${API_URL}`); // or wherever your backend is hosted


function MedicalRecords(){
   const { userId } = useParams(); // Get the userId from the URL params
   const [pastAppointments, setPastAppointments] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     if (userId) {
       socket.emit("join", userId);
     }
   
     socket.on("receive_notification", ({ message }) => {
       toast.info(message); // or push a toast/notification
     });
   
     return () => {
       socket.off("receive_notification");
     };
   }, [userId]);

    useEffect(() => {
       const fetchAppointments = async () => {
         try {
           const res = await axios.get(`${API_URL}/token/${userId}`);
           const token = res.data.token;
           const response = await axios.get(
             `${API_URL}/patients/${userId}/appointments`,
             {
               headers: {
                 Authorization: `Bearer ${token}`,
               },
             }
           );
           setPastAppointments(response.data.pastAppointments);
           setLoading(false);
         } catch (error) {
           console.error('Error fetching appointments:', error);
           setLoading(false);
         }
       };
   
       fetchAppointments();
     }, [userId]);
   
     if (loading) {
       return (
         <div className=" loader-page flex items-center justify-center w-full h-screen">
           <img src={loader} alt="Loading..." />
         </div>
       );
     }

     return(
        <>
        <div className="patient-appointment-page">
              <div className="">
                 <PatientNavbar userId={userId} isShow={true}/>
                <div>
                  {/* Heading */}
                  <div className=" flex justify-center items-center mb-6">
                    <h2 className='mt-5 text-5xl italic'>Medical Records</h2>
                  </div>
                {/* Past Appointments */}
                  <div>
                    {pastAppointments.length > 0 ? (
                      <div className="space-y-4 p-5">
                        {pastAppointments.map((appointment) => (
                          <div
                            key={appointment._id}
                            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300"
                          >
                            <div>
                              <p className="text-sm text-gray-700">
                                <strong>Doctor:</strong> {appointment.doctor?.name}
                              </p>
                              <p className="text-sm text-gray-700">
                                <strong>Date:</strong>{' '}
                                {new Date(appointment.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-700">
                                <strong>Time Slot:</strong> {appointment.timeSlot}
                              </p>
                            </div>
                           
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No past appointments.</p>
                    )}
                  </div>
                </div>
              </div>
              <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </>
     )
}

export default MedicalRecords