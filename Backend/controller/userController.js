// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const bcrypt = require("bcryptjs");
// require("dotenv").config();
// const historyLogRecorder = require("../utils/historyLogRecorder");

// const my_secret = process.env.JWT_SECRET || "";

// const registerUser = async (req, res) => {
//   try {
//     let { username, email, password, role } = req.body;

//     const existUser = await User.findOne({ email: email });
//     if (existUser) {
//       return res.status(403).json({ message: "User aleardy exist" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       email,
//       username,
//       password: hashedPassword,
//       role: role,
//     });

//     await newUser.save();
//     res.status(201).json({ response: true, message: "New user created" });
//   } catch (err) {
//     console.log(err);
//     // res.json({err})
//     res.status(500).json({ response: false, error: "internal Server error" });
//   }
// };

// // req.session.user = {
// //   id: user._id,
// //   email: user.email,
// //   username: user.username,
// // };

// // const loginUser = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const existUser = await User.findOne({ email: email });
// //     const isSame = await bcrypt.compare(password, existUser.password);

// //     if (!existUser || !isSame) {
// //       return res
// //         .status(401)
// //         .json({ message: "User email or password is wrong" });
// //     }
// //     existUser.lastLogin = new Date();
// //     await existUser.save();

// //     const token = jwt.sign(
// //       {
// //         userId: existUser._id,
// //       },
// //       my_secret,
// //       { expiresIn: "1d" }
// //     );

// // req.session.user = {
// //   id: existUser._id,
// //   email: existUser.email,
// //   username: existUser.username,
// // };

// // await req.session.save();
// //     res
// //       .status(201)
// //       .json({ response: true, message: "user login successfully", token });
// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({ response: false, error: "Internal server Error" });
// //   }
// // };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const existUser = await User.findOne({ email: email });
//     if (!existUser) {
//       return res
//         .status(401)
//         .json({ message: "User email or password is wrong" });
//     }
//     const isSame = await bcrypt.compare(password, existUser.password);
//     if (!isSame) {
//       return res
//         .status(401)
//         .json({ message: "User email or password is wrong" });
//     }

//     existUser.lastLogin = new Date();
//     await existUser.save();

//     req.session.user = {
//       id: existUser._id,
//       email: existUser.email,
//       username: existUser.username,
//     };
//     await req.session.save();
//     const token = jwt.sign(
//       {
//         userId: existUser._id,
//       },
//       my_secret,
//       { expiresIn: "1d" }
//     );

//     res.status(201).json({
//       response: true,
//       message: "user login successfully",
//       token,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ response: false, error: "Internal server Error" });
//   }
// };

// //admin dashboard controllers ---------------
// const changeMultiUserRoles = async (req, res) => {
//   try {
//     const { roles } = req.body;
//     let users;
//     if (roles.length <= 0) {
//       users = await User.find().limit(100);
//       return res.json({
//         response: true,
//         message: "clear filter",
//         users: users,
//       });
//     }
//     users = await User.find({ role: { $all: [...roles] } }).limit(100);
//     const userArr = users.map((el) => el._id);
//     historyLogRecorder(
//       req,
//       users.constructor.modelName,
//       "UPDATE",
//       userArr,
//       `Change the role of multiple user`
//     );
//     res.json({ response: true, message: "filter applied", users: users });
//   } catch (err) {
//     console.log(err);
//     res.json({ response: false, error: err.message });
//   }
// };

// const changeSingleUserRoles = async (req, res) => {
//   try {
//     let { role } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { $set: { role: role } },
//       { new: true }
//     );
//     if (!user) {
//       return res
//         .status(404)
//         .json({ response: false, message: "User not exist" });
//     }
//     historyLogRecorder(
//       req,
//       user.constructor.modelName,
//       "UPDATE",
//       user._id,
//       `change user role with ${user._id}`
//     );
//     res.status(200).json({ response: true, message: "User data updated" });
//   } catch (err) {
//     console.log(err);
//     res.json({ response: false, error: err.message });
//   }
// };

// const toggleUserBanStatus = async (req, res) => {
//   try {
//     console.log("toggleUserBanStatus", req.session.user.email);
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ response: false, message: "User not exist" });
//     }
//     let msg;
//     if (!user.isBanned) {
//       user.isBanned = true;
//       msg = "User is Banned";
//     } else {
//       user.isBanned = false;
//       msg = "User's ban removed";
//     }
//     await user.save();

