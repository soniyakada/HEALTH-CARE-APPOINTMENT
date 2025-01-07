import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Swal from 'sweetalert2';
import "./Form.css"


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
        const res = await axios.get(`http://localhost:3000/token/${id}`);
  
        // Extract the token from the response
        const token = res.data.token;
        const response = await axios.get(`http://localhost:3000/patients/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          }});
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
      const res = await axios.get(`http://localhost:3000/token/${id}`);
  
      // Extract the token from the response
      const token = res.data.token;
      const response = await axios.post(`http://localhost:3000/appointment`, {
        patient: id, // Replace with the actual logged-in user ID
        doctor:doctor._id,
        date,
        timeSlot,
      },{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in the header
        }});
     console.log(response)
         // Trigger SweetAlert for success
    Swal.fire({
      icon: 'success',
      title: 'Appointment Booked!',
      text: 'Your appointment has been successfully booked.',
      timer: 2000,
      showConfirmButton: false,
    });

    setMessage('');
    setError('');
    } catch (err) {
      setError('Failed to book appointment');
    }
  };

  return (
    <>
  <div className="book-appointment">
      <div className="text-xl italic flex justify-center">
      <span className='text-3xl mt-5'>Book Appointment</span>
      </div>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      {message && <p className="text-green-500 text-center mt-2">{message}</p>}

      <form onSubmit={handleSubmit} className="mt-6 max-w-3xl mx-auto px-4">
        <div className="flex justify-between gap-8">
          <div>
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <Calendar value={date} onChange={setDate} className="rounded-lg shadow-md" />
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2">Select Time Slot</label>
            <select
              onChange={(e) => setTimeSlot(e.target.value)}
              value={timeSlot}
              className="px-4 py-2 border rounded-lg shadow-md"
            >
              <option value="">--Select Time Slot--</option>
              <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
              <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Doctor Details</h3>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <p><strong>Name:</strong> Dr. {doctor.name}</p>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Fees:</strong> ₹{doctor.fees}</p>
            <p><strong>Availability:</strong> {doctor.availability}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default AppointmentForm;
