const express = require("express");
const History = require("../../models/RestaurantsDasModel/History");
const OrderTakeAway = require("../../models/UserOrderTakeaway");
const Booking = require("../../models/RestaurantsDasModel/Booking");
const mongoose = require("mongoose");
const router = express.Router();
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
const Firm = require("../../models/Firm");
router.get("/history", async (req, res) => {
  try {
    const history = await History.find();
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching order history.",
    });
  }
});

router.get("/history/:id", async (req, res) => {
  try {
    const firmId = req.params.id;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(firmId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid firm ID" });
    }

    const firmObjectId = new mongoose.Types.ObjectId(firmId);

    // Fetch history
    const history = await History.find({
      "items.restaurantName": firmObjectId,
    });

    if (!history.length) {
      return res.status(404).json({
        success: false,
        message: "No order history found for this firm.",
      });
    }

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order history.",
      error: error.message,
    });
  }
});

router.get("/history/dining-booking/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { cursor, limit } = req.query;

    const query = { firm: id };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const baseQuery = Booking.find(query)
      .populate({
        path: "offerId",
        model: "RestaurantOffers",
        select: "name code offerType discountValue",
      })
      .populate({
        path: "firm",
        model: "Firm",
        select: "restaurantInfo.name",
      })
      .sort({ createdAt: -1 });

    // Apply limit if provided
    const bookings = limit
      ? await baseQuery.limit(parseInt(limit))
      : await baseQuery;

    if (!bookings.length) {
      return res.status(404).json({
        success: false,
        message: "No dining bookings found for this firm.",
      });
    }

    const allBookings = await Booking.find({ firm: id });

    const stats = {
      totalReservations: allBookings.length,
      pendingReservations: allBookings.filter((b) => b.status === "pending")
        .length,
      totalGuests: allBookings.reduce((sum, b) => sum + (b.guests || 0), 0),
    };

    const nextCursor =
      bookings.length > 0
        ? bookings[bookings.length - 1].createdAt.toISOString()
        : null;

    res.status(200).json({
      success: true,
      data: bookings,
      nextCursor,
      stats,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/history/ordertakeaway/:id", async (req, res) => {
  try {
    const firmId = req.params.id;
    const { cursor, limit } = req.query;

    if (!mongoose.Types.ObjectId.isValid(firmId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid firm ID",
      });
    }

    const firmObjectId = new mongoose.Types.ObjectId(firmId);

    const query = {
      "items.sourceEntityId": firmObjectId,
    };

    if (cursor) {
      const parsedCursor = new Date(cursor);
      if (!isNaN(parsedCursor)) {
        query.createdAt = { $lt: parsedCursor };
      }
    }

    const baseQuery = OrderTakeAway.find(query)
      .populate({ path: "userId", select: "username email" })
      .sort({ createdAt: -1 });

    const orders = limit
      ? await baseQuery.limit(parseInt(limit))
      : await baseQuery;

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No order history found for this firm.",
      });
    }

    const allTakeawayOrders = await OrderTakeAway.find({
      "items.sourceEntityId": firmObjectId,
    });

    const totalOrders = allTakeawayOrders.length;
    const pendingOrders = allTakeawayOrders.filter(
      (o) => o.status === "pending"
    ).length;

    const completedOrders = allTakeawayOrders.filter(
      (o) => o.status === "ready"
    );
    const totalRevenue = completedOrders.reduce((sum, order) => {
      const price = order.totalPrice || 0;
      const discount = order.discount || 0;
      return sum + (price - discount);
    }, 0);

    const avgRevenue =
      completedOrders.length > 0
        ? (totalRevenue / completedOrders.length).toFixed(2)
        : "0.00";

    const nextCursor =
      orders.length > 0
        ? orders[orders.length - 1].createdAt.toISOString()
        : null;

    return res.status(200).json({
      success: true,
      data: orders,
      nextCursor,
      stats: {
        totalOrders,
        pendingOrders,
        avgRevenue,
      },
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order history.",
      error: error.message,
    });
  }
});