//     historyLogRecorder(
//       req,
//       user.constructor.modelName,
//       "UPDATE",
//       user._id,
//       `${msg} with ${user._id}`
//     );
//     res.status(200).json({ response: true, message: `${msg} successfully` });
//   } catch (err) {
//     console.log(err);
//     res.json({ response: false, error: err.message });
//   }
// };

// const searchUserByNameAndEmail = async (req, res) => {
//   try {
//     console.log("searchUserByNameAndEmail", req.session.user);
//     const searchTerm = req.query.q;
//     const users = await User.find({
//       $or: [
//         { name: { $regex: searchTerm, $options: "i" } },
//         { email: { $regex: searchTerm, $options: "i" } },
//       ],
//     });

//     res.json({ users: users });
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// };

// // Destroy session

// // Clear session cookie

// const deleteUserProfile = async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const fetchUser = await User.findByIdAndDelete(userId);

//     if (!fetchUser) {
//       return res.status(403).json({
//         response: false,
//         message: "Something went wrong, user not accessible",
//       });
//     }

//     // Log the delete action
//     historyLogRecorder(
//       req,
//       fetchUser.constructor.modelName,
//       "DELETE",
//       fetchUser._id,
//       `Delete user with ${fetchUser._id}`
//     );

//     // Destroy session and clear cookie
//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Session destruction error:", err);
//         return res.status(500).json({ error: "Failed to clear session" });
//       }

//       res.clearCookie("connect.sid", { path: "/" });
//       return res.status(200).json({
//         response: true,
//         message: "User deleted and session cleared",
//       });
//     });
//   } catch (err) {
//     console.error("Delete user error:", err);
//     return res.status(500).json({ error: "Something went wrong on server" });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     // let { role } = req.body;
//     const fetchUser = await User.findByIdAndDelete(req.params.id);
//     if (!fetchUser) {
//       return res.status(403).json({
//         response: false,
//         message: "Something went wrong, user not accessible",
//       });
//     }
//     historyLogRecorder(
//       req,
//       fetchUser.constructor.modelName,
//       "DELETE",
//       fetchUser._id,
//       `Delete user with ${fetchUser._id}`
//     );
//     res
//       .status(200)
//       .json({ response: true, message: "User deleted from database" });
//   } catch (err) {
//     console.log(err);
//     res.json({ error: "You are not admin" });
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     console.log("all user", req.session.user);
//     const allUser = await User.find()
//       .sort({ username: 1 })
//       .populate("firms", "firmName")
//       // .populate("kitchens", "kitchenName")
//       .populate("events", "eventName");
//     historyLogRecorder(
//       req,
//       allUser.constructor.modelName,
//       "READ",
//       [],
//       `Read all the user`
//     );
//     res.status(200).json({ response: true, users: allUser });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ err: "You need to request again" });
//   }
// };

// const roleBasedFilter = async (req, res) => {
//   try {
//     const word = req.query.word;
//     if (word.length === 0) {
//       const users = await User.find();
//       return res.status(200).json({ response: true, users: users });
//     }

//     let users;
//     switch (word) {
//       case "user":
//         users = await User.find({ role: { $in: [word] } });
//         break;
//       case "restaurantOwner":
//         users = await User.find({ role: { $in: [word] } });
//         break;
//       case "kitchenOwner":
//         users = await User.find({ role: { $in: [word] } });
//         break;
//       case "eventCreator":
//         users = await User.find({ role: { $in: [word] } });
//         break;
//       case "moderator":
//         users = await User.find({ role: { $in: [word] } });
//         break;
//       case "marketingPerson":
//         users = await User.find({ role: { $in: [word] } });
//         break;
//       case "admin":
//         users = await User.find({ role: { $in: [word] } });
//         break;
//       default:
//         users = await User.find({});
//     }

//     historyLogRecorder(
//       req,
//       users.constructor.modelName,
//       "READ",
//       [],
//       `Read all the user with ${word} role`
//     );

//     res.status(200).json({ response: true, users: users });
//   } catch (err) {
//     res.json({ response: false, error: err.message });
//   }
// };

// const sortUser = async (req, res) => {
//   try {
//     const word = req.query.word;
//     let users;
//     switch (word) {
//       case "newest":
//         users = await User.find().sort({ createdAt: 1 }).limit(100);
//         break;
//       case "oldest":
//         users = await User.find().sort({ createdAt: -1 }).limit(100);
//         break;
//       case "lastLogin":
//         users = await User.find().sort({ lastLogin: 1 }).limit(100);
//         break;
//       case "alphabet":
//         users = await User.aggregate([
//           {
//             $addFields: {
//               lowerUsername: { $toLower: "$username" }, // Create a new field for case-insensitive sorting
//             },
//           },
//           { $sort: { lowerUsername: 1 } }, // Sort by the lowercase username
//           { $limit: 100 },
//           { $project: { lowerUsername: 0 } }, // Remove temporary field before returning results
//         ]);
//         break;
//       case "clear":
//         users = await User.find({});
//         break;
//       default:
//         users = await User.find({});
//     }

