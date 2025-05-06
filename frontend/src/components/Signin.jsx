import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./signin.css";
import Navbar from "./Navbar";
const API_URL = import.meta.env.VITE_API_URL;

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [emailerror, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Enter email address.");
      return;
    } else if (!password.trim()) {
      setPassword("Enter valid password.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signin`, {
        email,
        password,
      });
      const { user } = response.data;
      console.log(user.id);
      navigate(`/profile/${user.id}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
      setUserDetails(null);
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <>
      <div className="main ">
        <Navbar />

        <div className="inner flex  ">
          <div className=" h-96 w-96 p-6 bg-zinc-50 rounded-md shadow-md">
            <h2 className="text-xl mb-4 ml-32 text">Sign In</h2>
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
                  onFocus={() => {
                    setEmailError("");
                  }}
                />
                {emailerror && (
                  <span className="text-xs text-red-600">{emailerror}</span>
                )}
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
                  onFocus={() => {
                    setPassError("");
                  }}
                />
                {passError && (
                  <span className="text-xs text-red-600">{passError}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="signinbutton w-full bg-blue-700 text-white py-2 rounded "
              >
                Sign In
              </button>
            </form>

            {/* Display Message */}
            {message && (
              <p className="mt-4 text-center text-xs text-red-500">{message}</p>
            )}

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
      <div></div>
    </>
  );
};

export default Signin;
