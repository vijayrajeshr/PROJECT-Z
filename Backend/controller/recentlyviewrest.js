// const mongoose = require("mongoose");
// const User = require("../models/user");
// // Add to recently viewed
// const { ObjectId } = mongoose.Types;

// const recentlyviewed_rest = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const restaurantId = req.params.id; // Get restaurant ID from URL param

//     // Validate inputs
//     if (!userId || !mongoose.isValidObjectId(userId)) {
//       return res.status(400).json({ error: "Invalid or missing user ID" });
//     }
//     if (!restaurantId || !mongoose.isValidObjectId(restaurantId)) {
//       return res
//         .status(400)
//         .json({ error: "Invalid or missing restaurant ID" });
//     }

//     // Find user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Ensure recentlyViewed is an array
//     if (!Array.isArray(user.recentlyViewed)) {
//       user.recentlyViewed = [];
//     }

//     // Convert restaurantId to ObjectId for comparison
//     const restaurantObjectId = new ObjectId(restaurantId);

//     // Remove existing restaurant ID if present
//     user.recentlyViewed = user.recentlyViewed.filter(
//       (id) => !id.equals(restaurantObjectId)
//     );

//     // Add restaurant ID to the front
//     user.recentlyViewed.unshift(restaurantObjectId);

//     // Limit to 20 entries
//     if (user.recentlyViewed.length > 20) {
//       user.recentlyViewed = user.recentlyViewed.slice(0, 20);
//     }

//     // Save the updated user
//     await user.save();

//     // Log for debugging
//     console.log(
//       `Updated recentlyViewed for user ${userId}:`,
//       user.recentlyViewed
//     );

//     return res.json({
//       message: "Recently viewed updated",
//       recentlyViewed: user.recentlyViewed,
//     });
//   } catch (err) {
//     console.error("Error in recentlyviewed_rest:", err);
//     return res
//       .status(500)
//       .json({ error: "Server error", details: err.message });
//   }
// };

// // // Get recently viewed
// // const getrecently_viewedrest = async (req, res) => {
// //   try {
// //     const userId = req.session.user?.id; // Changed from .user._id to .user.id based on your update

// //     if (!userId || !mongoose.isValidObjectId(userId)) {
// //       return res.status(400).json({ error: "Invalid user ID" });
// //     }

// //     console.log("Fetching user with ID:", userId);

// //     const [user] = await User.aggregate([
// //       // Stage 1: Match the user by ID
// //       {
// //         $match: {
// //           _id: new mongoose.Types.ObjectId(userId),
// //         },
// //       },
// //       // Stage 2: Lookup Firm documents for recentlyViewed
// //       {
// //         $lookup: {
// //           from: "firms", // Collection name in MongoDB (lowercase, pluralized by Mongoose)
// //           localField: "recentlyViewed._id",
// //           foreignField: "_id",
// //           as: "recentlyViewed",
// //         },
// //       },
// //       // Stage 3: Unwind the recentlyViewed array to process each item
// //       {
// //         $unwind: {
// //           path: "$recentlyViewed",
// //           preserveNullAndEmptyArrays: true, // Keep users with empty recentlyViewed
// //         },
// //       },
// //       // Stage 4: Sort by _id in descending order to reverse the array
// //       {
// //         $sort: {
// //           "recentlyViewed._id": -1, // -1 for descending order (newest first)
// //         },
// //       },
// //       // Stage 5: Group back to reconstruct the recentlyViewed array
// //       {
// //         $group: {
// //           _id: "$_id",
// //           recentlyViewed: { $push: "$recentlyViewed" },
// //         },
// //       },
// //       // Stage 6: Project only necessary fields
// //       {
// //         $project: {
// //           recentlyViewed: {
// //             $map: {
// //               input: "$recentlyViewed",
// //               as: "firm",
// //               in: {
// //                 _id: "$$firm._id",
// //                 restaurantInfo: {
// //                   name: "$$firm.restaurantInfo.name",
// //                   address: "$$firm.restaurantInfo.address",
// //                   ratings: "$$firm.restaurantInfo.ratings",
// //                   image_urls: "$$firm.image_urls",
// //                 },
// //               },
// //             },
// //           },
// //         },
// //       },
// //     ]);

// //     if (!user) {
// //       return res.status(404).json({ error: "User not found" });
// //     }
// //     res.json({ recentlyViewed: user.recentlyViewed || [] });
// //   } catch (err) {
// //     console.error("Error fetching recently viewed:", err);
// //     res.status(500).json({ error: "Server error", details: err.message });
// //   }
// // };

// const getrecently_viewedrest = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;

//     if (!userId || !mongoose.isValidObjectId(userId)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }

//     console.log("Fetching user with ID:", userId);