//     historyLogRecorder(
//       req,
//       users.constructor.modelName,
//       "READ",
//       [],
//       `Read all the user with ${word} role`
//     );

//     res.status(200).json({ response: true, users: users });
//   } catch (err) {
//     res.json({ response: false, error: err.message });
//   }
// };

// const bannedManyUser = async (req, res) => {
//   try {
//     const mode = req.query.mode;
//     console.log(mode);
//     const arrayIds = req.body.data;
//     console.log(arrayIds);
//     const updateUsers = await User.updateMany(
//       { _id: { $in: [...arrayIds] } },
//       { $set: { isBanned: mode === "allow" ? false : true } },
//       {
//         new: true,
//       }
//     );

//     if (!updateUsers) {
//       return res
//         .status(404)
//         .json({ response: false, messsage: "Users not found" });
//     }

//     historyLogRecorder(
//       req,
//       updateUsers.constructor.modelName,
//       "DELETE",
//       updateUsers.map((el) => el._id),
//       `ban multiple user with respective ids`
//     );

//     res
//       .status(201)
//       .json({ response: true, message: "Users banned successfully" });
//   } catch (err) {
//     res.status(403).json({ response: false, error: err.message });
//   }
// };

// const accessManyUser = async (req, res) => {
//   try {
//     const { arrayIds, newRole } = req.body;
//     console.log({ arrayIds, newRole });
//     const updateUsers = await User.updateMany(
//       { _id: { $in: [...arrayIds] } },
//       { $addToSet: { role: newRole } },
//       {
//         new: true,
//       }
//     );

//     if (!updateUsers) {
//       return res
//         .status(404)
//         .json({ response: false, messsage: "Users not found" });
//     }

//     historyLogRecorder(
//       req,
//       updateUsers.constructor.modelName,
//       "DELETE",
//       updateUsers.map((el) => el._id),
//       `Add role to multiple user with respective ids`
//     );

//     res
//       .status(201)
//       .json({ response: true, message: "Users roles updated successfully" });
//   } catch (err) {
//     res.status(403).json({ response: false, error: err.message });
//   }
// };

// const editUser = async (req, res) => {
//   try {
//     let { email, password, username, role } = req.body;
//     const existUser = await User.findOne({ email: email });
//     const isSame = await bcrypt.compare(password, existUser.password);

//     if (!existUser || !isSame) {
//       return res
//         .status(401)
//         .json({ message: "User email or password is wrong" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, {
//       email,
//       username,
//       role,
//       password: hashedPassword,
//     });

//     historyLogRecorder(
//       req,
//       updatedUser.constructor.modelName,
//       "DELETE",
//       updatedUser._id,
//       `Edit user with ${updatedUser._id}`
//     );

//     res.status(200).json({
//       response: true,
//       message: "User updated successfully",
//       user: updatedUser,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(403).json({ response: false, error: err.message });
//   }
// };

// const deleteManyUser = async (req, res) => {
//   try {
//     const arrayIds = req.body;
//     const deletedUser = await User.deleteMany(
//       { _id: { $in: [...arrayIds] } },
//       {
//         new: true,
//       }
//     );

//     if (!deletedUser) {
//       return res
//         .status(404)
//         .json({ response: false, messsage: "Users not found" });
//     }

//     historyLogRecorder(
//       req,
//       deletedUser.constructor.modelName,
//       "DELETE",
//       deletedUser.map((el) => el._id),
//       `Delete users with ${deletedUser.map((el) => el._id)}`
//     );
//     res
//       .status(201)
//       .json({ response: true, message: "Users deleted successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(403).json({ response: false, error: err.message });
//   }
// };

// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ response: false, message: "User not found" });
//     }
//     res.status(200).json({ response: true, message: "We go the user", user });
//   } catch (err) {
//     res.status(403).json({ response: false, message: err.message });
//   }
// };

// const profileEdit = async (req, res) => {
//   const userId = req.session?.user?.id; // Assuming userId is in session
//   if (!userId) {
//     return res
//       .status(401)
//       .json({ message: "Unauthorized: Please login or sign up." });
//   }

//   const {
//     username,
//     dateOfBirth,
//     gender,
//     anniversary,
//     email,
//     address,
//     description,
//     handle,
//     website,
//   } = req.body;

