import React from 'react'
import logo from '../assets/logo.webp'
import {Link} from 'react-router-dom'
function Navbar() {
  return (
    <>
    <div className=' header z-[999] w-full px-20 py-2 flex justify-between items-center'>
          <Link to="/"><div><img src={logo} className='h-14 rounded-full bg-zinc-100'></img></div></Link>
           <div>
               <Link to="/profile/:id"><h3>Profile</h3></Link>
               <Link to="/appointment/:id"><h3>Appointment</h3></Link>
               <Link to="/doctor/:id"><h3>DoctorProfile</h3></Link>
               <Link to="/signin"><h3>Signin</h3></Link>
               <Link to="/signup"><h3>Signup</h3></Link>
           </div>
       </div>
    </>
  )
}

export default Navbar