//     const [user] = await User.aggregate([
//       // Stage 1: Match the user by ID
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       // Stage 2: Lookup Firm documents for recentlyViewed
//       {
//         $lookup: {
//           from: "firms",
//           localField: "recentlyViewed._id",
//           foreignField: "_id",
//           as: "recentlyViewedFirms", // Use a different name to avoid overwriting
//         },
//       },
//       // Stage 3: Project to map the recentlyViewed array with Firm details
//       {
//         $project: {
//           recentlyViewed: {
//             $map: {
//               input: "$recentlyViewed",
//               as: "viewed",
//               in: {
//                 $arrayElemAt: [
//                   {
//                     $filter: {
//                       input: "$recentlyViewedFirms",
//                       as: "firm",
//                       cond: { $eq: ["$$firm._id", "$$viewed._id"] },
//                     },
//                   },
//                   0,
//                 ],
//               },
//             },
//           },
//         },
//       },
//       // Stage 4: Project only necessary fields
//       {
//         $project: {
//           recentlyViewed: {
//             $map: {
//               input: "$recentlyViewed",
//               as: "firm",
//               in: {
//                 _id: "$$firm._id",
//                 restaurantInfo: {
//                   name: "$$firm.restaurantInfo.name",
//                   address: "$$firm.restaurantInfo.address",
//                   ratings: "$$firm.restaurantInfo.ratings",
//                   image_urls: "$$firm.image_urls",
//                 },
//               },
//             },
//           },
//         },
//       },
//     ]);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json({ recentlyViewed: user.recentlyViewed || [] });
//   } catch (err) {
//     console.error("Error fetching recently viewed:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };

// module.exports = { getrecently_viewedrest, recentlyviewed_rest };

const mongoose = require("mongoose");
const User = require("../models/user");
const Firm = require("../models/Firm");
const Tiffin = require("../models/Tiffin");
const { ObjectId } = mongoose.Types;

const recentlyviewed_rest = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const itemId = req.params.id;
    console.log(itemId);
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }
    if (!itemId || !mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ error: "Invalid or missing item ID" });
    }

    let foundItem = await Firm.findById(itemId);
    let itemType = "Firm";

    if (!foundItem) {
      foundItem = await Tiffin.findById(itemId);
      itemType = "Tiffin";
    }

    if (!foundItem) {
      return res.status(404).json({ error: "Item not found in Firms or Tiffins." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(user.recentlyViewed)) {
      user.recentlyViewed = [];
    }

    const itemObjectId = new ObjectId(itemId);

    user.recentlyViewed = user.recentlyViewed.filter(
      (item) => !(item.itemId.equals(itemObjectId) && item.itemType === itemType)
    );

    user.recentlyViewed.unshift({
      itemId: itemObjectId,
      itemType: itemType,
      viewedAt: new Date(),
    });

    if (user.recentlyViewed.length > 20) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    }

    await user.save();

    console.log(
      `Updated recentlyViewed for user ${userId}:`,
      user.recentlyViewed
    );

    return res.json({
      message: "Recently viewed updated",
      recentlyViewed: user.recentlyViewed,
    });
  } catch (err) {
    console.error("Error in recentlyviewed_rest:", err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
};

const getrecently_viewedrest = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    console.log("Fetching user with ID:", userId);

    const [user] = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: "$recentlyViewed",
      },
      {
        $lookup: {
          from: "firms",
          localField: "recentlyViewed.itemId",
          foreignField: "_id",
          as: "firmDetails",
        },
      },
      {
        $lookup: {
          from: "tiffins",
          localField: "recentlyViewed.itemId",
          foreignField: "_id",
          as: "tiffinDetails",
        },
      },
      {
        $project: {
          _id: 0,
          viewedAt: "$recentlyViewed.viewedAt",
          itemType: "$recentlyViewed.itemType",
          itemDetails: {
            $cond: {
              if: { $eq: ["$recentlyViewed.itemType", "Firm"] },
              then: { $arrayElemAt: ["$firmDetails", 0] },
              else: { $arrayElemAt: ["$tiffinDetails", 0] },
            },
          },
        },
      },
      {
        $match: {
          itemDetails: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$_id",
          recentlyViewed: {
            $push: {
              itemId: "$itemDetails._id",
              itemType: "$itemType",
              viewedAt: "$viewedAt",
              firmInfo: {
                $cond: {
                  if: { $eq: ["$itemType", "Firm"] },
                  then: {
                    name: "$itemDetails.restaurantInfo.name",
                    address: "$itemDetails.restaurantInfo.address",
                    ratings: "$itemDetails.restaurantInfo.ratings",
                    image_urls: "$itemDetails.image_urls",
                  },
                  else: "$$REMOVE",
                },
              },
              tiffinInfo: {
                $cond: {
                  if: { $eq: ["$itemType", "Tiffin"] },
                  then: {
                    name: "$itemDetails.kitchenName",
                    address: "$itemDetails.address",
                    ratings: "$itemDetails.ratings",
                    image_urls: "$itemDetails.images",
                  },
                  else: "$$REMOVE",
                },
              },
            },
          },
        },
      },
      {
        $project: {
          recentlyViewed: {
            $sortArray: {
              input: "$recentlyViewed",
              sortBy: { viewedAt: -1 },
            },
          },
        },
      },
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ recentlyViewed: user.recentlyViewed || [] });
  } catch (err) {
    console.error("Error fetching recently viewed:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = { getrecently_viewedrest, recentlyviewed_rest };