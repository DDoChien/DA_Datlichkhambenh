// auth.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    console.log("Authentication failed: No token provided");
    return res.status(401).json({
      errCode: 1,
      errMessage: "No token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully. User info:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({
      errCode: 1,
      errMessage: "Invalid token",
    });
  }
};

const checkRole = (req, res, next) => {
  if (!req.user || req.user.roleId !== "R1") {
    console.log("Role check failed. User:", req.user);
    return res.status(403).json({
      errCode: 1,
      errMessage: "You don't have permission to perform this action",
    });
  }
  console.log("Role check passed. User has role R1");
  next();
};

module.exports = { verifyToken, checkRole };