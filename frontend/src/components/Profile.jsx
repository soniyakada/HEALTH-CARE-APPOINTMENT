import DoctorProfile from "./DoctorProfile";
import PatientProfile from "./PatientProfile";
import AdminDashboard from "./AdminDashboard";
import "./Profile.css";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center"
          role="alert"
        >
          <strong className="font-semibold">Oops!</strong> Unauthorized user.
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-background w-full min-h-screen rounded-lg">
      {user.role === "doctor" && <DoctorProfile />}
      {user.role === "patient" && <PatientProfile />}
      {user.role === "admin" && <AdminDashboard />}
    </div>
  );
};

export default Profile;
