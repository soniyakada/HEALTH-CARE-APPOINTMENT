import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorProfile from "./DoctorProfile";
import PatientProfile from "./PatientProfile";

const Profile = () => {
  const { id } = useParams(); // Get user ID from the URL
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/profile/${id}`);
        setUserDetails(response.data.user);
      } catch (error) {
        setErrorMessage("Error fetching user details");
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [id]);
  console.log("id:-----",id)
  const handleDoctorFilter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/doctors/specialization/${specialization}`
      );
     console.log("<-------- doctors.......>",response.data.doctors)
      setFilteredDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching filtered doctors:", error);
      setFilteredDoctors([]);
    }
  };


  const onHandleappointment=(doctor)=>{
    console.log("doctorname",doctor.name)
    navigate(`/appointment/${id}`,{state:{doctor}});
  }

  if (errorMessage) {
    return <p className="text-xs text-red-500">{errorMessage}</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      {userDetails ? (
        <div>
          <p>
            <strong>Name:</strong> {userDetails.name}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Role:</strong> {userDetails.role}
          </p>

          {/* Show role-specific fields */}
          {userDetails.role === "doctor" && (
            <div className="mt-4">
              <p>
                <strong>Specialization:</strong> {userDetails.specialization}
              </p>
              <p>
                <strong>Experience:</strong> {userDetails.experience}
              </p>
              <p>
                <strong>Availability:</strong> {userDetails.availability}
              </p>
              <p>
                <strong>Fees:</strong> {userDetails.fees}
              </p>
              <DoctorProfile userId={id} />
            </div>
            
          )}

          {userDetails.role === "patient" && (
            <div className="mt-4">
              <p>
                <strong>Gender:</strong> {userDetails.gender}
              </p>
              <p>
                <strong>Date of Birth:</strong> {userDetails.dateOfBirth}
              </p>
            </div>
          )}

          <div className="mt-4">
            <p>
              <strong>Contact Number:</strong> {userDetails.contactNumber}
            </p>
            <p>
              <strong>Address:</strong> {userDetails.address}
            </p>
          </div>

          {/* Doctor Filter Section */}
          {(userDetails.role === "admin" || userDetails.role === "patient") && (
            <div className="mt-6">
              <h3 className="font-bold mb-4">Filter Doctors by Specialization</h3>
              <input
                type="text"
                placeholder="Enter specialization (e.g., Cardiology)"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-4"
              />
              <button
                onClick={handleDoctorFilter}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Search
              </button>
              <div className="mt-4">
                {filteredDoctors.length > 0 ? (
                  <ul>
                    {filteredDoctors.map((doctor) => (
                      <li key={doctor.id} className="mb-4">
                        <p>
                          <strong>Name:</strong> {doctor.name}
                        </p>
                        <p>
                          <strong>Specialization:</strong> {doctor.specialization}
                        </p>
                        <p>
                          <strong>Experience:</strong> {doctor.experience} years
                        </p>
                        <p>
                          <strong>Fees:</strong> ${doctor.fees}
                        </p>
                        <p>
                          <strong>Availability:</strong> {doctor.availability}
                        </p>
                        <button onClick={()=>{onHandleappointment(doctor)}}>Take appointment</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p  className="text-m text-red-500">No doctors found for the specified specialization.</p>
                )}
              </div>
            </div>
          )}

          {(userDetails.role ==="patient") && <div>
            <PatientProfile userId={id}/>
            </div>}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
