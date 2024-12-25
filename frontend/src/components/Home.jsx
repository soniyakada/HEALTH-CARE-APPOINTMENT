import React from 'react'
import "./Home.css";
import doctor from '../assets/doctor.jpg'
import doctor2 from '../assets/doctor2.jpg'
import doctor3 from '../assets/doctor3.jpg'
import health from '../assets/health.jpg'
import Navbar from './Navbar';
import { motion } from "framer-motion";




function Home() {
  return (
     <>
    <div className='main'>
      <Navbar/>
      <div className='inner '>
        <img src={doctor} className="w-1/3 h-[70vh] rounded-3xl"></img>
        <div className="mt-40 px-20 mt-5">
      <div className="masker">
        {/* First Line Animation */}
        <div className="w-fit flex items-center">
          <h1 className="uppercase font-semibold text-7xl leading-tight tracking-tighter">
            Medical and 
          </h1>
        </div>

        {/* Second Line Animation */}
        <div className="w-fit flex items-center mt-5">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: "9vw" }}
            transition={{ ease: [0.76, 0, 0.24, 1], duration: 1 }}
            className="w-[9vw] h-[5vw] rounded-md"
          >
             <img src={health} className="rounded-3xl"></img>
          </motion.div>
          <h2 className="uppercase font-semibold text-5xl leading-tight tracking-tighter">
          Health Care Services
          </h2>
        </div>
      </div>
    </div>
     </div>
    </div>
     <div className='main '>
    
      <div className='inner'>
      <div className="w-1/3 p-4 shadow-lg rounded-md border border-gray-200">
  <img src={doctor} className="h-80 w-52 rounded-md" alt="Doctor" />
</div>

        <img src={doctor2} className='h-80 w-52 rounded-md'></img>
        <img src={doctor3} className='h-80 w-52 rounded-md'></img>
    </div>
     </div>
     </>
  )
}

export default Home