//   try {
//     let user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }
//     user.username = username !== undefined ? username : user?.username;
//     user.dateOfBirth =
//       dateOfBirth !== undefined ? new Date(dateOfBirth) : user?.dateOfBirth;
//     user.gender = gender !== undefined ? gender : user.gender;
//     user.anniversary =
//       anniversary !== undefined ? new Date(anniversary) : user?.anniversary;
//     user.address = address !== undefined ? address : user?.address;
//     user.des = description !== undefined ? description : user?.des;
//     user.handle = handle !== undefined ? handle : user?.handle;
//     user.website = website !== undefined ? website : user?.website;
//     await user.save();
//     return res.status(200).json({
//       message: "Profile updated successfully!",
//       user: user.toObject(),
//     }); // .toObject() to ensure plain JS object
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return res.status(500).json({
//       message: "Server error during profile update.",
//       error: error.message,
//     });
//   }
// };
// const marketingPerson=async(req,res)=>{
//   try{
//     const user=await User.findOne({role:"marketingPerson"});
//     return res.status(200).json(user);
//   }
//   catch (error) {
//     console.error("Error retrieving profile data:", error);
//     return res
//       .status(500)
//       .json({
//         message: "Server error retrieving profile data.",
//         error: error.message,
//       });
//   }
// };


// const profileData = async (req, res) => {
//   const userId = req.session?.user?.id;

//   try {
//     if (!userId) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: Please login or sign up." });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "No user found with this ID." });
//     }

//     return res.status(200).json({
//       message: "User profile data retrieved successfully.",
//       user: {
//         username: user?.username,
//         email: user?.email,
//         phone: user?.phone,
//         dateOfBirth: user?.dateOfBirth,
//         gender: user?.gender,
//         anniversary: user?.anniversary,
//         address: user?.address,
//         description: user?.des,
//         handle: user?.handle,
//         website: user?.website,
//       },
//     });
//   } catch (error) {
//     console.error("Error retrieving profile data:", error);
//     return res.status(500).json({
//       message: "Server error retrieving profile data.",
//       error: error.message,
//     });
//   }
// };

// const sendOtpEmail = async (req, res) => {
//   const userId = req.session?.user?.id;
//   const { email } = req.body;

//   if (!userId) {
//     return res
//       .status(401)
//       .json({ message: "Unauthorized: Please login or sign up." });
//   }
//   if (!email) {
//     return res.status(400).json({ message: "Email is required to send OTP." });
//   }

//   try {
//     // Check if the email is already in use by another user (if changing to a new email)
//     const existingUserWithEmail = await User.findOne({
//       email,
//       _id: { $ne: userId },
//     });
//     if (existingUserWithEmail) {
//       return res
//         .status(409)
//         .json({ message: "This email is already registered by another user." });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Generate a 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Store OTP in database (or update if exists)
//     await Otp.findOneAndUpdate(
//       { userId: userId, email: email },
//       { otp: otp, createdAt: Date.now() },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     // Send OTP to the email (uncomment and configure Nodemailer for actual sending)
//     /*
//         const mailOptions = {
//             from: 'your_email@example.com',
//             to: email,
//             subject: 'Your OTP for Email Change',
//             text: `Your One-Time Password (OTP) for changing your email is: ${otp}. It is valid for 5 minutes.`
//         };

//         await transporter.sendMail(mailOptions);
//         */
//     console.log(`OTP for ${email}: ${otp}`); // For testing, log OTP to console

//     return res
//       .status(200)
//       .json({ message: "OTP sent successfully to your email." });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     return res.status(500).json({
//       message: "Server error while sending OTP.",
//       error: error.message,
//     });
//   }
// };


// const HandleProfileEditMarketing =async(req, res) => {
//     const { name, email, password } = req.body;

//   try{
//     if (!name || !email) {
//         return res.status(400).json({ success: false, message: 'Name and email are required.' });
//     }

//     const user=await User.findOne({email:email});
//     if(!user){
//       return res.status(404).json({message:"USer not found"});
//     }
//     if (password) {
//         // Here, you would typically hash the password and save it
        
//         User.password = password;
//         await User.save(); // For demonstration purposes
//         return res.json({ success: true, message: 'Password and profile updated successfully!' });
//     } else {
//         // Simulate general profile update
//         User.name = name;
//         User.email = email;
//         await User.save();
//         return res.json({ success: true, message: 'Profile information updated successfully!' });
//     }
//   }
//   catch (error) {
//     console.error("Error sending OTP:", error);
//     return res
//       .status(500)
//       .json({
//         message: "Server error while sending OTP.",
//         error: error.message,
//       });
//   }
// }
// //--------------------------------
// module.exports = {
//   registerUser,
//   loginUser,
//   profileEdit,
//   profileData,
//   deleteUserProfile,
//   changeMultiUserRoles,
//   changeSingleUserRoles,
//   toggleUserBanStatus,
//   searchUserByNameAndEmail,
//   deleteUser,
//   getAllUsers,
//   roleBasedFilter,
//   sortUser,
//   bannedManyUser,
//   accessManyUser,
//   editUser,
//   deleteManyUser,
//   getUserById,
//   HandleProfileEditMarketing,
//   marketingPerson
// };

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const historyLogRecorder = require("../utils/historyLogRecorder");

const my_secret = process.env.JWT_SECRET || "";

const registerUser = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;

    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.status(403).json({ response: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role: role,
    });

    await newUser.save();
    res.status(201).json({ response: true, message: "New user created" });
  } catch (err) {
    console.log(err);
    // res.json({err})
    res.status(500).json({ response: false, error: "internal Server error" });
  }
};

