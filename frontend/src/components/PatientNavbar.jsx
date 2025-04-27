import React, { useEffect, useState } from "react";
import logo from '../assets/logo.webp'
import {Link} from 'react-router-dom'
import axios from 'axios';
import { IoIosNotificationsOutline } from "react-icons/io";
const API_URL = import.meta.env.VITE_API_URL;


function PatientNavbar({userId , isShow}){
    
    const [count ,setCount] = useState("");
    const onHandleLogout = async()=>{
        try {
           await axios.post(`${API_URL}/logout/${userId}`);
        } catch (error) {
          console.log("Error");
        }
      }

         const getCount = async () => {
           try{
             const res = await axios.get(`${API_URL}/token/${userId}`);
             const token = res.data.token;
             const response = await axios.get(`${API_URL}/notifications`, {
               params: { userId }, // Pass userId as a query parameter
               headers: {
                 Authorization: `Bearer ${token}`, // Attach token in the header
               },
             });
             console.log(response.data);
             setCount(response.data.countOfNotification);
             } catch (error) {
             console.error('Error fetching notifications:', error);
            }
          };
     
          useEffect(()=>{
           getCount();
          },[userId])

          // 👉 Bell icon click handler
        const handleBellClick = async () => {
        try {
        await axios.put(`${API_URL}/notifications/mark-all-read`, { userId });
        // Notifications marked as read successfully
        setCount(0); // Reset the count to 0
        console.log("All notifications marked as read");
        } catch (error) {
        console.error('Error marking notifications as read:', error);
         }
        };
    
      return(
        <>
        <div className="flex justify-center items-center bg-white" style={{gap:isShow ? '350px' :"65rem"}}>
        <div><img src={logo} className='h-16'></img></div>
        {isShow && <div className="flex justify-center items-center gap-5">
            <Link to={`/profile/${userId}`}><h3>Home</h3></Link>
            <Link to={`/appointments/${userId}`}><h3>appointments</h3></Link>
            <Link to={`/notifications/${userId}`}><h3>Notifcation</h3></Link>
            <Link to="/signup"><h3>Doctor</h3></Link>
        </div> }
        
        <div className="flex justify-center items-center gap-5">
        <Link to={`/notifications/${userId}`}> 
        <div className="relative cursor-pointer" onClick={handleBellClick}>
            <IoIosNotificationsOutline className="h-7 w-7 text-blue-600" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </div>
          </Link> 
        <Link to="/signin" onClick={onHandleLogout}><h3>Logout</h3></Link>
        </div>
        </div>
        </>
    )
}

export default PatientNavbar