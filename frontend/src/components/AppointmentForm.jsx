import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import "./Form.css";
const API_URL = import.meta.env.VITE_API_URL;

const AppointmentForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const [date, setDate] = useState(new Date());
  const [doctor, setDoctor] = useState(location.state?.doctor || "");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const [patient, setPatient] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const availableTimeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];

  console.log("........date selected....",date)
  useEffect(() => {
    if (doctor) {
      setDoctor(doctor);
    }
  }, [doctor]);

  // Fetch booked slots whenever selectedDate or doctorId changes
  useEffect(() => {
    console.log("........ONE..............")
    const fetchBookedSlots = async () => {
      try {
          console.log("........Two..............")
        const formattedDate = date.toISOString().split("T")[0];
        const response = await axios.get(
          `${API_URL}/doctor/${doctor._id}/booked-slots?date=${formattedDate}`
        );
          console.log("........thhree..............")
        setBookedSlots(response.data.bookedSlots);
          console.log("........four..............")
      } catch (error) {
          console.log("........five..............")
        console.error("Error fetching booked slots:", error);
      }
    };

    fetchBookedSlots();
  }, [date, doctor._id]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${API_URL}/token/${id}`);
        const token = res.data.token;

        const response = await axios.get(`${API_URL}/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatient(response.data.patient);
      } catch (err) {
        setError("Failed to fetch patient details", err.message);
      }
    };

    fetchPatient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !timeSlot || !doctor) {
      setError("all fields needs to be filled");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/token/${id}`);
      const token = res.data.token;

      await axios.post(
        `${API_URL}/appointment`,
        {
          patient: id,
          doctor: doctor._id,
          date,
          timeSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Appointment Booked!",
        text: "Your appointment has been successfully booked.",
        timer: 2000,
        showConfirmButton: false,
      });

      setMessage("");
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

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
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
                  <strong>Availability:</strong> {doctor.availability}
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
                  <strong>Age:</strong> {patient.age}
                </p>
                <p className="mb-1">
                  <strong>Gender:</strong> {patient.gender}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
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