// req.session.user = {
//   id: user._id,
//   email: user.email,
//   username: user.username,
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const existUser = await User.findOne({ email: email });
//     const isSame = await bcrypt.compare(password, existUser.password);

//     if (!existUser || !isSame) {
//       return res
//         .status(401)
//         .json({ message: "User email or password is wrong" });
//     }
//     existUser.lastLogin = new Date();
//     await existUser.save();

//     const token = jwt.sign(
//       {
//         userId: existUser._id,
//       },
//       my_secret,
//       { expiresIn: "1d" }
//     );

// req.session.user = {
//   id: existUser._id,
//   email: existUser.email,
//   username: existUser.username,
// };

// await req.session.save();
//     res
//       .status(201)
//       .json({ response: true, message: "user login successfully", token });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ response: false, error: "Internal server Error" });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email: email });
    if (!existUser) {
      return res.status(401).json({ message: "User email or password is wrong" });
    }
    const isSame = await bcrypt.compare(password, existUser.password);
    if (!isSame) {
      return res.status(401).json({ message: "User email or password is wrong" });
    }

    existUser.lastLogin = new Date();
    await existUser.save();

    req.session.user = {
      id: existUser._id,
      email: existUser.email,
      username: existUser.username,
    };
    console.log(req.session.user)
    await req.session.save();

    console.log("Session user after login:", req.session.user);

    const token = jwt.sign(
      {
        userId: existUser._id,
      },
      my_secret,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      response: true,
      message: "user login successfully",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ response: false, error: "Internal server Error" });
  }
};

const marketingPerson=async(req,res)=>{
  try{
    const user=await User.findOne({role:"marketingPerson"});
    return res.status(200).json(user);
  }
  catch (error) {
    console.error("Error retrieving profile data:", error);
    return res
      .status(500)
      .json({
        message: "Server error retrieving profile data.",
        error: error.message,
      });
  }
};
const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const fetchUser = await User.findByIdAndDelete(userId);

    if (!fetchUser) {
      return res.status(403).json({
        response: false,
        message: "Something went wrong, user not accessible",
      });
    }

    // Log the delete action
    historyLogRecorder(
      req,
      fetchUser.constructor.modelName,
      "DELETE",
      fetchUser._id,
      `Delete user with ${fetchUser._id}`
    );

    // Destroy session and clear cookie
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ error: "Failed to clear session" });
      }

      res.clearCookie("connect.sid", { path: "/" });
      return res.status(200).json({
        response: true,
        message: "User deleted and session cleared",
      });
    });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ error: "Something went wrong on server" });
  }
};
//admin dashboard controllers ---------------
const changeMultiUserRoles = async (req, res) => {
  try {
    const { roles } = req.body;
    let users;
    if (roles.length <= 0) {
      users = await User.find().limit(100);
      return res.json({
        response: true,
        message: "clear filter",
        users: users,
      });
    }
    users = await User.find({ role: { $all: [...roles] } }).limit(100);
    const userArr = users.map((el) => el._id);
    historyLogRecorder(
      req,
      users.constructor.modelName,
      "UPDATE",
      userArr,
      `Change the role of multiple user`
    );
    res.json({ response: true, message: "filter applied", users: users });
  } catch (err) {
    console.log(err);
    res.json({ response: false, error: err.message });
  }
};

