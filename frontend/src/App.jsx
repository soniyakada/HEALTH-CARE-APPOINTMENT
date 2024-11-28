import React from "react"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Signin from "./components/Signin"
import Signup from "./components/Signup"

function App() {

  return (
   <>
   <Router>
   <div>
    <Routes>
   <Route path="/" element={<Signin/>}></Route>
   <Route path="/signup" element={<Signup/>}></Route>
   
   </Routes>
    </div>
   </Router>
   </>
  )
}

export default App
