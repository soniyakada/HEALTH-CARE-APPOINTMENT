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
  const { user, setUser } = useAuth();
  const userId = user?.id;
  const profileName = user?.name;

   
  // Logout handler

  const onHandleLogout = async () => {
    try {
       await axios.post(`${API_URL}/logout`, {}, {
      withCredentials: true,
    });
    setUser(null);
    navigate("/signin");
    } catch (error) {
      console.error("Error", error.message);
    }
  };

  // Fetch notification count

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
  getCount();
  const interval = setInterval(getCount, 10000); 
  return () => clearInterval(interval);
  }, [userId]);



  // WebSocket notifications

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }
    socket.on("receive_notification", ({ message }) => {
      toast.info(message);
    });

    return () => {
      socket.off("receive_notification");
    };
  }, [userId]);

  
  // Mark notifications as read

  async function handleBellClick() {
    try {
      await axios.put(`${API_URL}/notifications/mark-all-read`, { userId });
      // Notifications marked as read successfully
      setCount(0); // Reset the count to 0
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }

  // Profile initials
  
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0).toUpperCase() || "";
    const last = parts[1]?.charAt(0).toUpperCase() || "";
    return first + last;
  };

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
         
            <div className="relative cursor-pointer"  onClick={async () => {
            await handleBellClick(); // mark as read first
            navigate("/notifications"); // then go to page
            }}
            >
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
  isShow: PropTypes.bool.isRequired,
};

export default PatientNavbar;
