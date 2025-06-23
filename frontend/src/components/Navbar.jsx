import logo from '../assets/logo.webp'
import {Link} from 'react-router-dom'
function Navbar() {
  return (
    <>
    <div className='flex justify-center'style={{gap:"64rem"}}>
          <Link to="/"><div><img src={logo} className='h-16'></img></div></Link>
           <div className=' flex justify-center items-center  gap-5 text-gray-900 shadow-slate-400 '>
               <Link to="/signin"><h3 className='text-white py-1 px-3 rounded-md' style={{background:"#1976d2"}}>Sign in</h3></Link>
               <Link to="/signup"><h3 >Sign Up</h3></Link>
           </div>
       </div>
    </>
  )
}

export default Navbar