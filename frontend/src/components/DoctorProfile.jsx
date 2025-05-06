import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DoctorProfile.css";
const API_URL = import.meta.env.VITE_API_URL;
import io from "socket.io-client";
const socket = io(`${API_URL}`); // or wherever your backend is hosted

const DoctorProfile = ({ userId }) => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  console.log("Doctor =---", userId);

  useEffect(() => {
    const getToken = async () => {
      try {
        // Make a GET request to fetch the token
        const response = await axios.get(`${API_URL}/token/${userId}`);

        // Extract the token from the response
        const token = response.data.token;

        // Log or store the token (e.g., localStorage or state)
        console.log("Token fetched:", token);
      } catch (error) {
        console.log(error.message);
      }
    };
    getToken();
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${API_URL}/token/${userId}`);

        // Extract the token from the response
        const token = res.data.token;
        const response = await axios.get(`${API_URL}/doctor/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          },
        });
        setDoctor(response.data.doctor); // Store the doctor data
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };
    fetchDoctor();
  }, [userId]);

  const updateAppointmentStatus = async (id, status) => {
    try {
      const res = await axios.get(`${API_URL}/token/${userId}`);

      // Extract the token from the response
      const token = res.data.token;

      const resData = await axios.put(
        `${API_URL}/appointment/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          },
        }
      );

      // ✅ Emit real-time notification after success
      const appointment = resData.data.appointment;
      console.log("......appointments", appointment);
      const patientId = appointment.patient._id;
      const doctorName = appointment.doctor.name;
      const message = `Your appointment with Dr. ${doctorName} has been ${status}.`;

      socket.emit("send_notification", {
        to: patientId,
        message,
      });

      // Re-fetch doctor data to update appointments list
      const response = await axios.get(`${API_URL}/doctor/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in the header
        },
      });
      const updatedDoctor = response.data.doctor;

      // Filter only pending appointments
      const pendingAppointments = updatedDoctor.appointments.filter(
        (appointment) => appointment.status === "pending"
      );

      // Update state
      setDoctor({ ...updatedDoctor, appointments: pendingAppointments });

      alert(`Appointment ${status} successfully`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <>
      <div>
        <div className="doctor-profile">
          {doctor && (
            <div>
              <div className="flex justify-center items-center text-5xl ">
                <h3 className="mt-4 italic">Appointments:</h3>
              </div>
              <ul>
                <div className="mt-10 p-5">
                  {doctor.appointments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {doctor.appointments
                        .filter(
                          (appointment) => appointment.status === "pending"
                        )
                        .map((appointment) => (
                          <div
                            key={appointment._id}
                            className="border border-gray-300 shadow-md rounded-lg p-4 bg-white"
                          >
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                              Appointment Details
                            </h2>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Patient:</strong>{" "}
                              {appointment.patient.name}
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
                                  updateAppointmentStatus(
                                    appointment._id,
                                    "approved"
                                  )
                                }
                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment._id,
                                    "rejected"
                                  )
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

          <div className="p-5">
            {/* Other UI Elements */}
            <button
              onClick={() => navigate(`/doctor/${userId}/patient-history`)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition mt-5"
            >
              View Patient History
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Add this at the bottom
DoctorProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default DoctorProfile;
