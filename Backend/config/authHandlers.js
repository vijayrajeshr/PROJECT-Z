const UserModel = require("../models/user");
const axios = require("axios");
const {
  comparePassword,
  hashedPassword,
} = require("../middleware/password_hash");

const OTP_SERVICE_BASE_URL =
  process.env.backend_url || process.env.BACKEND_URL || "http://localhost:3000";
const FIXED_TEST_OTP = process.env.FIXED_TEST_OTP || "123456";

// middleware/authMiddleware.js
exports.isAuthenticated = (req, res, next) => {
  console.log("Session in isAuthenticated:", req.user);
  if (req.session.user && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized access." });
};

exports.handleOAuthSuccess = (req, res) => {
  if (req.user) {
    req.session.user = {
      id: req.user.id,
      email: req.user.email || null,
      username: req.user.displayName || req.user.username,
      profilePic:
        req.user.profilePicture || req.user.photos?.[0]?.value || null,
      role: req.user.role,
    };
    req.session.save(() => res.redirect(process.env.FRONTEND_URL));
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=unauthorized`);
  }
};

exports.signupHandler = async (req, res) => {
  try {
    const { username, email } = req.body;
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({
        error:
          existingUser.email === email
            ? "This email is already registered."
            : "This username is already taken.",
      });
    }
    await axios.post(`${OTP_SERVICE_BASE_URL}/api/send-email-otp`, { email });
    req.session.save(() =>
      res
        .status(201)
        .json({ message: "Otp Send Successful!", user: req.session.user })
    );
  } catch (error) {
    console.error("Signup OTP dispatch failed:", error.message);
    const payload = {
      message:
        "OTP service unavailable. Use the fixed code to continue verification.",
      otpDispatchFailed: true,
      fixedOtp: FIXED_TEST_OTP,
    };
    if (req.session?.save) {
      return req.session.save(() => res.status(201).json(payload));
    }
    return res.status(201).json(payload);
  }
};

exports.verifyHandler = async (req, res, next) => {
  try {
    const { identifier, otp, username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const otpResponse = await axios.post(
      `${OTP_SERVICE_BASE_URL}/api/verify-otp`,
      { identifier, otp: Number(otp) }
    );

    if (!otpResponse.data.success) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    const hashed = await hashedPassword(password);
    const newUser = await UserModel.create({
      username,
      email: identifier,
      password: hashed,
      role: username.role,
    });

    req.session.user = { id: newUser._id, email: newUser.email };
    req.session.save(() =>
      res
        .status(201)
        .json({ message: "Signup successful!", user: req.session.user })
    );
  } catch (error) {
    next(error);
  }
};
exports.resetPassword = async (req, res, next) => {
  const { newPassword } = req.body;

  // Validate input
  if (!newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long." });
  }

  // Check session for OTP verification and email
  if (!req.session.isOtpVerified || !req.session.email) {
    return res
      .status(400)
      .json({ message: "OTP not verified or email missing in session." });
  }

  try {
    // Find user by email
    const user = await UserModel.findOne({ email: req.session.email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = await hashedPassword(newPassword);
    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// exports.loginHandler = async (req, res, next) => {
//   try {
//     const { email, password, rememberMe } = req.body;

//     // Check for missing fields
//     if (!email || !password) {
//       return res.status(400).json({ error: "All fields are required." });
//     }

//     // Find user and select password explicitly
//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found. Please sign up." });
//     }

//     // Verify password
//     const isMatch = await comparePassword(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Incorrect password." });
//     }

//     // Set session expiration
//     if (rememberMe) {
//       req.session.cookie.maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days in ms
//       console.log("MaxAge Set To:", req.session.cookie.maxAge);
//     } else {
//       req.session.cookie.expires = null; // Session cookie
//     }

//     // Regenerate session to prevent fixation
//     req.session.regenerate((err) => {
//       if (err) {
//         console.error("Session Regenerate Error:", err);
//         return next(err);
//       }
//       // Set user data
//       req.session.user = {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//         username: user.username,
//       };
//       // Save the session
//       req.session.save((err) => {
//         if (err) {
//           console.error("Session Save Error:", err);
//           return next(err); // Add return to stop execution
//         }
//         return res
//           .status(200)
//           .json({ message: "Login successful!", user: req.session.user });
//       });
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     return next(error); // Always return to avoid further execution
//   }
// };

exports.loginHandler = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found. Please sign up." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    // Regenerate session for security
    req.session.regenerate((err) => {
      if (err) return next(err);

      // Store user data in session
      req.session.user = {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      // Set cookie expiration
      if (rememberMe) {
        req.session.cookie.maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days
      } else {
        req.session.cookie.expires = false; // Session cookie
      }

      // Save the session
      req.session.save((err) => {
        if (err) return next(err);
        console.log("Session after login:", req.session); // Add this line
        return res
          .status(200)
          .json({ message: "Login successful!", user: req.session.user });
      });
    });
  } catch (error) {
    console.error("Login Error:", error);
    return next(error);
  }
};

exports.logoutHandler = (req, res, next) => {
  if (!req.logout) {
    return next(new Error("Logout function not available"));
  }

  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.redirect(process.env.FRONTEND_URL || "/");
    });
  });
};

// exports.userHandler = (req, res) => {
//   if (req.session.user) {
//     return res.status(200).json({
//       user: {
//         id: req.session.user.id,
//         username: req.session.user.username,
//         email: req.session.user.email || null,
//         role: req.session.user.role,
//         firm: req.session.user.firms,
//       },
//     });
//   }

//   if (req.isAuthenticated() && req.user) {
//     return res.status(200).json({
//       user: {
//         id: req.user.id,
//         email: req.user.email || null,
//         username: req.user.displayName || req.user.username || "Unknown",
//         profilePic: req.user.profilePic || req.user.photos?.[0]?.value || null,
//         role: req.user.role,
//         firm: req.session.user.firms,
//       },
//     });
//   }

//   return res.status(401).json({ error: "No active session." });
// };

exports.userHandler = async (req, res) => {
  if (req.session.user) {
    // const userFirmsId = await UserModel.findById(req.session.user.id).select(
    //   "firms"
    // );
    return res.status(200).json({
      user: {
        id: req.session.user.id,
        username: req.session.user.username,
        email: req.session.user.email || null,
        role: req.session.user.role,
        // firm: userFirmsId.firms, // Now populated
      },
    });
  }

  if (req.isAuthenticated() && req.user) {
    // const user = await UserModel.findById(req.user.id).select("firms");
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.displayName || user.username || "Unknown",
        email: user.email || null,
        profilePic: user.profilePic || user.photos?.[0]?.value || null,
        role: user.role,
        // firm: user.firms,
      },
    });
  }

  return res.status(401).json({ error: "No active session." });
};

module.exports = exports;
