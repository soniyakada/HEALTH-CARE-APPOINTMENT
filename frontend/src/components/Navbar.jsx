import logo from '../assets/logo.webp'
import {Link} from 'react-router-dom'
function Navbar() {
  return (
    <>
    <div className='header'>
          <Link to="/"><div><img src={logo} className='h-12'></img></div></Link>
           <div>
               <Link to="/signin"><h3>Signin</h3></Link>
               <Link to="/signup"><h3>Signup</h3></Link>
           </div>
       </div>
    </>
  )
}

export default Navbar