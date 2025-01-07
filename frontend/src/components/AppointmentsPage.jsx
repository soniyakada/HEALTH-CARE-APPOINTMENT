import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import loader from "../assets/loader.gif"
import "./Appointment.css"

const AppointmentsPage = () => {
  const { userId } = useParams(); // Get the userId from the URL params
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/token/${userId}`);
        const token = res.data.token;
        const response = await axios.get(
          `http://localhost:3000/patients/${userId}/appointments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUpcomingAppointments(response.data.upcomingAppointments);
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

  return (
    <div className="patient-appointment-page">
      <div className="">
        <div>
          {/* Heading */}
          <div className=" flex justify-center items-center mb-6">
            <h2 className='mt-5 text-5xl italic'>Appointments</h2>
          </div>

          {/* Upcoming Appointments */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 p-5 italic">Upcoming Appointments</h3>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4 p-5">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex items-center justify-between bg-blue-100 p-4 rounded-lg shadow-md border border-blue-300"
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
                    <div>
                      <span className="text-sm text-blue-700 font-medium">
                        Upcoming
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming appointments.</p>
            )}
          </div>

          {/* Past Appointments */}
          <div>
            <h3 className="text-lg font-semibold mb-4 p-5 italic">Past Appointments</h3>
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
                    <div>
                      <span className="text-sm text-gray-700 font-medium">Past</span>
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
    </div>
  );
};

export default AppointmentsPage;
