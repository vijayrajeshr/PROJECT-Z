// const User = require("../../models/user");
// const Firm = require("../../models/Firm");

// // app.post('/api/users/:userId/favorite',

// const updatelikedByUser = async (req, res) => {
//   const { userId } = req.session.user?.id;
//   const { targetId } = req.body;

//   const user = await User.findById(userId);
//   const restaurant = await Firm.findById(targetId);

//   if (!user || !restaurant) return res.status(404).json({ error: "Not found" });

//   const alreadyLiked = user.favoritesRestaurant.includes(targetId);

//   if (alreadyLiked) {
//     user.favoritesRestaurant.pull(targetId);
//     restaurant.likedBy.pull(userId);
//   } else {
//     user.favoritesRestaurant.push(targetId);
//     restaurant.likedBy.push(userId);
//   }

//   await user.save();
//   await restaurant.save();

//   res.json({ success: true });
// };

// module.exports = { updatelikedByUser };

const User = require("../../models/user");
const Firm = require("../../models/Firm");
const mongoose = require("mongoose");

const updatelikedByUser = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const targetId = req.params.id;
    if (!userId || !targetId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const user = await User.findById(userId).select("favoritesRestaurant");
    const restaurant = await Firm.findById(targetId).select("likedBy");

    if (!user || !restaurant) {
      return res.status(404).json({ error: "User or restaurant not found" });
    }

    const alreadyLiked = user.favoritesRestaurant.includes(targetId);

    const userUpdate = alreadyLiked
      ? { $pull: { favoritesRestaurant: targetId } }
      : { $addToSet: { favoritesRestaurant: targetId } };

    const restaurantUpdate = alreadyLiked
      ? { $pull: { likedBy: userId } }
      : { $addToSet: { likedBy: userId } };

    await Promise.all([
      User.updateOne({ _id: userId }, userUpdate),
      Firm.updateOne({ _id: targetId }, restaurantUpdate),
    ]);

    return res.json({ success: true, liked: !alreadyLiked });
  } catch (error) {
    console.error("Error in updatelikedByUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getLikedRestaurantsByUser = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(401)
        .json({ error: "User not authenticated or invalid ID" });
    }
    const likedRestaurants = await Firm.aggregate([
      {
        $match: {
          likedBy: { $in: [new mongoose.Types.ObjectId(userId)] },
        },
      },
      {
        $project: {
          _id: 1,
          "restaurantInfo.name": 1,
          "restaurantInfo.city": 1,
          "restaurantInfo.area": 1,
          "restaurantInfo.priceRange": 1,
          "restaurantInfo.cuisines": 1,
          "restaurantInfo.ratings": 1,
          "restaurantInfo.address": 1,
          "restaurantInfo.additionalInfo": 1,
          image_urls: 1,
          popularity: 1,
          opening_hours: 1,
          features: 1,
        },
      },
    ]);

    return res.json({ success: true, restaurants: likedRestaurants });
  } catch (error) {
    console.error("Error in getLikedRestaurantsByUser:", error.stack || error);
    return res
      .status(500)
      .json({ error: "Server error", message: error.message });
  }
};

// const likedByUser = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;
//     const restId = req.params.id;
//     console.log(restId, userId, "this is the id");
//     if (!userId || !restId) {
//       return res.status(400).json({ error: "Invalid input" });
//     }
//     const user = await User.findById(userId).select("favoritesRestaurant");
//     const alreadyLiked = user.favoritesRestaurant.includes(restId);
//     return res.json({ islike: alreadyLiked });
//   } catch (error) {
//     console.error("Error in getLikeByUser:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

const likedByUser = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const restId = req.params.id;

    if (!userId || !restId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const objectRestId = new mongoose.Types.ObjectId(restId);

    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          islike: {
            $in: [objectRestId, "$favoritesRestaurant"],
          },
        },
      },
    ]);

    const islike = result[0]?.islike || false;

    return res.json({ islike });
  } catch (error) {
    console.error("Error in getLikeByUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { updatelikedByUser, getLikedRestaurantsByUser, likedByUser };
