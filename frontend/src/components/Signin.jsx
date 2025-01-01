import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './signin.css';
import Navbar from "./Navbar";


const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/signin", {
        email,
        password,
      });
      console.log (response.data)
      const { user } = response.data;
       console.log(user.id)
     navigate(`/profile/${user.id}`); 
     
    } catch (error) {
      // Handle errors
      setMessage(error.response?.data?.message || "Login failed");
      setUserDetails(null);
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <>  
     <div className='main '>
     <Navbar/>

     <div className="h-screen flex flex-col justify-center items-center">
            <div className="w-11/12 max-w-md bg-white shadow-lg rounded-xl p-20">
                <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block font-medium mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block font-medium mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Sign In
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                {userDetails && (
                    <div className="mt-4 p-4 bg-green-100 rounded-lg">
                        <h3 className="font-bold">User Details</h3>
                        <p>Name: {userDetails.name}</p>
                        <p>Email: {userDetails.email}</p>
                        <p>Role: {userDetails.role}</p>
                    </div>
                )}
            </div>
        </div>
</div>
   </>
  );
};

export default Signin;
