const express = require('express');
const router = express.Router();
const moment = require('moment');
const Order = require('../../models/UserOrderTakeaway');
const User = require('../../models/user');
const Tiffin = require('../../models/Tiffin');
const { authenticateToken } = require("../../controller/DashboardToken/JWT");

const getDateRange = (period) => {
    let startDate = null;
    let endDate = null;

    const now = moment();

    switch (period) {
        case 'today':
            startDate = now.startOf('day').toDate();
            endDate = now.endOf('day').toDate();
            break;
        case 'thisWeek':
            startDate = now.startOf('isoWeek').toDate();
            endDate = now.endOf('isoWeek').toDate();
            break;
        case 'thisMonth':
            startDate = now.startOf('month').toDate();
            endDate = now.endOf('month').toDate();
            break;
        case 'allTime':
        default:
            break;
    }
    return { startDate, endDate };
};

const populateOrderItems = (query) => {
    return query
        .populate({
            path: 'items.productId',
            model: 'Firm',
            select: 'name description price img foodType',
            discriminator: {
                'Tiffin': { model: 'Tiffin', select: 'name description price img foodType mealType selectedPlan image_urls' }
            },
            match: { 'productModelType': { $exists: true } }
        })
        .populate({
            path: 'items.sourceEntityId',
            model: 'Firm',
            select: 'name email address image_urls',
            discriminator: {
                'Tiffin': { model: 'Tiffin', select: 'name ownerEmail address image_urls' }
            },
            match: { 'sourceEntityName': { $exists: true } }
        });
};


