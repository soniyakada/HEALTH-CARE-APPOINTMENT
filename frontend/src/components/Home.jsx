import React from 'react'
import "./Home.css";
import doctor from '../assets/doctor.jpg'
import doctor2 from '../assets/doctor2.jpg'
import doctor3 from '../assets/doctor3.jpg'
import Navbar from './Navbar';




function Home() {
  return (
     <>
     <div className='main'>
      <Navbar/>
      <div className='inner'>
        <img src={doctor} className='h-80 w-52 rounded-md'></img>
        <div>
        <h1 className='text-6xl'>Medical and Health</h1>
        <h2 className='text-4xl'>Care Services</h2>
        </div>
      


      </div>
     </div>
     <div className='main '>
    
      <div className='inner'>
        <img src={doctor} className='h-80 w-52 rounded-md'></img>
        <img src={doctor2} className='h-80 w-52 rounded-md'></img>
        <img src={doctor3} className='h-80 w-52 rounded-md'></img>
    </div>
     </div>
     </>
  )
}

export default Home