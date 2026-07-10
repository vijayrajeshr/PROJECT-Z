const User = require("../models/user");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    // console.log(user);
    req.user = {
      email: user.email,
      id: user._id,
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Invaild token" });
  }
};

const hasAdminRight = async (req, res, next) => {
  try {
    // Extract user ID from either dashboard session or regular session
    let userId = null;
    
    if (req.session?.dashboardUser?._id) {
      userId = req.session.dashboardUser._id;
    } else if (req.session?.user?._id) {
      userId = req.session.user._id;
    } else if (req.session?.id) {
      userId = req.session.id;
    }

    if (!userId) {
      return res.status(401).json({
        response: false,
        message: "Session not found. Please log in.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        response: false,
        message: "User not found",
      });
    }

    if (!user.role.includes("admin")) {
      return res.status(403).json({
        response: false,
        message: "User doesn't have the admin level access",
      });
    }
    next();
  } catch (err) {
    console.error("hasAdminRight error:", err.message);
    res.status(500).json({
      response: false,
      message: "You don't have the admin level access",
    });
  }
};

const hasModeratorRight = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.role.includes("moderator")) {
      return res.status(403).json({
        response: false,
        message: "User don't have the moderator level access",
      });
    }
    next();
  } catch (err) {
    res.status.json({
      response: false,
      message: err.message,
    });
  }
};

const hasAdminAndModeratorRight = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const roles = ["admin", "moderator"];
    if (roles.some((role) => user.role.includes(role))) {
      return next();
    }
    res.status(403).json({
      response: false,
      message: "User don't have the moderator level access",
    });
  } catch (err) {
    res.status.json({
      response: false,
      message: err.message,
    });
  }
};

const hasMarketingPersonRight = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.role.includes("marketingPerson")) {
      return res.status(403).json({
        response: false,
        message: "User don't have the marketing person level access",
      });
    }
    next();
  } catch (err) {
    res.status.json({
      response: false,
      message: err.message,
    });
  }
};

const hasFirmOwnerRight = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const roles = evry;
    if (!user.role.includes("restaurantOwner")) {
      return res.status(403).json({
        response: false,
        message: "User don't have the Restaurant Owner level access",
      });
    }
    next();
  } catch (err) {
    res.status.json({
      response: false,
      message: err.message,
    });
  }
};
const hasKitchenOwnerRight = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.role.includes("kitchenOwner")) {
      return res.status(403).json({
        response: false,
        message: "User don't have the Kitchen Owner level access",
      });
    }
    next();
  } catch (err) {
    res.status.json({
      response: false,
      message: err.message,
    });
  }
};
const hasEventCreatorRight = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.role.includes("eventCreator")) {
      return res.status(403).json({
        response: false,
        message: "User don't have the event creator level access",
      });
    }
    next();
  } catch (err) {
    res.status.json({
      response: false,
      message: err.message,
    });
  }
};

module.exports = {
  verifyToken,
  hasAdminRight,
  hasModeratorRight,
  hasMarketingPersonRight,
  hasAdminAndModeratorRight,
  hasFirmOwnerRight,
  hasKitchenOwnerRight,
  hasEventCreatorRight,
};