router.get(
  "/history/multiple-firms/:email",
  authenticateToken,
  async (req, res) => {
    try {
      const email = req.params.email;
      // Case-insensitive match for email
      const firmDocs = await Firm.find(
        {
          ownerEmail: { $regex: new RegExp(`^${email}$`, "i") },
          restaurantStatus: "Approved",
        },
        { _id: 1 }
      );

      if (!firmDocs || firmDocs.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No firms found for the provided email",
        });
      }

      const firmIds = firmDocs.map((doc) => doc._id);
      const firmObjectIds = firmIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      // Fetch takeaway orders
      const takeaway = await OrderTakeAway.find({
        "items.sourceEntityId": { $in: firmObjectIds },
      }).populate({ path: "userId", select: "username email" });

      // Fetch dining bookings
      const dining = await Booking.find({
        firm: { $in: firmObjectIds },
      })
        .populate({
          path: "offerId",
          model: "RestaurantOffers",
          select: "name code offerType discountValue",
        })
        .populate({
          path: "firm",
          model: "Firm",
          select: "restaurantInfo.name",
        });

      if (takeaway.length === 0 && dining.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No order history found for the provided firms",
        });
      }

      return res.status(200).json({
        success: true,
        data: [...takeaway, ...dining],
      });
    } catch (error) {
      console.error("❌ Error fetching outlet data:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
);
// router.get(
//   "/history/multiple-firms/:email",
//   authenticateToken,
//   async (req, res) => {
//     try {
//       // Parse the comma-separated string into an array
//       const email = req.params.email;
//       const firmDocs = await Firm.find(
//         {
//           ownerEmail: email,
//           restaurantStatus: "Approved",
//         },
//         { _id: 1 }
//       );
//       console.log(firmDocs, "getting ............................... ");
//       const firmIds = firmDocs.map((doc) => doc._id);

//       // Convert each string into a Mongo ObjectId
//       const firmObjectIds = firmIds.map(
//         (id) => new mongoose.Types.ObjectId(id)
//       );

//       // Fetch outlets that match any of the given firmIds
//       const takeaway = await OrderTakeAway.find({
//         "items.sourceEntityId": { $in: firmObjectIds },
//       }).populate({ path: "userId", select: "username email" }); // ✅ corrected path

//       const dining = await Booking.find({
//         firm: { $in: firmObjectIds },
//       })
//         .populate({
//           path: "offerId",
//           model: "RestaurantOffers",
//           select: "name code offerType discountValue",
//         })
//         .populate({
//           path: "firm",
//           model: "Firm",
//           select: "restaurantInfo.name",
//         });

//       if (
//         !takeaway ||
//         !dining ||
//         dining.length === 0 ||
//         takeaway.length === 0
//       ) {
//         return res.status(404).json({
//           success: false,
//           message: "No outlets found for the provided firm IDs",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         data: [...takeaway, ...dining],
//       });
//     } catch (error) {
//       console.error("Error fetching outlet data:", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message || "Server error",
//       });
//     }
//   }
// );
// GET endpoint to fetch outlet data for multiple firm IDs
router.get(
  "/history/dining-takeaway-orders/:id",
  authenticateToken,
  async (req, res) => {
    try {
      // Parse the comma-separated string into an array
      const id = req.params.id;

      // Fetch outlets that match any of the given firmIds
      const takeaway = await OrderTakeAway.find({
        "items.sourceEntityId": { $in: id },
      }).populate({ path: "userId", select: "username email" }); // ✅ corrected path
      const dining = await Booking.find({
        history: false,
        firm: { $in: id },
      });

      if (
        !takeaway ||
        !dining ||
        dining.length === 0 ||
        takeaway.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message: "No outlets found for the provided firm IDs",
        });
      }

      return res.status(200).json({
        success: true,
        data: [...takeaway, ...dining],
      });
    } catch (error) {
      console.error("Error fetching outlet data:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
);

module.exports = router;
