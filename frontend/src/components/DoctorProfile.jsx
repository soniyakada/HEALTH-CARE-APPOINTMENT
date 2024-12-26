import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorProfile = ({ userId }) => {
  const [doctor, setDoctor] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);

  
  const fetchPatientHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/doctor/${userId}/patient-history`);
      setPatientHistory(response.data.patientHistory);
    } catch (error) {
      console.error('Error fetching patient history:', error);
    }
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/doctor/${userId}`);
        setDoctor(response.data.doctor); // Store the doctor data
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      }
    };
    fetchDoctor();
  }, [userId]);

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/appointment/${id}/status`, { status });
     

       // Re-fetch doctor data to update appointments list
     const response = await axios.get(`http://localhost:3000/doctor/${userId}`);
     const updatedDoctor = response.data.doctor;
   
     // Filter only pending appointments
    const pendingAppointments = updatedDoctor.appointments.filter(
      (appointment) => appointment.status === "pending"
    );

    // Update state
    setDoctor({ ...updatedDoctor, appointments: pendingAppointments });

    alert(`Appointment ${status} successfully`);

    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <div>
      {doctor && (
        <div>
          <div className='flex justify-center items-center text-2xl'>
          <h3>Appointments:</h3>
          </div>
          <ul>
          <div className="mt-4">
        {doctor.appointments.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctor.appointments
      .filter((appointment) => appointment.status === "pending").map((appointment) => (
        <div
          key={appointment._id}
          className="border border-gray-300 shadow-md rounded-lg p-4 bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Appointment Details
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Patient:</strong> {appointment.patient.name}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Date:</strong>{" "}
            {new Date(appointment.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Time Slot:</strong> {appointment.timeSlot}
          </p>
          <div className="mt-3 flex justify-between">
            <button
              onClick={() =>
                updateAppointmentStatus(appointment._id, "approved")
              }
              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
            >
              Approve
            </button>
            <button
              onClick={() =>
                updateAppointmentStatus(appointment._id, "rejected")
              }
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-md text-red-500">
      No appointments found for this doctor.
    </p>
  )}
</div>

          </ul>
        </div>
      )}
      
    <h1><button onClick={()=>{fetchPatientHistory(userId)}}>Patient histoy</button></h1>
    <ul>
      {patientHistory.map((history, index) => (
        <li key={index}>
          <p>Patient: {history.patientName}</p>
          <p>Date: {new Date(history.date).toLocaleDateString()}</p>
          <p>Status: {history.status}</p>
        </li>
      ))}
    </ul>
    </div>
  );
};

export default DoctorProfile;
