import React from "react"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Signin from "./components/Signin"
import Signup from "./components/Signup"
import Profile from "./components/Profile"

function App() {

  return (
   <>
   <Router>
   <div>
    <Routes>
   <Route path="/" element={<Signin/>}></Route>
   <Route path="/signup" element={<Signup/>}></Route>
   <Route path="/profile/:id" element={<Profile/>}></Route>

   
   </Routes>
    </div>
   </Router>
   </>
  )
}

export default App
