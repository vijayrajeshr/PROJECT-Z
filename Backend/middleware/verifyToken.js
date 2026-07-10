const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");

dotEnv.config();
const secretKey = process.env.WhatIsYourName;

const verifyToken = async (req, res, next) => {
  console.log("--- MIDDLEWARE HIT ---");
  console.log("1. Origin:", req.headers.origin);
  console.log("2. Auth Header:", req.headers.authorization);
  console.log("3. Cookie Token:", req.cookies?.token);
  const token = req.cookies.token || req.headers.token || req.headers.authorization;
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
  }
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const vendor = await User.findById(decoded.vendorId || decoded.id || decoded._id);
    if (!vendor) {
      return res.status(404).json({ error: "User/Vendor Not Found" });
    }
    req.vendorId = vendor._id; 
    req.user = vendor; // Good practice to attach the whole user object
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ error: "Invalid token" });
  }
};
module.exports = verifyToken;