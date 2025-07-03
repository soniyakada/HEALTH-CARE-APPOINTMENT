import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DoctorProfile from "./DoctorProfile";
import PatientProfile from "./PatientProfile";
import loader from "../assets/loader.gif";
import "./Profile.css";
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { id } = useParams(); // Get user ID from the URL
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
           const response = await axios.get(`${API_URL}/profile`,{
           withCredentials: true,
           });
        setUserDetails(response.data.user);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Unauthorized user");
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
     <div className="flex justify-center items-center h-screen">
     {errorMessage && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
             <strong className="font-semibold">Oops!</strong> {errorMessage}
           </div>
         )}
        </div> 
      {userDetails ? (
        <div className="">
          {/* Doctor Filter Section */}
          <div className=" doctor-background w-full h-screen rounded-lg">
            <div>
              {userDetails.role === "doctor" && <DoctorProfile userId={id} />}
            </div>
            {userDetails.role === "patient" && (
              <div>
                <PatientProfile userId={id} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>{loader}</p>
      )}
    </>
  );
};

export default Profile;