router.get('/order-summary', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const tiffin = await Tiffin.findOne({ ownerMail: email });
        console.log(tiffin);
        if (!tiffin) {
            return res.status(404).json({ message: 'Tiffin owner not found for this email.' });
        }
        const tiffinId = tiffin._id;

        const periods = ['today', 'thisWeek', 'thisMonth', 'allTime'];
        const summary = {};

        for (const period of periods) {
            const { startDate, endDate } = getDateRange(period);
            const matchQuery = { status: { $in: ['accept', 'preparing', 'ready'] } };

            if (startDate && endDate) {
                matchQuery.orderTime = { $gte: startDate, $lte: endDate }; // Changed back to orderTime
            }

            matchQuery['items.sourceEntityId'] = tiffinId;
            matchQuery['items.sourceEntityName'] = 'Tiffin';

            const result = await Order.aggregate([
                { $match: matchQuery },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ]);

            summary[period] = {
                orders: result.length > 0 ? result[0].totalOrders : 0,
                revenue: result.length > 0 ? result[0].totalRevenue : 0,
            };
        }

        res.json(summary);
    } catch (error) {
        console.error('Error fetching order summary:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/average-order-value', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const tiffin = await Tiffin.findOne({ ownerMail: email });
        console.log(tiffin);
        if (!tiffin) {
            return res.status(404).json({ message: 'Tiffin owner not found for this email.' });
        }
        const tiffinId = tiffin._id;

        const periods = ['today', 'thisWeek', 'thisMonth', 'allTime'];
        const aovSummary = {};

        for (const period of periods) {
            const { startDate, endDate } = getDateRange(period);
            const matchQuery = { status: { $in: ['accept', 'preparing', 'ready'] } };

            if (startDate && endDate) {
                matchQuery.orderTime = { $gte: startDate, $lte: endDate }; // Changed back to orderTime
            }

            matchQuery['items.sourceEntityId'] = tiffinId;
            matchQuery['items.sourceEntityName'] = 'Tiffin';

            const result = await Order.aggregate([
                { $match: matchQuery },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' },
                        totalOrders: { $sum: 1 },
                    },
                },
            ]);

            const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
            const totalOrders = result.length > 0 ? result[0].totalOrders : 0;
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            aovSummary[`${period}AOV`] = averageOrderValue;
        }

        res.json(aovSummary);
    } catch (error) {
        console.error('Error fetching average order value:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/user-summary', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ totalUsers });
    } catch (error) {
        console.error('Error fetching user summary:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/order-analytics', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const tiffin = await Tiffin.findOne({ ownerMail: email });

        if (!tiffin) {
            return res.status(404).json({ message: 'Tiffin owner not found for this email.' });
        }
        const tiffinId = tiffin._id;

        const timeframe = req.query.timeframe || 'daily';
        let groupByFormat;
        let sortByField;

        switch (timeframe) {
            case 'daily':
                groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$orderTime" } };
                sortByField = 'date';
                break;
            case 'weekly':
                groupByFormat = { $dateToString: { format: "%Y-%U", date: "$orderTime" } }; // %U for week number
                sortByField = 'week';
                break;
            case 'monthly':
                groupByFormat = { $dateToString: { format: "%Y-%m", date: "$orderTime" } };
                sortByField = 'month';
                break;
            default:
                groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$orderTime" } };
                sortByField = 'date';
                break;
        }

        const matchQuery = {
            status: { $in: ['accept', 'preparing', 'ready'] },
            'items.sourceEntityId': tiffinId,
            'items.sourceEntityName': 'Tiffin',
            orderTime: { $exists: true }
        };

        const result = await Order.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: groupByFormat,
                    orders: { $sum: 1 },
                    totalPurchase: { $sum: '$totalPrice' },
                },
            },
            {
                $project: {
                    _id: 0,
                    [sortByField]: '$_id', 
                    orders: 1,
                    totalPurchase: 1,
                },
            },
            { $sort: { [sortByField]: 1 } },
        ]);

        res.json(result);
    } catch (error) {
        console.error('Error fetching order analytics:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.get('/mealtype-analytics', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const tiffin = await Tiffin.findOne({ ownerMail: email });

        if (!tiffin) {
            return res.status(404).json({ message: 'Tiffin owner not found for this email.' });
        }
        const tiffinId = tiffin._id;

        const timeframe = req.query.timeframe || 'Today';
        let startDate = null;
        let endDate = null;

        const now = moment();

        switch (timeframe) {
            case 'Today':
                startDate = now.startOf('day').toDate();
                endDate = now.endOf('day').toDate();
                break;
            case 'This Week':
                startDate = now.startOf('isoWeek').toDate();
                endDate = now.endOf('isoWeek').toDate();
                break;
            case 'This Month':
                startDate = now.startOf('month').toDate();
                endDate = now.endOf('month').toDate();
                break;
            default:
                break;
        }

        const matchQuery = {
            status: { $in: ['accept', 'preparing', 'ready'] },
            'items.sourceEntityId': tiffinId,
            'items.sourceEntityName': 'Tiffin',
            'items.itemType': 'tiffin',
            'items.mealType': { $exists: true, $ne: null }
        };

        if (startDate && endDate) {
            matchQuery.orderTime = { $gte: startDate, $lte: endDate };
        }

        const result = await Order.aggregate([
            { $match: matchQuery },
            { $unwind: '$items' },
            {
                $match: {
                    'items.sourceEntityId': tiffinId,
                    'items.sourceEntityName': 'Tiffin',
                    'items.itemType': 'tiffin',
                    'items.mealType': { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: '$items.mealType',
                    count: { $sum: '$items.quantity' },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    count: 1,
                },
            },
            { $sort: { count: -1 } },
        ]);

        res.json(result);
    } catch (error) {
        console.error('Error fetching meal type analytics:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


// function isOpenNow(operatingTimes) {
//   const now = new Date();
//   const day = now.toLocaleString("en-US", { weekday: "long", timeZone: "Asia/Kolkata" });

//   const currentMinutes = now.getHours() * 60 + now.getMinutes();

//   const todaySchedule = operatingTimes?.[day];
//   if (!todaySchedule || !todaySchedule.open || !todaySchedule.close) return false;

//   const parseTime = (timeStr) => {
//     const [hours, minutes] = timeStr.split(":").map(Number);
//     return hours * 60 + minutes;
//   };

//   const openMinutes = parseTime(todaySchedule.open);
//   const closeMinutes = parseTime(todaySchedule.close);

//   return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
// }


// router.get("/tiffins/open-now", async (req, res) => {
//   try {
//     let tiffins = await Tiffin.find({}).lean();
//     const openNowTiffins = tiffins.filter(tiffin => isOpenNow(tiffin.operatingTimes));

//     res.status(200).json(openNowTiffins);
//   } catch (err) {
//     console.error("Error in /tiffins/open-now:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// const getMinMealPrice = (menu) => {
//   if (!menu?.mealTypes?.length) return null;

//   let min = Infinity;

//   for (const mealType of menu.mealTypes) {
//     if (mealType.prices) {
//       for (const price of Object.values(mealType.prices)) {
//         const num = parseFloat(price);
//         if (!isNaN(num) && num < min) {
//           min = num;
//         }
//       }
//     }
//   }

//   return min === Infinity ? null : parseFloat(min);
// };

// router.get("/tiffins/filter", async (req, res) => {
//   try {
//     const {
//       sortBy = "rating",
//       order = "desc",
//       minRating,
//       maxRating,
//       price, // target upper price
//       category,
//       deliveryCity
//     } = req.query;

//     const parseRating = (value) => {
//       const num = parseFloat(value);
//       return isNaN(num) ? null : Math.min(Math.max(num, 0), 5);
//     };

//     const minRatingValue = parseRating(minRating);
//     const maxRatingValue = parseRating(maxRating);
//     const upperPrice = price ? parseFloat(price) : null;
//     const lowerPrice = upperPrice !== null ? upperPrice - 20 : null;

//     const query = {};

//     // Rating range filter
//     if (minRatingValue !== null || maxRatingValue !== null) {
//       query.ratings = {};
//       if (minRatingValue !== null) query.ratings.$gte = minRatingValue;
//       if (maxRatingValue !== null) query.ratings.$lte = maxRatingValue;
//     }

//     // Category filter (array match)
//     if (category) {
//       query.category = { $in: [category] };
//     }

//     // Delivery city filter (array match)
//     if (deliveryCity) {
//       query.deliveryCity = { $in: [deliveryCity] };
//     }

//     let tiffins = await Tiffin.find(query).lean();

//     // Add minCost and filter based on price range
//     tiffins = tiffins
//       .map((tiffin) => {
//         const minCost = getMinMealPrice(tiffin.menu);
//         return { ...tiffin, minCost };
//       })
//       .filter((tiffin) => {
//         if (tiffin.minCost === null) return false;
//         if (lowerPrice !== null && upperPrice !== null) {
//           return tiffin.minCost >= lowerPrice && tiffin.minCost <= upperPrice;
//         }
//         return true;
//       });
//       console.log("SortBy:", sortBy);
// console.log("Order received:", order);
// console.log("minCosts before sort:", tiffins.map(t => t.minCost));


//     // Sorting logic
// // if (sortBy === "cost") {
// //   tiffins.sort((a, b) =>
// //     order === "asc" ? a.minCost - b.minCost : b.minCost - a.minCost
// //   );
// // }
// if (sortBy === "costLowToHigh") {
//   tiffins.sort((a, b) => a.minCost - b.minCost);
// } else if (sortBy === "costHighToLow") {
//   tiffins.sort((a, b) => b.minCost - a.minCost);
// }



//      else if (sortBy === "rating" || sortBy === "popularity") {
//       tiffins.sort((a, b) =>
//         order === "asc" ? a.ratings - b.ratings : b.ratings - a.ratings
//       );
//     }

//     res.status(200).json({ tiffins });
//   } catch (err) {
//     console.error("Filter error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });



// router.get("/tiffins/by-rating", async (req, res) => {
//   try {
//     const { maxRating } = req.query;

//     if (!maxRating) {
//       return res.status(400).json({ error: "maxRating query param is required" });
//     }

//     const rating = parseFloat(maxRating);
//     if (isNaN(rating)) {
//       return res.status(400).json({ error: "maxRating must be a valid number" });
//     }

//     const tiffins = await Tiffin.find({
//       ratings: { $gte: 0, $lte: rating },
//     }).lean();

//     res.status(200).json({ success: true, tiffins });
//   } catch (err) {
//     console.error("Error in /tiffins/by-rating:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// router.get("/tiffins/high-rated", async (req, res) => {
//   try {
//     const { minRating = 4.5 } = req.query;

//     const ratingThreshold = parseFloat(minRating);
//     if (isNaN(ratingThreshold)) {
//       return res.status(400).json({ error: "minRating must be a valid number" });
//     }

//     const tiffins = await Tiffin.find({
//       ratings: { $gte: ratingThreshold },
//     }).lean();

//     res.status(200).json({ success: true, tiffins });
//   } catch (error) {
//     console.error("Error fetching high-rated tiffins:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }); 
// module.exports = router;
function isOpenNow(operatingTimes) {
  const now = new Date();
  const day = now.toLocaleString("en-US", { weekday: "long", timeZone: "Asia/Kolkata" });

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = operatingTimes?.[day];
  if (!todaySchedule || !todaySchedule.open || !todaySchedule.close) return false;

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const openMinutes = parseTime(todaySchedule.open);
  const closeMinutes = parseTime(todaySchedule.close);

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}


router.get("/tiffins/open-now", async (req, res) => {
  try {
    let tiffins = await Tiffin.find({}).lean();
    const openNowTiffins = tiffins.filter(tiffin => isOpenNow(tiffin.operatingTimes));

    res.status(200).json(openNowTiffins);
  } catch (err) {
    console.error("Error in /tiffins/open-now:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


const getMinMealPrice = (menu) => {
  if (!menu?.mealTypes?.length) return null;

  let min = Infinity;

  for (const mealType of menu.mealTypes) {
    if (mealType.prices) {
      for (const price of Object.values(mealType.prices)) {
        const num = parseFloat(price);
        if (!isNaN(num) && num < min) {
          min = num;
        }
      }
    }
  }

  return min === Infinity ? null : parseFloat(min);
};


router.get("/tiffins/filter", async (req, res) => {
  try {
    const {
      sortBy = "rating",
      order = "desc",
      minRating,
      maxRating,
      price,
      category,
      deliveryCity,
      catering,
      houseParty,
      specialEvents
    } = req.query;

    const parseRating = (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? null : Math.min(Math.max(num, 0), 5);
    };

    const minRatingValue = parseRating(minRating);
    const maxRatingValue = parseRating(maxRating);
    const upperPrice = price ? parseFloat(price) : null;
    const lowerPrice = upperPrice !== null ? upperPrice - 20 : null;

    const query = {};

    // Rating range filter
    if (minRatingValue !== null || maxRatingValue !== null) {
      query.ratings = {};
      if (minRatingValue !== null) query.ratings.$gte = minRatingValue;
      if (maxRatingValue !== null) query.ratings.$lte = maxRatingValue;
    }

    // Category filter
    if (category) {
      query.category = { $in: [category] };
    }

   if (deliveryCity) {
      query.deliveryCity = {
        $elemMatch: {
          $regex: new RegExp(`\\b${deliveryCity}\\b`, 'i'),
        },
      };
    }

    // Catering / House Party / Special Events filters
    if (catering !== undefined) query.catering = catering === "true";
    if (houseParty !== undefined) query.houseParty = houseParty === "true";
    if (specialEvents !== undefined) query.specialEvents = specialEvents === "true";

    let tiffins = await Tiffin.find(query).lean();

    // Add minCost and filter based on price range
    tiffins = tiffins
      .map((tiffin) => {
        const minCost = getMinMealPrice(tiffin.menu); // Assume this function exists
        return { ...tiffin, minCost };
      })
      .filter((tiffin) => {
        if (tiffin.minCost === null) return false;
        if (lowerPrice !== null && upperPrice !== null) {
          return tiffin.minCost >= lowerPrice && tiffin.minCost <= upperPrice;
        }
        return true;
      });

    // Sorting
    if (sortBy === "costLowToHigh") {
      tiffins.sort((a, b) => a.minCost - b.minCost);
    } else if (sortBy === "costHighToLow") {
      tiffins.sort((a, b) => b.minCost - a.minCost);
    } else if (sortBy === "rating" || sortBy === "popularity") {
      tiffins.sort((a, b) =>
        order === "asc" ? a.ratings - b.ratings : b.ratings - a.ratings
      );
    }

    res.status(200).json({ tiffins });
  } catch (err) {
    console.error("Filter error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/tiffins/by-rating", async (req, res) => {
  try {
    const { maxRating } = req.query;

    if (!maxRating) {
      return res.status(400).json({ error: "maxRating query param is required" });
    }

    const rating = parseFloat(maxRating);
    if (isNaN(rating)) {
      return res.status(400).json({ error: "maxRating must be a valid number" });
    }

    const tiffins = await Tiffin.find({
      ratings: { $gte: 0, $lte: rating },
    }).lean();

    res.status(200).json({ success: true, tiffins });
  } catch (err) {
    console.error("Error in /tiffins/by-rating:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/tiffins/high-rated", async (req, res) => {
  try {
    const { minRating = 4.5 } = req.query;

    const ratingThreshold = parseFloat(minRating);
    if (isNaN(ratingThreshold)) {
      return res.status(400).json({ error: "minRating must be a valid number" });
    }

    const tiffins = await Tiffin.find({
      ratings: { $gte: ratingThreshold },
    }).lean();

    res.status(200).json({ success: true, tiffins });
  } catch (error) {
    console.error("Error fetching high-rated tiffins:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;