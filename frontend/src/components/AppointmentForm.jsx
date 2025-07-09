import { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import "./Form.css";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const AppointmentForm = () => {
  const { doctorId} = useParams();
  const [date, setDate] = useState(new Date());
  const [doctor, setDoctor] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [patient, setPatient] = useState("");
  const [error, setError] = useState("");
  const [apiError ,setApiError] = useState("");
  const {user} = useAuth();
  const id = user?.id;


  const availableTimeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];



   useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${API_URL}/doctor/${doctorId}`, {
        withCredentials:true,
        });
        setDoctor(response.data.doctor);

      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        setError("Failed to load doctor profile. Please try again later.");
    
      }
    };
    
    fetchDoctor();
  }, [doctorId]);



  // Fetch booked slots whenever selectedDate or doctorId changes
 
    const fetchBookedSlots = async () => {
      try {
        const formattedDate = date.toISOString().split("T")[0];
        const response = await axios.get(
          `${API_URL}/doctor/${doctorId}/booked-slots?date=${formattedDate}`
        );
        setBookedSlots(response.data.bookedSlots);
      } catch (error) {
        setApiError(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching booking slot."
      );
        console.error("Error fetching booked slots:", error);
      }
    };

   useEffect(() => {
    fetchBookedSlots();
  }, [date, doctorId]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
       
        const response = await axios.get(`${API_URL}/patients`, {
          withCredentials:true,
        });

        setPatient(response.data.patient);
      } catch (error) {
        setApiError(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching Patient detail."
      );
       
      }
    };

    fetchPatient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !timeSlot || !doctor) {
      setError("all fields needs to be filled");
      setTimeout(()=>{
        setError("");
      },2000)
      return;
    }

    try {
      
      await axios.post(
        `${API_URL}/appointment`,
        {
          patient: id,
          doctor: doctor._id,
          date,
          timeSlot,
        },
        {
          withCredentials:true,
        }
      );
      fetchBookedSlots();
      Swal.fire({
        icon: "success",
        title: "Appointment Booked!",
        text: "Your appointment has been successfully booked.",
        timer: 2000,
        showConfirmButton: false,
      });
     
      setError("");
    } catch (err) {
      setError("Failed to book appointment", err.message);
    }
  };

 

  return (
    <>
      <div className="book-appointment min-h-screen bg-blue-400">
        <PatientNavbar userId={id} isShow={true} />

        <div className="text-center mt-10 ">
          <h2 className="text-3xl font-bold text-white">Book Appointment</h2>
          <p className="text-sm text-white mt-2">
            Schedule your visit with the selected doctor
          </p>
        </div>

         {/* Error Alert Box */}
         {apiError && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
             <strong className="font-semibold">Oops!</strong> {apiError}
           </div>
         )}


        <form
          onSubmit={handleSubmit}
          className="mt-10 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <Calendar
                value={date}
                onChange={setDate}
                className="rounded-lg shadow-md border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time Slot
              </label>
              <select
                onChange={(e) => setTimeSlot(e.target.value)}
                value={timeSlot}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">--Select Time Slot--</option>
                {availableTimeSlots.map((slot) => (
                  <option
                    key={slot}
                    value={slot}
                    disabled={bookedSlots.includes(slot)}
                  >
                    {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-6 justify-between">
            {/* Doctor Details */}
            <div className="md:w-1/2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Doctor Details
              </h3>
              <div className="bg-gray-100 p-5 rounded-lg shadow-sm">
                <p className="mb-1">
                  <strong>Name:</strong> Dr. {doctor.name}
                </p>
                <p className="mb-1">
                  <strong>Specialization:</strong> {doctor.specialization}
                </p>
                <p className="mb-1">
                  <strong>Fees:</strong> ₹{doctor.fees}
                </p>
                <p className="mb-1">
                  <strong>Experience:</strong> {doctor.experience}
                </p>
              </div>
            </div>

            {/* Patient Details */}
            <div className="md:w-1/2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Patient Details
              </h3>
              <div className="bg-gray-100 p-5 rounded-lg shadow-sm">
                <p className="mb-1">
                  <strong>Name:</strong> {patient.name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {patient.email}
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {patient.address}
                </p>
                <p className="mb-1">
                  <strong>Gender:</strong> {patient.gender}
                </p>
              </div>
            </div>
          </div>
 
          <div className="mt-10">
             {error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
             <strong className="font-semibold">Oops!</strong> {error}
           </div>
         )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"  >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;