const changeSingleUserRoles = async (req, res) => {
  try {
    let { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { role: role } },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ response: false, message: "User not exist" });
    }
    historyLogRecorder(
      req,
      user.constructor.modelName,
      "UPDATE",
      user._id,
      `change user role with ${user._id}`
    );
    res.status(200).json({ response: true, message: "User data updated" });
  } catch (err) {
    console.log(err);
    res.json({ response: false, error: err.message });
  }
};

const toggleUserBanStatus = async (req, res) => {
  try {
    console.log("toggleUserBanStatus", req.session?.user?.email || "No session");
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ response: false, message: "User not exist" });
    }
    let msg;
    if (!user.isBanned) {
      user.isBanned = true;
      msg = "User is Banned";
    } else {
      user.isBanned = false;
      msg = "User's ban removed";
    }
    await user.save();

    historyLogRecorder(
      req,
      user.constructor.modelName,
      "UPDATE",
      user._id,
      `${msg} with ${user._id}`
    );
    res.status(200).json({ response: true, message: `${msg} successfully` });
  } catch (err) {
    console.log(err);
    res.json({ response: false, error: err.message });
  }
};

const searchUserByNameAndEmail = async (req, res) => {
  try {
    console.log("searchUserByNameAndEmail", req.session?.user || "No session");
    const searchTerm = req.query.q;
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.json({ users: users });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    // let { role } = req.body;
    const fetchUser = await User.findByIdAndDelete(req.params.id);
    if (!fetchUser) {
      return res.status(403).json({
        response: false,
        message: "Something went wrong, user not accessible",
      });
    }
    historyLogRecorder(
      req,
      fetchUser.constructor.modelName,
      "DELETE",
      fetchUser._id,
      `Delete user with ${fetchUser._id}`
    );
    res
      .status(200)
      .json({ response: true, message: "User deleted from database" });
  } catch (err) {
    console.log(err);
    res.json({ error: "You are not admin" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("all user", req.session?.user || "No session");
    const allUser = await User.find()
      .sort({ username: 1 })
      .populate("firms", "firmName")
      // .populate("kitchens", "kitchenName")
      .populate("events", "eventName");

    historyLogRecorder(
      req,
      allUser.constructor.modelName,
      "READ",
      [],
      `Read all the user`
    );
    res.status(200).json({ response: true, users: allUser });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "You need to request again" });
  }
};

const roleBasedFilter = async (req, res) => {
  try {
    const word = req.query.word;
    if (word.length === 0) {
      const users = await User.find();
      return res.status(200).json({ response: true, users: users });
    }

    let users;
    switch (word) {
      case "user":
        users = await User.find({ role: { $in: [word] } });
        break;
      case "restaurantOwner":
        users = await User.find({ role: { $in: [word] } });
        break;
      case "kitchenOwner":
        users = await User.find({ role: { $in: [word] } });
        break;
      case "eventCreator":
        users = await User.find({ role: { $in: [word] } });
        break;
      case "moderator":
        users = await User.find({ role: { $in: [word] } });
        break;
      case "marketingPerson":
        users = await User.find({ role: { $in: [word] } });
        break;
      case "admin":
        users = await User.find({ role: { $in: [word] } });
        break;
      default:
        users = await User.find({});
    }

    historyLogRecorder(
      req,
      users.constructor.modelName,
      "READ",
      [],
      `Read all the user with ${word} role`
    );

    res.status(200).json({ response: true, users: users });
  } catch (err) {
    res.json({ response: false, error: err.message });
  }
};

const sortUser = async (req, res) => {
  try {
    const word = req.query.word;
    let users;
    switch (word) {
      case "newest":
        users = await User.find().sort({ createdAt: 1 }).limit(100);
        break;
      case "oldest":
        users = await User.find().sort({ createdAt: -1 }).limit(100);
        break;
      case "lastLogin":
        users = await User.find().sort({ lastLogin: 1 }).limit(100);
        break;
      case "alphabet":
        users = await User.aggregate([
          {
            $addFields: {
              lowerUsername: { $toLower: "$username" }, // Create a new field for case-insensitive sorting
            },
          },
          { $sort: { lowerUsername: 1 } }, // Sort by the lowercase username
          { $limit: 100 },
          { $project: { lowerUsername: 0 } }, // Remove temporary field before returning results
        ]);
        break;
      case "clear":
        users = await User.find({});
        break;
      default:
        users = await User.find({});
    }

    historyLogRecorder(
      req,
      users.constructor.modelName,
      "READ",
      [],
      `Read all the user with ${word} role`
    );

    res.status(200).json({ response: true, users: users });
  } catch (err) {
    res.json({ response: false, error: err.message });
  }
};

