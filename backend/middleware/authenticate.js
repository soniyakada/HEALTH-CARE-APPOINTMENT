const jwt = require("jsonwebtoken");
require('dotenv').config(); 

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; 

const authenticate= (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the token is present in the Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  console.log("On middleware",token)
  console.log("chl rha hai ")
  // Verify the token
  jwt.verify(token,JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user; // Attach the decoded user info to the request
    next();
  });
};

module.exports = authenticate;
