import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import { useState ,useEffect } from "react";
import { useAuth } from "../context/AuthContext";


const PatientProfile = () => {
  const [error ,setError] = useState("");
  const navigate = useNavigate();
   const {user} = useAuth();

    if (user) {
  console.log("User ID:", user.id);
  
  }
  const userId = user?.id;

   useEffect(() => {
    if (!userId) {
      setError("Something went wrong. User ID is missing.");
    }
  }, [userId]);

  const features = [
    {
      title: "Appointments",
      desc: "Schedule or view your upcoming appointments",
      icon: "📅", // You can replace this with an image or emoji
      route: "/appointments", // <-- Add route
    },
    {
      title: "Medical Records",
      desc: "Access your complete health history",
      icon: "📋",
      route: "/medical-records",
    },
    {
      title: "Medications",
      desc: "Track your prescriptions and refills",
      icon: "💊",
      route: "/medications",
    },
    {
      title: "Find Doctor",
      desc: "Search for specialists near you",
      icon: "🧑‍⚕️",
      route: "/finddoctor", // <-- Add this route
    },
  ];

  const handleFeatureClick = (feature) => {
    if (feature.route) {
      if (feature.title === "Appointments") {
        navigate(`/appointments/${userId}`);
      } else if (feature.title === "Find Doctor") {
        navigate(`/findDoctor/${userId}`);
      } else if (feature.title === "Medical Records") {
        navigate(`/medical-records/${userId}`);
      }else if(feature.title === "Medications"){
        navigate(`/patient/${userId}/prescriptions`)
      } else {
        navigate(feature.route);
      }
    }
  };

 //Show error if userId is missing
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl text-red-600 font-semibold mb-2">{error}</h1>
        <button
          onClick={() => navigate("/signin")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="">
        <PatientNavbar userId={userId} isShow={false} />
        <div className="h-72 bg-blue-400 ">
          <div className="flex flex-col gap-5 p-20">
            <h1 className="text-3xl font-semibold text-white">
              Your health is our priority
            </h1>
            <h1 className="text-md text-white">
              Schedule appointments, track your health metrics, and communicate
              with<br></br>
              doctors - all in one place.
            </h1>
            <div className="mt-2">
              <span
                className="bg-white p-3 rounded-md cursor-pointer"
                onClick={() => {
                  navigate(`/book/${userId}`);
                }}
              >
                {" "}
                Book Appointments
              </span>
            </div>
          </div>

          <div className=""></div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 p-6 bg-gray-50">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureClick(feature)}
              className="w-full sm:w-64 cursor-pointer bg-white rounded-2xl shadow-md p-6 text-center transition hover:shadow-lg"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-2 rounded-xl text-4xl">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-xl font-semibold text-gray-800">
                  HealthCare+
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Your trusted partner in managing health.
                </p>
              </div>
              <div className="flex space-x-6 text-gray-600 text-sm">
                <a href="#" className="hover:text-blue-600 transition">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-blue-600 transition">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-blue-600 transition">
                  Contact Us
                </a>
              </div>
            </div>
            <div className="mt-6 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} HealthCare+. All rights
              reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

// Add this at the bottom
PatientProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default PatientProfile;
