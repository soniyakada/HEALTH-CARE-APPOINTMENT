// Notifications.jsx
import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bell } from "lucide-react"; // Import Bell icon from lucide-react
import PatientNavbar from './PatientNavbar';
const API_URL = import.meta.env.VITE_API_URL;
import { useAuth } from "../context/AuthContext";



const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error ,setError] = useState("");
  const [apiError ,setApiError] = useState("");
   const navigate = useNavigate();
   const {user} = useAuth();
  
      if (user) {
    console.log("User ID:", user.id);
    
    }
    const userId = user?.id;

     useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_URL}/notifications`, {
          params: { userId }, // Pass userId as a query parameter
          withCredentials:true,
        });
        
        const notificationData = response.data.notifications.notifications;
        setNotifications(notificationData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
        setApiError(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching notifications"
      );
      }
    };

    fetchNotifications();
  }, [userId]);

   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

    //Show error if userId is missing
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl text-red-600 font-semibold mb-2">{error}</h1>
        <button
          onClick={() => navigate("/signin")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="patient-notification">
      <PatientNavbar userId={userId} isShow={true}/>
      
      {/* Notification Header with Bell Icon */}
      <div className="flex items-center gap-3 text-4xl bg-blue-400 p-9 ring-4  ">
      <Bell size={30} className="text-white" />
      <span className="font-bold text-white">Notification</span>
      </div>

      
         {/* Error Alert Box */}
         {apiError && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
             <strong className="font-semibold">Oops!</strong> {apiError}
           </div>
         )}

        {notifications?.length > 0 ? (
        <div className="space-y-4 mt-5 p-5">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-md border border-green-300 ${
                !notification.read ? 'bg-blue-100' : 'bg-white'
              }`}
            >
              <div className="flex items-start">
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 mr-2"></div>
                )}
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
        <div className="flex flex-col items-center justify-center mt-16">
          <Bell size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No notifications yet.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;