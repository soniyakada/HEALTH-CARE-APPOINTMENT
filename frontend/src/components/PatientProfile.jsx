import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientProfile = ({ userId }) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/patients/${userId}/appointments`);
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

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/notifications', {
        params: { userId }, // Pass userId as a query parameter
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications when component mounts
  }, [userId]); // Fetch again if userId changes
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <div className='bg-violet-100'>
    <div className='w-full h-screen'>
  <div className="mt-8">
  {/* Heading */}
  <div className="text-2xl italic flex justify-center items-center mb-6">
    <h2>Appointments</h2>
  </div>

  {/* Upcoming Appointments */}
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
    {upcomingAppointments.length > 0 ? (
      <div className="space-y-4">
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
                <strong>Date:</strong>{" "}
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
    <h3 className="text-lg font-semibold mb-4">Past Appointments</h3>
    {pastAppointments.length > 0 ? (
      <div className="space-y-4">
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
                <strong>Date:</strong>{" "}
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



<div className="mt-8">
  <h3 className="text-lg font-semibold mb-4">Notifications:</h3>
  {notifications.length > 0 ? (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className="flex items-center justify-between bg-green-100 p-4 rounded-lg shadow-md border border-green-300"
        >
          {/* Notification Message */}
          <div>
            <p className="text-sm text-gray-700 font-medium">
              {notification.message}
            </p>
          </div>
          {/* Notification Date */}
          <div>
            <span className="text-xs text-gray-600">
              {new Date(notification.date).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No notifications.</p>
  )}
</div>


    </div>
    </>
  );
};

export default PatientProfile;
