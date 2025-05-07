import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(`${API_URL}`);

const DoctorProfile = ({ userId }) => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const tokenRes = await axios.get(`${API_URL}/token/${userId}`);
        const token = tokenRes.data.token;
        
        const response = await axios.get(`${API_URL}/doctor/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctor(response.data.doctor);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        setError("Failed to load doctor profile. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchDoctor();
  }, [userId]);

  const updateAppointmentStatus = async (id, status) => {
    try {
      const res = await axios.get(`${API_URL}/token/${userId}`);
      const token = res.data.token;

      const resData = await axios.put(
        `${API_URL}/appointment/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Emit real-time notification
      const appointment = resData.data.appointment;
      const patientId = appointment.patient._id;
      const doctorName = appointment.doctor.name;
      const message = `Your appointment with Dr. ${doctorName} has been ${status}.`;

      socket.emit("send_notification", {
        to: patientId,
        message,
      });

      // Re-fetch doctor data
      const response = await axios.get(`${API_URL}/doctor/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setDoctor(response.data.doctor);

      // Show success notification
      const notificationElement = document.getElementById('notification');
      if (notificationElement) {
        notificationElement.innerText = `Appointment ${status} successfully`;
        notificationElement.classList.remove('hidden');
        setTimeout(() => {
          notificationElement.classList.add('hidden');
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setError("Failed to update appointment. Please try again.");
    }
  };
  const onHandleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout/${userId}`);
      navigate('/signin')
    } catch (error) {
      console.log("Error", error.message);
    }
  };
  const filterAppointments = (status) => {
    if (!doctor || !doctor.appointments) return [];
    return doctor.appointments.filter(appointment => 
      status === "all" ? true : appointment.status === status
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            {doctor && (
              <p className="mt-2 text-blue-100">Welcome back, Dr. {doctor.name}</p>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={onHandleLogout}
              className="bg-white text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* Success notification */}
        <div id="notification" className="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 transition-all duration-300">
          Appointment updated successfully
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{filterAppointments("pending").length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Approved Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{filterAppointments("approved").length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Rejected Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{filterAppointments("rejected").length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "pending"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "approved"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "rejected"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "all"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All Appointments
              </button>
            </nav>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Appointments
            </h2>

            {doctor && doctor.appointments ? (
              <div>
                {filterAppointments(activeTab).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterAppointments(activeTab).map((appointment) => (
                      <div
                        key={appointment._id}
                        className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                      >
                        <div className={`px-4 py-2 ${
                          appointment.status === "pending" ? "bg-yellow-50" : 
                          appointment.status === "approved" ? "bg-green-50" : "bg-red-50"
                        }`}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                            appointment.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {appointment.patient.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-900">{appointment.patient.name}</h3>
                              <p className="text-xs text-gray-500">Patient ID: {appointment.patient._id.slice(-6)}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Date:</span>
                              <span className="text-sm font-medium">
                                {new Date(appointment.date).toLocaleDateString(undefined, {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Time:</span>
                              <span className="text-sm font-medium">{appointment.timeSlot}</span>
                            </div>
                          </div>
                          
                          {appointment.status === "pending" && (
                            <div className="mt-5 flex space-x-3">
                              <button
                                onClick={() => updateAppointmentStatus(appointment._id, "approved")}
                                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(appointment._id, "rejected")}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {activeTab === "pending" 
                        ? "You don't have any pending appointment requests to review." 
                        : `You don't have any ${activeTab} appointments.`}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No appointments found for this doctor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

DoctorProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default DoctorProfile;