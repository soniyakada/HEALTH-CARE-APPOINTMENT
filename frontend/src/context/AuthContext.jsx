import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // Stores { id, name, email, role }
  const [loading, setLoading] = useState(true); // Shows spinner while checking auth

  // ✅ Fetch user on first load (based on token in cookies)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`, {
          withCredentials: true,  // send cookie
        });
        setUser(res.data.user); // Save user data in context
      } catch (err) {
        setUser(null); // Not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  console.log("--------------->User------->",user);
  // 🔓 Logout function
  const logout = async () => {
    await axios.post(`${API_URL}/logout`, {}, {
      withCredentials: true,
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use context
export const useAuth = () => useContext(AuthContext);
