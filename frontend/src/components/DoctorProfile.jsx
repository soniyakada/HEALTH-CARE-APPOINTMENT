import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorProfile = ({ userId }) => {
  const [doctor, setDoctor] = useState(null);

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

  return (
    <div>
      {doctor && (
        <div>
          <h2>Doctor Profile</h2>
          <h3>Name: {doctor.name}</h3>
          <h3>Appointments:</h3>
          <ul>
            {doctor.appointments.map((appointment) => (
              <li key={appointment._id}>
                <p><strong>Patient:</strong> {appointment.patient.name}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time Slot:</strong> {appointment.timeSlot}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