const bannedManyUser = async (req, res) => {
  try {
    const mode = req.query.mode;
    console.log(mode);
    const arrayIds = req.body.data;
    console.log(arrayIds);
    const updateUsers = await User.updateMany(
      { _id: { $in: [...arrayIds] } },
      { $set: { isBanned: mode === "allow" ? false : true } },
      {
        new: true,
      }
    );

    if (!updateUsers) {
      return res
        .status(404)
        .json({ response: false, messsage: "Users not found" });
    }

    // updateMany returns a result object, not the updated documents.
    // Use the incoming array of ids for logging instead of mapping the result.
    historyLogRecorder(
      req,
      User.modelName,
      "UPDATE",
      arrayIds,
      `ban multiple user with respective ids`
    );

    res
      .status(201)
      .json({ response: true, message: "Users banned successfully" });
  } catch (err) {
    res.status(403).json({ response: false, error: err.message });
  }
};

const accessManyUser = async (req, res) => {
  try {
    const { arrayIds, newRole } = req.body;
    console.log({ arrayIds, newRole });
    const updateUsers = await User.updateMany(
      { _id: { $in: [...arrayIds] } },
      { $addToSet: { role: newRole } },
      {
        new: true,
      }
    );

    if (!updateUsers) {
      return res
        .status(404)
        .json({ response: false, messsage: "Users not found" });
    }

    // updateMany returns an operation result object. Use provided ids for logging.
    historyLogRecorder(
      req,
      User.modelName,
      "UPDATE",
      arrayIds,
      `Add role to multiple user with respective ids`
    );

    res
      .status(201)
      .json({ response: true, message: "Users roles updated successfully" });
  } catch (err) {
    res.status(403).json({ response: false, error: err.message });
  }
};

const editUser = async (req, res) => {
  try {
    let { email, password, username, role } = req.body;
    const existUser = await User.findOne({ email: email });
    const isSame = await bcrypt.compare(password, existUser.password);

    if (!existUser || !isSame) {
      return res
        .status(401)
        .json({ message: "User email or password is wrong" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      email,
      username,
      role,
      password: hashedPassword,
    });

    historyLogRecorder(
      req,
      updatedUser.constructor.modelName,
      "DELETE",
      updatedUser._id,
      `Edit user with ${updatedUser._id}`
    );

    res.status(200).json({
      response: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ response: false, error: err.message });
  }
};
const putNotificationSettings = async (req, res) => {
  try {
    const { enableAll, promoPush, promoWhatsapp, socialPush, orderPush, orderWhatsapp } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.notificationSettings = {
      enableAll,
      promoPush,
      promoWhatsapp,
      socialPush,
      orderPush,
      orderWhatsapp
    };

    await user.save();
    res.status(200).json({ message: "Notification settings updated", settings: user.notificationSettings });
  } catch (error) {
    res.status(500).json({ response: false, message: error.message });
  }
};

const getNotificationsSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notificationSettings = user.notificationSettings || {
      enableAll: false,
      promoPush: false,
      promoWhatsapp: false,
      socialPush: false,
      orderPush: false,
      orderWhatsapp: false,
    };

    return res.status(200).json(notificationSettings);
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return res.status(500).json({ message: error.message });
  }
};

