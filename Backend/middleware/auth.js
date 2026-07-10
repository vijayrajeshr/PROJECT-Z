// const authMiddleware = (req, res, next) => {
//   // Check if the user is authenticated via session or OAuth (req.user from Passport.js)
//   if (req.session && req.session.user) {
//     return next();
//   }
//   // Check if the user is authenticated via OAuth (Google, Facebook, Twitter)
//   if (req.isAuthenticated() && req.user) {
//     return next(); // If OAuth authentication exists, proceed to the next middleware
//   }

//   // If no session or OAuth authentication, return Unauthorized error
//   return res.status(401).json({ error: "Unauthorized access. Please log in." });
// };

// module.exports = authMiddleware;

// const authMiddleware = (req, res, next) => {
//   // Check if the user is authenticated via session
//   console.log(req.session)
//   if (req.session && req.session.user) {
//     console.log("Session-based authentication successful.");
//     return next();
//   }

//   // If no session or OAuth authentication, return Unauthorized error
//   console.log("Unauthorized access attempt.");
//   // return res.status(401).json({ error: "Unauthorized access. Please log in." });
//   return res.redirect(`${process.env.FRONTEND_URL}`);
// };


// const authMiddleware = (req, res, next) => {
//   console.log("Session object:", JSON.stringify(req.session));
//   console.log("Session user:", req.session?.user);
//   console.log("Dashboard user:", req.session?.dashboardUser);

//   // Accept either regular session.user (from regular login) or dashboardUser (from dashboard login)
//   if (req.session && (req.session.user || req.session.dashboardUser)) {
//     console.log("Authentication successful (session or dashboard).");
//     return next();
//   }

//   console.log("Unauthorized access attempt.");
//   if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
//     return res.status(401).json({ error: "Unauthorized access. Please log in." });
//   } else {
//     return res.redirect(process.env.FRONTEND_URL || "/");
//   }
// };
// module.exports = authMiddleware;



const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Adjust path to your User model
const dotEnv = require("dotenv");

dotEnv.config();
// Ensure this matches the env variable used in generateAuthToken
const secretKey = process.env.WhatIsYourName || process.env.JWT_SECRET; 

const authMiddleware = async (req, res, next) => {
  // 1. Check Cookies first (for deployment), then Headers (for testing)
  const token = req.cookies.token || req.headers.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    // If it's an API call, return JSON error
    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }
    // If it's a browser page load, Redirect to Login/Home
    // (This prevents the user from seeing a raw JSON error on the screen)
    return res.redirect(process.env.FRONTEND_URL || "/");
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    // 2. Find the user based on the ID in the token
    // We check vendorId, id, and _id to be safe
    const userId = decoded.vendorId || decoded.id || decoded._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    // 3. Attach user to request
    req.user = user;
    req.vendorId = user._id; // Keep this for compatibility with your other code

    console.log("Authentication successful for:", user.email);
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    
    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
      return res.status(401).json({ error: "Invalid or Expired Token" });
    }
    // Redirect to login if token is invalid
    return res.redirect(process.env.FRONTEND_URL || "/");
  }
};

module.exports = authMiddleware;