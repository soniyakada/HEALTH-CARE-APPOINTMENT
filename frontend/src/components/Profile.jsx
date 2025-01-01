import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorProfile from "./DoctorProfile";
import PatientProfile from "./PatientProfile";
import logo from "../assets/logo.webp"
import { Link } from "react-router-dom";

const Profile = () => {
  const { id } = useParams(); // Get user ID from the URL
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

   useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/token/${id}`);
  
      // Extract the token from the response
        const token = res.data.token;
        const response = await axios.get(`http://localhost:3000/profile/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          }});
        setUserDetails(response.data.user);
      } catch (error) {
        setErrorMessage("Error fetching user details");
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [id]);
  
if (errorMessage) {
    return <p className="text-xs text-red-500">{errorMessage}</p>;
  }

  return (
    <>
     {userDetails ? (
        <div className="w-full h-auto  bg-violet-100">
           {/* Doctor Filter Section */}
          <div className="w-full h-screen bg-violet-100 rounded-lg">
            
          <div>
          {userDetails.role === "doctor" && <DoctorProfile userId={id}/>}
          </div>
          {(userDetails.role ==="patient") && <div>
            <PatientProfile userId={id}/>
            </div>}
          </div>
         </div>
      ) : (
        <p>Loading...</p>
      )}
   
    </>
  );
};

export default Profile;