const updateVegMode = async (req, res) => {
  try {
    const { vegMode } = req.body;

    // Validate input
    if (typeof vegMode !== 'boolean') {
      return res.status(400).json({ message: "Invalid vegMode value. Expected boolean." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.vegMode = vegMode;
    await user.save();

    return res.status(200).json({ message: "Veg mode updated", vegMode: user.vegMode });
  } catch (error) {
    console.error("Error in updateVegMode:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getVegMode = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const vegMode = typeof user.vegMode === 'boolean' ? user.vegMode : false;

    return res.status(200).json({ vegMode });
  } catch (error) {
    console.error("Error in getVegMode:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const PostNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { title, description, time } = req.body;

    const newNotification = {
      title,
      description,
      time,
    };

    if (!Array.isArray(user.Notifications)) {
      user.Notifications = [];
    }

    user.Notifications.push(newNotification);

    await user.save();

    return res.status(200).json({ notifications: user.Notifications });
  } catch (err) {
    console.error("❌ Notification save error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const GetNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notifications = user.Notifications;
    return res.status(200).json({ notifications });  // ✅ correct
  } catch (err) {
    console.error("Error fetching notifications", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const DeleteNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notificationId = req.params.id;

    // Ensure Notifications is an array of objects with _id
    user.Notifications = user.Notifications.filter(
      (n) => n._id.toString() !== notificationId
    );

    await user.save();

    return res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteManyUser = async (req, res) => {
  try {
    const arrayIds = req.body;
    const deletedUser = await User.deleteMany(
      { _id: { $in: [...arrayIds] } },
      {
        new: true,
      }
    );

    if (!deletedUser) {
      return res
        .status(404)
        .json({ response: false, messsage: "Users not found" });
    }

    // deleteMany returns a result (deletedCount), not the deleted documents.
    // Use the provided array of ids for audit logging.
    historyLogRecorder(
      req,
      User.modelName,
      "DELETE",
      arrayIds,
      `Delete users with ${arrayIds}`
    );
    res
      .status(201)
      .json({ response: true, message: "Users deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ response: false, error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res
        .status(404)
        .json({ response: false, message: "User not found" });
    }
    res.status(200).json({ response: true, message: "We go the user", user });
  } catch (err) {
    res.status(403).json({ response: false, message: err.message });
  }
};


const profileEdit = async (req, res) => {
    const userId = req.session?.user?.id; // Assuming userId is in session
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: Please login or sign up." });
    }

    const {
        username,
        dateOfBirth,
        gender,
        anniversary,
        address,
        description,
        handle,
        website,
    } = req.body;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.username = username !== undefined ? username : user?.username;
        user.dateOfBirth = dateOfBirth !== undefined ? new Date(dateOfBirth) : user?.dateOfBirth;
        user.gender = gender !== undefined ? gender : user.gender;
        user.anniversary = anniversary !== undefined ? new Date(anniversary) : user?.anniversary;
        user.address = address !== undefined ? address : user?.address;
        user.des = description !== undefined ? description : user?.des;
        user.handle = handle !== undefined ? handle : user?.handle;
        user.website = website !== undefined ? website : user?.website;
        user.email = email !== undefined ? email : user?.email;
        await user.save();
        return res.status(200).json({ message: "Profile updated successfully!", user: user.toObject() }); // .toObject() to ensure plain JS object

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Server error during profile update.", error: error.message });
    }
};

const profileData = async (req, res) => {
    const userId = req.session?.user?.id;

    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Please login or sign up." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "No user found with this ID." });
        }

        return res.status(200).json({
            message: "User profile data retrieved successfully.",
            user: {
                username: user?.username,
          
                phone: user?.phone,
                dateOfBirth: user?.dateOfBirth,
                gender: user?.gender,
                anniversary: user?.anniversary,
                address: user?.address,
                description: user?.des,
                handle: user?.handle,
                website: user?.website,
            }
        });
    } catch (error) {
        console.error("Error retrieving profile data:", error);
        return res.status(500).json({ message: "Server error retrieving profile data.", error: error.message });
    }
};

const sendOtpEmail = async (req, res) => {
    const userId = req.session?.user?.id;
    const { email } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: Please login or sign up." });
    }
    if (!email) {
        return res.status(400).json({ message: "Email is required to send OTP." });
    }

    try {
        // Check if the email is already in use by another user (if changing to a new email)
        const existingUserWithEmail = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUserWithEmail) {
            return res.status(409).json({ message: "This email is already registered by another user." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in database (or update if exists)
        await Otp.findOneAndUpdate(
            { userId: userId, email: email },
            { otp: otp, createdAt: Date.now() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send OTP to the email (uncomment and configure Nodemailer for actual sending)
        /*
        const mailOptions = {
            from: 'your_email@example.com',
            to: email,
            subject: 'Your OTP for Email Change',
            text: `Your One-Time Password (OTP) for changing your email is: ${otp}. It is valid for 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        */
        console.log(`OTP for ${email}: ${otp}`); // For testing, log OTP to console

        return res.status(200).json({ message: "OTP sent successfully to your email." });

    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ message: "Server error while sending OTP.", error: error.message });
    }
};
//--------------------------------
module.exports = {
  registerUser,
  loginUser,
  profileEdit,
  profileData,
  changeMultiUserRoles,
  changeSingleUserRoles,
  toggleUserBanStatus,
  searchUserByNameAndEmail,
  deleteUser,
  getAllUsers,
  roleBasedFilter,
  sortUser,
  bannedManyUser,
  accessManyUser,
  editUser,
  deleteManyUser,
  getUserById,
   getNotificationsSettings,
  putNotificationSettings,
  updateVegMode,
  getVegMode,
  PostNotifications,
  GetNotifications,
  DeleteNotification,
  marketingPerson,
  deleteUserProfile
};
