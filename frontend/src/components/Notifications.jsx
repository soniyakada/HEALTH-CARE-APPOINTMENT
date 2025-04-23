// Notifications.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loader from "../../src/assets/loader.gif"
import { useParams } from 'react-router-dom';
import "./Notification.css"
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
// connect to your backend socket server
const socket = io("http://localhost:3000"); // or wherever your backend is hosted
const API_URL = import.meta.env.VITE_API_URL;

const Notifications = () => {
  const { userId } = useParams(); // Get the userId from the route params
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }
  
    socket.on("receive_notification", ({ message }) => {
      toast.info(message); // or push a toast/notification
    });
  
    return () => {
      socket.off("receive_notification");
    };
  }, [userId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/token/${userId}`);
        const token = res.data.token;
        const response = await axios.get('http://localhost:3000/notifications', {
          params: { userId }, // Pass userId as a query parameter
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          },
        });
        setNotifications(response.data.notifications);
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

      <div className='flex justify-center items-center text-4xl'><span className='mt-5 italic'>Notifications</span></div>
      {notifications.length > 0 ? (
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>

  );
};

export default Notifications;
