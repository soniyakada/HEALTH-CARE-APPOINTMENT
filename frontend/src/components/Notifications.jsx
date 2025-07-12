import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from "lucide-react"; // Import Bell icon from lucide-react
import PatientNavbar from './PatientNavbar';
import { useAuth } from "../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import Footer from './Footer';

const API_URL = import.meta.env.VITE_API_URL;


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [apiError ,setApiError] = useState("");


   const { user, loading } = useAuth();
  const userId = user?.id;

   useEffect(() => {
    if (!loading && !userId) {
      setApiError("Something went wrong. User ID is missing.");
    }
  }, [loading, userId]);


    useEffect(() => {

    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        setProcessing(true);
        const response = await axios.get(`${API_URL}/notifications`, {
          withCredentials:true,
        });
        
         // Safer fallback in case nested keys are missing
        const notificationData = response?.data?.notifications?.notifications || [];
        setNotifications(notificationData);
      setProcessing(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setProcessing(false);
        setApiError(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching notifications"
      );
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <>
    <div className="patient-notification">
      <PatientNavbar isShow={true}/>
      
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
    
         {loading && <div className="flex justify-center items-center h-64">
              <CircularProgress />
        </div> }

        {processing ? (
           // 1. Loading State
           <div className="flex justify-center items-center h-64">
             <CircularProgress />
           </div>
         ) : notifications.length === 0 ? (
           // 2. No Notifications
           <div className="flex flex-col items-center justify-center mt-16">
             <Bell size={48} className="text-gray-300 mb-4" />
             <p className="text-gray-500 text-lg">No notifications yet.</p>
           </div>
         ) : (
           // 3. Notifications List
           <ul className="space-y-4 mt-5 p-5">
             {notifications.map((notification) => (
               <li
                 key={notification._id}
                 className={`flex items-center justify-between p-4 rounded-lg shadow-md border border-green-300 ${
                   !notification.read ? "bg-blue-100" : "bg-white"
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
                {new Date(notification.date).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
             </span>
          </div>
      </li>
    ))}
  </ul>
)}

    </div>
    <Footer/>
    </>

  );
};

export default Notifications;