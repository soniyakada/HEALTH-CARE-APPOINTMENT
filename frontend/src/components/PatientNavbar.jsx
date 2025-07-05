import { useEffect, useState } from "react";
import logo from "../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosNotifications } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;
import io from "socket.io-client";
import PropTypes from "prop-types";
const socket = io(`${API_URL}`); // or wherever your backend is hosted
import { useAuth } from "../context/AuthContext";

function PatientNavbar({ isShow }) {
  const navigate = useNavigate();
  const [count, setCount] = useState("");
  const [profileName, setProfileName] = useState("");
   const {user} = useAuth();

    if (user) {
    // console.log("User ID:", user.id);
    }
    const userId = user?.id;

   const onHandleLogout = async () => {
    try {
       await axios.post(`${API_URL}/logout`, {}, {
      withCredentials: true,
    });
    } catch (error) {
      console.error("Error", error.message);
    }
  };

  const getFullName = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/profile`,{
        withCredentials:true,
      });
      setProfileName(data.user.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFullName();
  }, []);

useEffect(() => {
  const getCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        params: { userId },
         withCredentials:true,
      });
      setCount(response.data.notifications.countOfNotification);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Initial fetch
  getCount();

  // Run every 40 seconds
  const interval = setInterval(getCount, 4000); // 40000 ms = 40 sec

  // Cleanup on unmount or userId change
  return () => clearInterval(interval);
}, [userId]);


  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0).toUpperCase() || "";
    const last = parts[1]?.charAt(0).toUpperCase() || "";
    return first + last;
  };

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

  // Bell icon click handler
  async function handleBellClick() {
    try {
      await axios.put(`${API_URL}/notifications/mark-all-read`, { userId });
      // Notifications marked as read successfully
      setCount(0); // Reset the count to 0
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }

  return (
    <>
      <div
        className="flex justify-center items-center bg-white"
        style={{ gap: isShow ? "310px" : "62rem" }}
      >
        <div>
          <img src={logo} className="h-16"></img>
        </div>
        {isShow && (
          <div className="flex justify-center items-center ml-24 gap-8 font-bold text-gray-700">
            <Link to={`/profile`}>
              <h3>Home</h3>
            </Link>
            <Link to={`/appointments`}>
              <h3>Appointments</h3>
            </Link>
            <Link to={`/patient/prescriptions`}>
              <h3>Medication</h3>
            </Link>
          </div>
        )}

        <div className="flex justify-center items-center gap-3">
          <Link to={`/notifications`}>
            <div className="relative cursor-pointer" onClick={handleBellClick}>
              <IoIosNotifications
                className="h-7 w-7"
                style={{ color: "#DAA520" }}
              />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              )}
            </div>
          </Link>

          <Link to="/signin" onClick={onHandleLogout}>
            <h3 className="font-bold text-gray-700">Logout</h3>
          </Link>

          <div
            className="h-10 w-10 rounded-full bg-gray-300 text-black flex items-center justify-center text-md font-bold cursor-pointer"
            onClick={() => {
              navigate(`/profilepage/${userId}`);
            }}
          >
            {getInitials(profileName)}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

// Add this at the bottom
PatientNavbar.propTypes = {
  userId: PropTypes.string.isRequired,
  isShow: PropTypes.bool.isRequired,
};

export default PatientNavbar;
