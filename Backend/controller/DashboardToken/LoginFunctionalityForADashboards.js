const User = require("../../models/user");
const { generateAuthToken } = require("./JWT");
const bcrypt = require("bcryptjs");
const Firm = require("../../models/Firm");
const Tiffin = require("../../models/Tiffin");

// const dashboard = async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     const findUser = await User.findOne({ email });

//     if (!findUser) {
//       return res.status(404).json({ message: "Email not found." });
//     }
//     const isMatchRole = await User.findOne({ role: { $in: [role] } });
//     if (!isMatchRole) {
//       return res
//         .status(401)
//         .json({ message: "Please select the correct role!" });
//     }
//     const isMatch = await bcrypt.compare(password, findUser.password);
//     if (!isMatch && findUser.password !== password) {
//       return res.status(401).json({ message: "Invalid credentials." });
//     }

//     console.log(findUser);

//     const { role: userRoles, username, _id } = findUser;
//     let url = "";

//     if (userRoles.length === 1 && userRoles.includes("user")) {
//       return res.status(403).json({
//         message:
//           "Access denied. Standard users do not have a dedicated dashboard.",
//       });
//     }

//     if (userRoles.includes("admin")) {
//       url = "/dashboard/admins/home";
//     } else if (userRoles.includes("restaurantOwner")) {
//       const firm = await Firm.findOne({
//         ownerEmail: email,
//         restaurantStatus: "Approved",
//       }).select("_id");
//       const id = firm?._id.toString();
//       if (firm) {
//         url = `/dashboard/restaurants/home/${id}`;
//       } else {
//         return res.status(403).json({
//           message:
//             "Access denied. No restaurant found associated with this email.",
//         });
//       }
//     } else if (userRoles.includes("kitchenOwner")) {
//       const tiffin = await Tiffin.findOne({ ownerMail: email });
//       if (tiffin) {
//         url = "/dashboard/tiffins/home";
//       } else {
//         return res.status(403).json({
//           message: "Access denied. No tiffin found associated with this user.",
//         });
//       }
//     } else if (userRoles.includes("moderator")) {
//       url = "//dashboard/marketing/home";
//     } else if (userRoles.includes("eventCreator")) {
//       url = "event-dashboard";
//     } else if (userRoles.includes("marketingPerson")) {
//       url = "marketing-dashboard";
//     } else {
//       url = "/";
//       console.warn(
//         `User with roles ${userRoles.join(
//           ", "
//         )} has no specific dashboard path defined. Redirecting to default.`
//       );
//     }

//     const token = await generateAuthToken(findUser);

//     return res.status(200).json({
//       message: `Redirecting to ${url}`,
//       url,
//       role: userRoles,
//       username,
//       id: _id,
//       token,
//     });
//   } catch (error) {
//     console.error("Error during dashboard redirection:", error);
//     return res.status(500).json({
//       error: "An error occurred during dashboard access. Please try again.",
//     });
//   }
// };

const dashboard = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check if selected role is part of the user's role array
    if (!findUser.role.includes(role)) {
      return res
        .status(401)
        .json({ message: "Please select the correct role!" });
    }

    const { role: userRoles, username, _id } = findUser;
    let url = "";

    // ... (Your existing URL logic remains exactly the same) ...
    if (userRoles.length === 1 && userRoles.includes("user")) {
       return res.status(403).json({ message: "Access denied." });
    }
    
    if (userRoles.includes("admin")) {
      url = "/dashboard/admins/home";
    } else if (userRoles.includes("restaurantOwner")) {
      // ... keep your existing logic here ...
      const firm = await Firm.findOne({
        ownerEmail: email,
        restaurantStatus: "Approved",
      }).select("_id");
      if (firm) url = `/dashboard/restaurants/home/${firm._id}`;
      else return res.status(403).json({ message: "No restaurant found." });
    } else if (userRoles.includes("kitchenOwner")) {
       // ... keep your existing logic here ...
       const tiffin = await Tiffin.findOne({ ownerMail: email });
       if (tiffin) url = "/dashboard/tiffins/home";
       else return res.status(403).json({ message: "No tiffin found." });
    } else if (userRoles.includes("moderator")) {
      url = "/dashboard/marketing/home";
    } else if (userRoles.includes("eventCreator")) {
      url = "/dashboard/event-dashboard";
    } else if (userRoles.includes("marketingPerson")) {
      url = "/dashboard/marketing-dashboard";
    } else {
      url = "/";
    }

    // Generate JWT token
    const token = await generateAuthToken(findUser);

    // ==========================================
    // 🔴 THIS IS THE MISSING PART YOU NEED 🔴
    // ==========================================
    
    // Define cookie options based on environment
    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true, // Prevents client-side JS from reading the cookie
      secure: isProduction, // TRUE for Render (HTTPS), FALSE for localhost
      sameSite: isProduction ? "none" : "lax", // 'none' is required for cross-site cookie
    };

    // Send the cookie AND the JSON
    return res
      .status(200)
      .cookie("token", token, cookieOptions) // <--- ATTACH COOKIE HERE
      .json({
        message: `Redirecting to ${url}`,
        url,
        role: userRoles,
        username,
        id: _id,
        token,
      });

  } catch (error) {
    console.error("Error during dashboard redirection:", error);
    return res.status(500).json({
      error: "An error occurred during dashboard access. Please try again.",
    });
  }
};

const Sign = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  console.log(req.body);

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      username: name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    const token = await generateAuthToken(user);
    return res.status(200).json({ message: "Sign in successful", token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
const getMyProfile = async (req, res) => {
  console.log(req.user);
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Not authorized, no user ID in token." });
  }

  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let userData = {
      _id: user._id,
      username: user.username,
      firms: user.firms,
      email: user.email,
      roles: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
      profilePicture: user.profilePicture,
    };

    if (user.role.includes("kitchenOwner")) {
      const tiffinInfo = await Tiffin.findOne({
        ownerMail: user?.email,
      }).select("name address description");
      if (tiffinInfo) {
        userData.kitchenDetails = {
          name: tiffinInfo.name,
          address: tiffinInfo.address,
          description: tiffinInfo.description,
        };
      }
    }

    if (user.role.includes("restaurantOwner")) {
      const firmInfo = await Firm.findOne({ ownerEmail: user.email }).select(
        "firmName area address"
      );
      if (firmInfo) {
        userData.restaurantDetails = {
          name: firmInfo.firmName,
          area: firmInfo.area,
          address: firmInfo.address,
        };
      }
    }

    return res.status(200).json({
      message: "User profile fetched successfully.",
      userData: userData,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching profile." });
  }
};

const getProfile = async (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  } else {
    return res.status(400).json({ message: "Authoriztion no Token is Valid" });
  }
};

module.exports = { dashboard, Sign, getMyProfile, getProfile };
