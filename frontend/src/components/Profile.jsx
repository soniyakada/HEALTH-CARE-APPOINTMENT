import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorProfile from "./DoctorProfile";
import PatientProfile from "./PatientProfile";
import loader from "../assets/loader.gif"
import "./Profile.css"
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { id } = useParams(); // Get user ID from the URL
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);


   useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/token/${id}`);
  
      // Extract the token from the response
        const token = res.data.token;
        const response = await axios.get(`${API_URL}/profile/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header
          }});
        setUserDetails(response.data.user);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Error fetching user details");
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);
  
  
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <img src={loader} alt="Loading..." />
      </div>
    );}

if (errorMessage) {
    return <p className="text-xs text-red-500">{errorMessage}</p>;
  }

  

  return (
    <>
     {userDetails ? (
        <div className="">
           {/* Doctor Filter Section */}
          <div className=" doctor-background w-full h-screen rounded-lg">
            
          <div>
          {userDetails.role === "doctor" && <DoctorProfile userId={id}/>}
          </div>
          {(userDetails.role ==="patient") && <div>
            <PatientProfile userId={id}/>
            </div>}
          </div>
         </div>
      ) : (
        <p>{loader}</p>
      )}
   
    </>
  );
};

export default Profile;
