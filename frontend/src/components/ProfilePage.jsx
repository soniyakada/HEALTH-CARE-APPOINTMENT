import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PatientNavbar from "./PatientNavbar";

const API_URL = import.meta.env.VITE_API_URL;

function ProfilePage() {
  const { userId } = useParams(); // Assuming route is /profile/:id
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await axios.get(`${API_URL}/profile/${userId}`);
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    fetchProfile();
  }, [userId]);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0].toUpperCase())
      .join("");

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
    <PatientNavbar userId={userId} isShow={true}/>
    <div className="min-h-screen bg-blue-400 py-10 px-4 flex justify-center ">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="h-24 w-24 rounded-full bg-yellow-600 text-white text-3xl font-bold flex items-center justify-center">
            {getInitials(user.name)}
          </div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-500 text-sm capitalize">{user.role}</p>
          <p>Email: <span className="text-gray-700">{user.email}</span></p>
           <p>Phone: <span className="text-gray-700">{user.contactNumber || "N/A"}</span></p>
           <p>Gender: <span className="text-gray-700">{user.gender || "N/A"}</span></p>
           <p>Date of Birth: <span className="text-gray-700">{new Date(user.dateOfBirth).toLocaleDateString()}</span></p>
           <p>Address: <span className="text-gray-700">{user.address || "N/A"}</span></p>
          
        </div>
   

      </div>
    </div>
    </>
  );
}

export default ProfilePage;
