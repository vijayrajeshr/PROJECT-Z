
const Tiffin = require("../../models/Tiffin");
const mongoose = require("mongoose");


// exports.toggleLike = async (req, res) => {
//   try {
//     const { id } = req.params; // Tiffin ID
//     const userId = req.session.user.id; // User ID from authentication middleware

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid Tiffin ID" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid User ID" });
//     }

//     const tiffin = await Tiffin.findById(id);

//     if (!tiffin) {
//       return res.status(404).json({ message: "Tiffin not found" });
//     }

//     // Check if the user has already liked this Tiffin
//     const userLikedIndex = tiffin.likedBy.findIndex(
//       (likedUserId) => likedUserId.toString() === userId.toString()
//     );

//     if (userLikedIndex === -1) {
//       tiffin.likedBy.push(userId);
//       await tiffin.save();
//       return res.status(200).json({ message: "Tiffin liked successfully", liked: true });
//     } else {
//       tiffin.likedBy.splice(userLikedIndex, 1);
//       await tiffin.save();
//       return res.status(200).json({ message: "Tiffin unliked successfully", liked: false });
//     }
//   } catch (error) {
//     console.error("Error toggling like:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // Tiffin ID
    const userId = req.session.user.id; // User ID from authentication middleware

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Tiffin ID" });
    }
    // No need to validate userId here if it's coming from an authenticated session
    // but keeping it for safety
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const tiffin = await Tiffin.findById(id);

    if (!tiffin) {
      return res.status(404).json({ message: "Tiffin not found" });
    }

    const userLikedIndex = tiffin.likedBy.findIndex(
      (likedUserId) => likedUserId.toString() === userId.toString()
    );

    if (userLikedIndex === -1) {
      // User has not liked it, so add the like
      await Tiffin.findByIdAndUpdate(
        id,
        { $push: { likedBy: userId } },
        { new: true, runValidators: false } // 'runValidators: false' is key here
      );
      return res.status(200).json({ message: "Tiffin liked successfully", liked: true });
    } else {
      // User has already liked it, so remove the like
      await Tiffin.findByIdAndUpdate(
        id,
        { $pull: { likedBy: userId } },
        { new: true, runValidators: false }
      );
      return res.status(200).json({ message: "Tiffin unliked successfully", liked: false });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.checkIfLiked = async (req, res) => {
  try {
    const { id } = req.params; // Tiffin ID
    const userId = req.session.user.id; // User ID from authentication middleware

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Tiffin ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const tiffin = await Tiffin.findById(id);

    if (!tiffin) {
      return res.status(404).json({ message: "Tiffin not found" });
    }

    const isLiked = tiffin.likedBy.some(
      (likedUserId) => likedUserId.toString() === userId.toString()
    );

    res.status(200).json({ isLiked });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getLikedTiffins = async (req, res) => {
  try {
    const userId = req.session.user.id; // User ID from authentication middleware

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Find all Tiffins where the 'likedBy' array contains the current user's ID
    const likedTiffins = await Tiffin.find({ likedBy: userId });

    if (likedTiffins.length === 0) {
      return res.status(200).json({ message: "No liked Tiffins found for this user.", likedTiffins: [] });
    }

    res.status(200).json({ likedTiffins });
  } catch (error) {
    console.error("Error fetching liked Tiffins:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};