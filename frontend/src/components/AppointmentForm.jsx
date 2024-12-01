import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const AppointmentForm = () => {
  const { id } = useParams(); 
  const [date, setDate] = useState(new Date());
  const location = useLocation();
  const [doctor, setDoctor] = useState(location.state?.doctor|| '');
  const [timeSlot, setTimeSlot] = useState('');
  const [patient, setPatient] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  
  useEffect(() => {
    if (doctor) {
       setDoctor(doctor)
    }
  }, [doctor]);

  console.log("patient id----",id);
      console.log("Doctor id----",doctor._id);
  // console.log("-----",doctorName);
  // useEffect(() => {
  //   // Fetch the list of doctors from the backend
  //   const fetchDoctors = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3000/api/doctors');
  //       setDoctors(response.data.doctors);
  //     } catch (err) {
  //       setError('Failed to fetch doctors');
  //     }
  //   };
  //   fetchDoctors();
  // }, []);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/patients/${id}`);
        setPatient(response.data.patient);
      } catch (err) {
        setError('Failed to fetch patient details');
      }
    };

    fetchPatient();
  }, [id]);

  console.log(patient)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !timeSlot || !doctor) {
      setError('Please fill in all fields');
      return;
    }

    try {
      console.log("patient id----",id);
      console.log("Doctor id----",doctor._id);

      const response = await axios.post(`http://localhost:3000/appointment`, {
        patient: id, // Replace with the actual logged-in user ID
        doctor:doctor._id,
        date,
        timeSlot,
      });
     console.log(response)
      setMessage('Appointment booked successfully!');
      setError('');
    } catch (err) {
      setError('Failed to book appointment');
    }
  };

  return (
    <div className="appointment-form">
      <h2>Book Appointment</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Date</label>
          <Calendar
            value={date}
            onChange={setDate}
          />
        </div>

        <div>
          <label>Select Time Slot</label>
          <select onChange={(e) => setTimeSlot(e.target.value)} value={timeSlot}>
            <option value="">--Select Time Slot--</option>
            <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
            <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
            <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
            <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
          </select>

        </div>

        <div>
        <h1>{doctor.name}</h1>
        <h1>{doctor.fees}</h1>
        <h1>{doctor.availability}</h1>
        <h1>{doctor.specialization}</h1>



        </div>

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
