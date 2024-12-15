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
    <div>
      <h2>Patient Profile</h2>
      <h3>Upcoming Appointments</h3>
      {upcomingAppointments.length > 0 ? (
        <ul>
          {upcomingAppointments.map((appointment) => (
            <li key={appointment._id}>
              <p><strong>Doctor:</strong> {appointment.doctor?.name}</p>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Time Slot:</strong> {appointment.timeSlot}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming appointments.</p>
      )}

      <h3>Past Appointments</h3>
      {pastAppointments.length > 0 ? (
        <ul>
          {pastAppointments.map((appointment) => (
            <li key={appointment._id}>
              <p><strong>Doctor:</strong> {appointment.doctor?.name}</p>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Time Slot:</strong> {appointment.timeSlot}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No past appointments.</p>
      )}
    </div>
    <div>
      <h2>Patient Profile</h2>
      <h3>Notifications:</h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            <p>{notification.message}</p>
            <p>{new Date(notification.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default PatientProfile;
