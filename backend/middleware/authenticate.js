import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';



const authenticate= (req, res, next) => {
  const token = req.cookies.token;
   console.log("Cookie token:", token);
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("[]]][][",decoded);
    req.user = decoded;
     console.log("✅ Decoded:", decoded);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default  authenticate;
