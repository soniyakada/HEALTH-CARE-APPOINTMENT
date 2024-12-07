import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './signin.css';
import { Link } from "react-router-dom";

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
     <div className='header'>
        <div>Logo</div>
        <div>
            <Link to="/signin"><h3>Signin</h3></Link>
            <Link to="/signup"><h3>Signup</h3></Link>
        </div>
    </div>

      <div className='inner flex  '>
      <div className=" h-96 w-96 p-6 bg-zinc-50 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4 ">Sign In</h2>
      <form onSubmit={handleSignIn}>
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>

      {/* Display Message */}
      {message && <p className="mt-4 text-center">{message}</p>}

      {/* Display User Details */}
      {userDetails && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="font-bold">User Details</h3>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Role: {userDetails.role}</p>
        </div>
      )}
    </div>
      


      </div>
     </div>
     <div>
</div>
   </>
  );
};

export default Signin;
