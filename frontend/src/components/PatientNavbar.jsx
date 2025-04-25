import React from "react";
import logo from '../assets/logo.webp'
import {Link} from 'react-router-dom'
import { IoIosNotificationsOutline } from "react-icons/io";
const API_URL = import.meta.env.VITE_API_URL;


function PatientNavbar({userId}){
    const onHandleLogout = async()=>{
        try {
           await axios.post(`${API_URL}/logout/${userId}`);
        } catch (error) {
          console.log("Error");
        }
      }
    return(
        <>
        <div className="flex justify-center items-center bg-white" style={{gap:"350px"}}>
        
          <div><img src={logo} className='h-16'></img></div>
      
        <div className="flex justify-center items-center gap-5">
            <Link to="/signin"><h3>Home</h3></Link>
            <Link to={`/appointments/${userId}`}><h3>appointments</h3></Link>
            <Link to={`/notifications/${userId}`}><h3>Notifcation</h3></Link>
            <Link to="/signup"><h3>Doctor</h3></Link>
        </div>
        <div className="flex justify-center items-center gap-5">
        <IoIosNotificationsOutline className="h-6 w-6 text-blue-600" />
        <Link to="/signin" onClick={onHandleLogout}><h3>Logout</h3></Link>
      </div>
      </div>
        </>
    )
}

export default PatientNavbar