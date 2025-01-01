import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PatientProfile = ({ userId }) => {
  const [loading, setLoading] = useState(true);


  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <div className='bg-violet-100'>
    <div className='w-full h-screen'>
  <div className="mt-8">
  {/* Heading */}
  <div className="text-2xl italic flex justify-center items-center mb-6">
    <h2>Appointments</h2>
  </div>
  {/* Link to Appointments Page */}
  <div className="mb-6">
            <Link
              to={`/appointments/${userId}`}
              className="text-blue-600 hover:underline"
            >
              View Appointments
            </Link>
          </div>
 
</div>
</div>

 {/* Link to Notifications Page */}
 <div className="mb-6">
              <Link
                to={`/notifications/${userId}`}
                className="text-blue-600 hover:underline"
              >
                View Notifications
              </Link>
            </div>



    </div>
    </>
  );
};

export default PatientProfile;
