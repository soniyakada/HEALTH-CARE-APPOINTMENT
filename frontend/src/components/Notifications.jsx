// Notifications.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loader from "../../src/assets/loader.gif"
import { useParams } from 'react-router-dom';
import "./Notification.css"
import PatientNavbar from './PatientNavbar';
const API_URL = import.meta.env.VITE_API_URL;



const Notifications = () => {
  const { userId } = useParams(); // Get the userId from the route params
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/token/${userId}`);
        const token = res.data.token;
        const response = await axios.get(`${API_URL}/notifications`, {
          params: { userId }, // Pass userId as a query parameter
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          },
        });
        setNotifications(response.data.notifications.notifications);
        console.log("/////",response.data.notifications.notifications)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false)
      }
    };

    fetchNotifications();
  }, [userId]);



  if (loading) {
      return (
        <div className="flex items-center justify-center w-full h-screen">
          <img src={loader} alt="Loading..." />
        </div>
      );
    }
  
  return (
    <div className="patient-notification">
        <PatientNavbar userId={userId} isShow={true}/>
      <div className='flex justify-center items-center text-4xl'><span className='mt-5 italic'>Notifications</span></div>
      {notifications?.length > 0 ? (
        <div className="space-y-4 mt-5 p-5">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="flex items-center justify-between bg-green-100 p-4 rounded-lg shadow-md border border-green-300"
            >
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  {notification.message}
                </p>
              </div>
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

  );
};

export default Notifications;
