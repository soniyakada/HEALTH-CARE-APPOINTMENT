import { useEffect, useState } from "react";
import logo from "../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosNotifications } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(`${API_URL}`);

function PatientNavbar({ isShow }) {
  const navigate = useNavigate();
  const [count, setCount] = useState("");
  const { user, setUser, loading } = useAuth();
  const userId = user?.id;
  const profileName = user?.name;

  useEffect(() => {
    if (!loading && !userId) {
      console.error("Something went wrong. User ID is missing.");
    }
  }, [loading, userId]);

  const onHandleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate("/signin");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  useEffect(() => {
    const getCount = async () => {
      try {
        const response = await axios.get(`${API_URL}/notifications`, {
          withCredentials: true,
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

  const handleBellClick = async () => {
    try {
      await axios.put(`${API_URL}/notifications/mark-all-read`, { userId });
      setCount(0);
      navigate("/notifications");
    } catch (error) {
      console.error("Notification mark read error:", error);
    }
  };

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
        className="flex justify-between items-center px-8 bg-white shadow-md "
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Logo */}
        <img src={logo} className="h-16" alt="Logo" />

        {/* Navigation Links */}
        {isShow && (
          <div className="flex items-center gap-6 text-base font-semibold ml-16 text-gray-800 tracking-wide">
            <Link to="/profile" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/appointments" className="hover:text-blue-600 transition">
              Appointments
            </Link>
            <Link to="/patient/prescriptions" className="hover:text-blue-600 transition">
              Medication
            </Link>
             <Link to="/patient/prescriptions" className="hover:text-blue-600 transition">
              Medical Records
            </Link>
          </div>
        )}

        {/* Right Side: Notifications + Logout + Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div
            className="relative cursor-pointer"
            onClick={handleBellClick}
            title="Notifications"
          >
            <IoIosNotifications className="h-7 w-7 text-yellow-600" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </div>

          {/* Logout Link */}
          <Link
            to="/signin"
            onClick={onHandleLogout}
            className="text-base font-semibold text-gray-700 hover:text-red-600 transition"
          >
            Logout
          </Link>

          {/* Profile Circle */}
          <div
            className="h-10 w-10 rounded-full bg-gray-300 text-black flex items-center justify-center text-md font-bold cursor-pointer hover:ring-2 ring-blue-400 transition"
            onClick={() => navigate(`/profilepage/${userId}`)}
            title="Profile"
          >
            {getInitials(profileName)}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

PatientNavbar.propTypes = {
  isShow: PropTypes.bool.isRequired,
};

export default PatientNavbar;
