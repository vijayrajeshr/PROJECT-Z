
const express = require("express");
const mongoose = require("mongoose");
const { createNotification } = require("../../utils/Notification");
const Order = require("../../models/UserOrderTakeaway");
const Offer = require("../../models/RestaurantsDasModel/Offer");
const User = require("../../models/user");
const Firm = require("../../models/Firm");
const { authenticateToken } = require("../DashboardToken/JWT");
const Tiffin = require("../../models/Tiffin");
const twilio = require('twilio');
// const Menu = require("../../models/Menu");
const router = express.Router();
const Cart = require("../../models/TakeAwayOrder");
const Notify = require("../../models/logs/notify");
const historyLogRecorder = require("../../utils/historyLogRecorder");
const {
  sendUserOrderCancellationConfirmation,
  sendOrderConfirmation,
  sendUserTakeawayOrderApproved,
} = require("../../routes/CustomerNotification/DiningEmailNotify");

const populateOrderItems = (query) => {
  return query
    .populate({
      path: "items.productId",
      select: "img name description foodType mealType",
    })
    .populate({
      path: "items.sourceEntityId",
      select:
        "restaurantInfo.name restaurantInfo.address restaurantInfo.deliveryCity image_urls kitchenName",
    });
};



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);
router.post("/create", async (req, res) => {
  const socket = req.app.get("socketio");
  try {
    const {
      userId,
      items,
      deliveryFee,
      platformFee,
      gstCharges,
      offerId,
      orderTime,
      subtotal,
      discount,
      phone,
      specialInstructions,
      pickupAddress,
      deliveryTime,
      totalOtherCharges,
      totalPrice,
    } = req.body;
    console.log(req?.body);
    const userId1 = req.session?.user?.id || userId;

    const user = await User.findById(userId1);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must contain at least one item." });
    }
    const orderType = items[0].itemType;
    console.log(orderType);
    const parsedOrderTime = new Date(orderTime);
    if (isNaN(parsedOrderTime.getTime())) {
      return res.status(400).json({ error: "Invalid orderTime format." });
    }

    const firstItemSourceEntityId = items[0].sourceEntityId;
    const planType=items[0]?.selectedPlan?.name;
    console.log(items[0].sourceEntityId);
    const allSameSource = items.every(
      (item) =>
        item?.sourceEntityId?.toString() === firstItemSourceEntityId.toString()
    );
    const allPlan=items.every((item)=>item.selectedPlan?.name===planType);
    if (!allSameSource) {
      return res
        .status(400)
        .json({
          error:
            "All items in the order must belong to the same source entity (restaurant/tiffin service).",
        });
    }
    if(!allPlan){
      return res.status(400).json({message:"All items plans are must be same!"});
    }

    let primarySourceEntity = null;
    let primarySourceEntityName = null;
    if (items && items.length > 0) {
      primarySourceEntity = items[0].sourceEntityId;
      primarySourceEntityName = items[0].sourceEntityName;
    }

    const order = new Order({
      userId: userId1,
      items: items,
      subtotal,
      deliveryFee,
      platformFee,
      gstCharges,
      discount,
      offerId,
      orderTime: parsedOrderTime,
      phone,
      totalPrice,
      totalOtherCharges,
      address: pickupAddress,
      specialInstructions,
      deliverTime: deliveryTime,
    });

    const savedOrder = await order.save();
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      })
      .populate({
        path: "items.productId",
        select: "img name description foodType mealType",
      })
      .populate({
        path: "items.sourceEntityId",
        select:
          "restaurantInfo.name restaurantInfo.address restaurantInfo.deliveryCity image_urls kitchenName",
      });
    console.log(primarySourceEntity.toString());
    socket.to(primarySourceEntity.toString()).emit("OrderNotification", {
      message: "New Order is Received!",
    });
    socket.to(primarySourceEntity.toString()).emit("newOrder", {
      orderId: savedOrder?._id,
      order: populatedOrder,
      message: "New order received!",
    });
    console.log("Saved Order:", savedOrder, "Request Body:", req.body);
    socket.to("admin_alerts").emit("newNotification", {
      message: "New Order is received!",
    });
    socket.to(userId1.toString()).emit("userNotification", {
      message: "your Order is placed!",
    });
    socket.to("admin_alerts").emit("newOrder", {
      orderType: orderType,
      orderId: savedOrder?._id,
      order: populatedOrder,
      message: "New order received!",
    });
    await Cart.deleteMany({ userId: userId1 });

    const username = user?.username;
    const userEmail = user?.email;
    const total = subtotal + deliveryFee + platformFee + gstCharges - discount;

    let restaurantOrTiffinName = "Unknown";
    let Number="";
    if (primarySourceEntity && primarySourceEntityName) {
      let entityModel;
      if (primarySourceEntityName === "Firm") {
        entityModel = Firm;
      } else if (primarySourceEntityName === "Tiffin") {
        entityModel = Tiffin;
      }
      if (entityModel) {
        const entity = await entityModel.findById(primarySourceEntity);
        if (entity) {
          restaurantOrTiffinName =
            entity.restaurantInfo?.name || entity.kitchenName || "Service";
          number=entity?.ownerPhoneNo?.fullNumber;
        }
      }
    }

    sendOrderConfirmation(
      userEmail,
      username,
      order?._id,
      restaurantOrTiffinName,
      total
    );

    historyLogRecorder(
      req,
      Order.modelName,
      "CREATE",
      savedOrder._id,
      `Order placed by user ${user.username} for ${
        primarySourceEntityName || "an entity"
      } ${restaurantOrTiffinName}.`
    );

    const newNotify = new Notify({
      timestamp: new Date(),
      level: "New  order",
      type: ["admin",primarySourceEntityName==="Firm"?"restaurant":'tiffin'],
      message: `A new  order has been placed by ${user.username} for ${restaurantOrTiffinName}. Please check it.`,
      metadata: {
        category: [primarySourceEntityName==="Firm"?"Restaurant":'Tiffin', "Customer"],
        isViewed: false,
        isAccept: false,
        isReject: false,
        orderId: savedOrder._id.toString(),
        sourceEntityId: primarySourceEntity?.toString(),
        sourceEntityName: primarySourceEntityName,
      },
    });
    await newNotify.save();
  //  const smsResponse = await client.messages.create({
  //         body:"Your are recived a new Order",
  //         from: twilioPhoneNumber,
  //         to: number,
  //   });

   const savedNotification = await createNotification(
      userId1,
      primarySourceEntityName==="Firm"? "Takeaway Order":"Tiffin Order",
      "Your Order is placed SuccessFully!",
    "confirmed",
      { orderId: savedOrder._id }
    );
    return res.status(201).json({
      success: true,
      data: {
        message: "Order created successfully",
        order: savedOrder,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: "An error occurred while creating the order" });
  }
});


//takeaway
router.get("/admin/takeaway-orders", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const filter = {
        "items.itemType": "firm",
      };
  
      const totalOrders = await Order.countDocuments(filter);
      const orders = await populateOrderItems(Order.find(filter))
        .populate({
          path: "userId",
          model: "User",
          select: "username email",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      const processedOrders = orders.map(order => {
        const newOrder = order.toObject();
        newOrder.items = newOrder.items.map(item => {
          if (item.sourceEntityName === "Firm" && item.sourceEntityId && item.sourceEntityId.image_urls) {
            item.sourceEntityId.image_url =
              item.sourceEntityId.image_urls.length > 0 ? item.sourceEntityId.image_urls[0] : null;
            delete item.sourceEntityId.image_urls;
          }
          return item;
        });
        return newOrder;
      });
  
      return res.status(200).json({
        orders: processedOrders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching admin takeaway orders:", error);
      return res.status(500).json({ error: "An error occurred while fetching takeaway orders" });
    }
  });
  
router.get("/offers/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const offers = await Offer.find({ applicableToUsers: userId });
    return res.status(200).json({ offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching offers" });
  }
});

// router.put("/res/order/:orderId", async (req, res) => {
//   const socket = req.app.get("socketio");
//   const { orderId } = req.params;
//   const { status } = req.body;
//   if (!status) {
//     return res.status(400).json({ error: "Status is required" });
//   }

//   try {
//     const updatedOrder = await Order.findOneAndUpdate(
//       { _id: orderId },
//       { $set: { status } },
//       { new: true }
//     );
//     if (!updatedOrder) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     historyLogRecorder(
//       req,
//       Order.modelName,
//       "UPDATE",
//       orderId,
//       `Order status updated by Admin/Restaurant to: ${status}.`
//     );

//     const newNotify = new Notify({
//       timestamp: new Date(),
//       level: "Order Status Update",
//       type: ["admin", "restaurant"],
//       message: `Order #${orderId} status has been updated to: ${status}.`,
//       metadata: {
//         category: ["Restaurant"],
//         orderId: orderId,
//         isViewed: false,
//         isAccept: status === "accept",
//         isReject: status === "rejected",
//       },
//     });

//     const userForEmail = await User.findById(updatedOrder.userId);
//     console.log(userForEmail);
//     socket.to(userForEmail._id.toString()).emit("userNotification", {
//       message: "order States is updated check it please",
//       orderId: orderId,
//       order: updatedOrder,
//     });
//     const savedNotification = await createNotification(
//       userForEmail._id,
//       "Takeaway Order",
//       "Your Order is status Updated !",
//       status,
//       { orderId: updatedOrder?._id }
//     );
//     const userEmail = userForEmail?.email;
//     const username = userForEmail?.username;

//     let restaurantOrTiffinName = "Unknown";
//     if (updatedOrder.items && updatedOrder.items.length > 0) {
//       const primarySourceEntityId = updatedOrder.items[0].sourceEntityId;
//       const primarySourceEntityName = updatedOrder.items[0].sourceEntityName;

//       let entityModel;
//       if (primarySourceEntityName === "Firm") {
//         entityModel = Firm;
//       } else if (primarySourceEntityName === "Tiffin") {
//         entityModel = Tiffin;
//       }
//       if (entityModel) {
//         const entity = await entityModel.findById(primarySourceEntityId);
//         if (entity) {
//           restaurantOrTiffinName =
//             entity.restaurantInfo?.name || entity.kitchenName || "Service";
//         }
//       }
//     }

//     if (status === "rejected") {
//       sendUserOrderCancellationConfirmation(userEmail, username, orderId);
//     } else if (status === "accept") {
//       sendUserTakeawayOrderApproved(
//         userEmail,
//         username,
//         orderId,
//         restaurantOrTiffinName
//       );
//     }
//     await newNotify.save();
//     return res
//       .status(200)
//       .json({ message: "Order status updated", order: updatedOrder });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     return res
//       .status(500)
//       .json({ error: "An error occurred while updating the order", error });
//   }
// });

//change here pratik
// router.put("/order/:orderId", async (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({ error: "Status is required" });
//   }

//   try {
//     const updatedOrder = await Order.findOneAndUpdate(
//       { _id: orderId },
//       { $set: { status } },
//       { returnDocument: "after", new: true }
//     );
//     if (!updatedOrder) {
//       return res.status(404).json({ error: "Order not found" });
//     }
//     historyLogRecorder(
//       req,
//       Order.modelName, // Log for Cart entity
//       "UPDATE", // Action
//       orderId, // Updated Cart ID
//       `Order updated By the Admin: Action is ${status}.`
//     );
//     const newNotify = new Notify({
//       timestamp: new Date(),
//       level: "New TakeAway order",
//       type: ["admin", "restaurant"],
//       message: "A notification from order status is updated check it once ",
//       metadata: {
//         category: ["Restaurant"],
//         isViewed: false,
//         isAccept: false,
//         isReject: false,
//       },
//     });
//     await newNotify.save();
//     return res
//       .status(200)
//       .json({ message: "Order status updated", order: updatedOrder });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     return res
//       .status(500)
//       .json({ error: "An error occurred while updating the order" });
//   }
// });

// router.put("/res/order/:orderId", async (req, res) => {
//   const socket = req.app.get("socketio");
//   const { orderId } = req.params;
//   const { status } = req.body; // Destructure subStatus from req.body

//   if (!status) {
//     return res.status(400).json({ error: "Status is required" });
//   }

//   try {
//     const updateFields = { status };
//     if (status) {
//       updateFields.$push = {
//        date: new Date(), statue: status ,
//       };
//     }

//     const updatedOrder = await Order.findOneAndUpdate(
//       { _id: orderId },
//       updateFields, // Use the updateFields object
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     historyLogRecorder(
//       req,
//       Order.modelName,
//       "UPDATE",
//       orderId,
//       `Order status updated by Admin/Restaurant to: ${status}${
//         status ? ` (Sub-status: ${status})` : ""
//       }.`
//     );

//     const newNotify = new Notify({
//       timestamp: new Date(),
//       level: "Order Status Update",
//       type: ["admin", "restaurant"],
//       message: `Order #${orderId} status has been updated to: ${status}.`,
//       metadata: {
//         category: ["Restaurant"],
//         orderId: orderId,
//         isViewed: false,
//         isAccept: status === "accept",
//         isReject: status === "rejected",
//       },
//     });

//     const userForEmail = await User.findById(updatedOrder.userId);
//     console.log(userForEmail);
//     socket.to(userForEmail._id.toString()).emit("userNotification", {
//       message: "order States is updated check it please",
//       orderId: orderId,
//       order: updatedOrder,
//     });
//     // const savedNotification = await createNotification(
//     //   userForEmail._id,
//     //   "Takeaway Order",
//     //   "Your Order is status Updated !",
//     //   status,
//     //   { orderId: updatedOrder?._id }
//     // );
//     const userEmail = userForEmail?.email;
//     const username = userForEmail?.username;

//     let restaurantOrTiffinName = "Unknown";
//     if (updatedOrder.items && updatedOrder.items.length > 0) {
//       const primarySourceEntityId = updatedOrder.items[0].sourceEntityId;
//       const primarySourceEntityName = updatedOrder.items[0].sourceEntityName;

//       let entityModel;
//       if (primarySourceEntityName === "Firm") {
//         entityModel = Firm;
//       } else if (primarySourceEntityName === "Tiffin") {
//         entityModel = Tiffin;
//       }
//       if (entityModel) {
//         const entity = await entityModel.findById(primarySourceEntityId);
//         if (entity) {
//           restaurantOrTiffinName =
//             entity.restaurantInfo?.name || entity.kitchenName || "Service";
//         }
//       }
//     }

//     if (status === "rejected") {
//       sendUserOrderCancellationConfirmation(userEmail, username, orderId);
//     } else if (status === "accept") {
//       sendUserTakeawayOrderApproved(
//         userEmail,
//         username,
//         orderId,
//         restaurantOrTiffinName
//       );
//     }
//     await newNotify.save();
//     return res
//       .status(200)
//       .json({ message: "Order status updated", order: updatedOrder });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     return res
//       .status(500)
//       .json({ error: "An error occurred while updating the order", error });
//   }
// });

// router.put("/res/order/:orderId", async (req, res) => {
//   const socket = req.app.get("socketio");
//   const { orderId } = req.params;
//   const { status } = req.body;
//   console.log(status);
//   if (!status) {
//     return res.status(400).json({ error: "Status is required" });
//   }

//   try {
//     const updateFields = { status };

//     const newSubStatusEntry = {
//       date: new Date(),
//       statue: status,
//     };
//     console.log(newSubStatusEntry);
//     updateFields.$push = updateFields.$push || {};

//     updateFields.$push.subStatus = newSubStatusEntry;

//     const updatedOrder = await Order.findOneAndUpdate(
//       { _id: orderId },
//       updateFields,
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     historyLogRecorder(
//       req,
//       Order.modelName,
//       "UPDATE",
//       orderId,
//       `Order status updated by Admin/Restaurant to: ${status}.`
//     );

//     const newNotify = new Notify({
//       timestamp: new Date(),
//       level: "Order Status Update",
//       type: ["admin", "restaurant"],
//       message: `Order #${orderId} status has been updated to: ${status}.`,
//       metadata: {
//         category: ["Restaurant"],
//         orderId: orderId,
//         isViewed: false,
//         isAccept: status === "accept",
//         isReject: status === "rejected",
//       },
//     });

//     const userForEmail = await User.findById(updatedOrder.userId);
//     console.log(userForEmail);
//     socket.to(userForEmail._id.toString()).emit("userNotification", {
//       message: "order States is updated check it please",
//       orderId: orderId,
//       order: updatedOrder,
//     });
//     const savedNotification = await createNotification(
//       userForEmail._id,
//       "Takeaway Order",
//       "Your Order is status Updated !",
//       status,
//       { orderId: updatedOrder?._id }
//     );
//     const userEmail = userForEmail?.email;
//     const username = userForEmail?.username;

//     let restaurantOrTiffinName = "Unknown";
//     if (updatedOrder.items && updatedOrder.items.length > 0) {
//       const primarySourceEntityId = updatedOrder.items[0].sourceEntityId;
//       const primarySourceEntityName = updatedOrder.items[0].sourceEntityName;

//       let entityModel;
//       if (primarySourceEntityName === "Firm") {
//         entityModel = Firm;
//       } else if (primarySourceEntityName === "Tiffin") {
//         entityModel = Tiffin;
//       }
//       if (entityModel) {
//         const entity = await entityModel.findById(primarySourceEntityId);
//         if (entity) {
//           restaurantOrTiffinName =
//             entity.restaurantInfo?.name || entity.kitchenName || "Service";
//         }
//       }
//     }

//     if (status === "rejected") {
//       sendUserOrderCancellationConfirmation(userEmail, username, orderId);
//     } else if (status === "accept") {
//       sendUserTakeawayOrderApproved(
//         userEmail,
//         username,
//         orderId,
//         restaurantOrTiffinName
//       );
//     }
//     await newNotify.save();
//     return res
//       .status(200)
//       .json({ message: "Order status updated", order: updatedOrder });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     return res
//       .status(500)
//       .json({ error: "An error occurred while updating the order", error });
//   }
// });

router.put("/orders/cancel/:id", async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  console.log(id);
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: "user_canceled",
        cancellationReason: reason,
        cancelledAt: new Date(),
        $push: {
          subStatus: {
            statue: "user_canceled",
            date: new Date(),
            reason: reason
          }
        }
      },
      { new: true }
    );

    if (!order) {
      historyLogRecorder(req, "Order", "UPDATE", [], `Attempted to cancel non-existent order ID: ${id}`);
      return res.status(404).json({ message: "Order not found." });
    }

    historyLogRecorder(req, "Order", "UPDATE", [order._id], `Order ${id} cancelled by user. Reason: ${reason}`);

    res.status(200).json({ message: "Order cancelled successfully.", order });
  } catch (error) {
    historyLogRecorder(req, "Order", "UPDATE", [], `Error cancelling order ${id}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

router.put("/res/order/:orderId", async (req, res) => {
  const socket = req.app.get("socketio");
  const { orderId } = req.params;
  const { status } = req.body;
  console.log(status);
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const updateFields = { status };

    const newSubStatusEntry = {
      date: new Date(),
      statue: status,
    };
    console.log(newSubStatusEntry);
    updateFields.$push = updateFields.$push || {};

    updateFields.$push.subStatus = newSubStatusEntry;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      updateFields,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    historyLogRecorder(
      req,
      Order.modelName,
      "UPDATE",
      orderId,
      `Order status updated by Admin/Restaurant to: ${status}.`
    );

    const newNotify = new Notify({
      timestamp: new Date(),
      level: "Order Status Update",
      type: ["admin", "restaurant"],
      message: `Order #${orderId} status has been updated to: ${status}.`,
      metadata: {
        category: ["Restaurant"],
        orderId: orderId,
        isViewed: false,
        isAccept: status === "accept",
        isReject: status === "rejected",
      },
    });

    const userForEmail = await User.findById(updatedOrder.userId);
    console.log(userForEmail);

    if (userForEmail && userForEmail._id) {
      socket.to(userForEmail._id.toString()).emit("userNotification", {
        message: "Order status is updated, please check it.",
        orderId: orderId,
        order: updatedOrder,
      });
    }

    const userEmail = userForEmail?.email;
    const username = userForEmail?.username;

    let restaurantOrTiffinName = "Unknown";
    if (updatedOrder.items && updatedOrder.items.length > 0) {
      const primarySourceEntityId = updatedOrder.items[0].sourceEntityId;
      const primarySourceEntityName = updatedOrder.items[0].sourceEntityName;

      let entityModel;
      if (primarySourceEntityName === "Firm") {
        entityModel = Firm;
      } else if (primarySourceEntityName === "Tiffin") {
        entityModel = Tiffin;
      }
      if (entityModel) {
        const entity = await entityModel.findById(primarySourceEntityId);
        if (entity) {
          restaurantOrTiffinName =
            entity.restaurantInfo?.name || entity.kitchenName || "Service";
        }
      }
    }

    if (status === "rejected") {
      sendUserOrderCancellationConfirmation(userEmail, username, orderId);
    } else if (status === "accept") {
      sendUserTakeawayOrderApproved(
        userEmail,
        username,
        orderId,
        restaurantOrTiffinName
      );
    }
    await newNotify.save();
     const savedNotification = await createNotification(
      userForEmail._id,
      "Takeaway Order",
      "Your Order is status Updated !",
      status,
      { orderId: updatedOrder?._id }
    );
    return res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the order", error });
  }
});

router.put("/order/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const socket = req.app.get("socketio");
  const { status, rejectionReason, date, statue } = req.body; // 'statue' for subStatus
  console.log(req.body);
  try {
    let updatedOrder;

    if (status) {
      // This block handles main order status updates (e.g., accept, reject, ready)
      const updateFields = { status: status };
      if (status === "rejected" && rejectionReason) {
        updateFields.rejectionReason = rejectionReason;
      }
      updatedOrder = await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: updateFields },
        { new: true }
      ).populate("userId", "username email phone address"); // Populate user details

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      historyLogRecorder(
        req,
        Order.modelName,
        "UPDATE",
        orderId,
        `Order status updated by Admin/Restaurant to: ${status}.`
      );

      // Notification logic (as per your original code)
      const newNotify = new Notify({
        timestamp: new Date(),
        level: "Order Status Update",
        type: ["admin", "tiffin"],
        message: `Order #${orderId} status has been updated to: ${status}.`,
        metadata: {
          category: ["Tiffin"],
          orderId: orderId,
          isViewed: false,
          isAccept: status === "accept",
          isReject: status === "rejected",
        },
      });
      await newNotify.save();

      // Email sending logic (as per your original code)
      const userForEmail = await User.findById(updatedOrder.userId);
      const userEmail = userForEmail?.email;
      const username = userForEmail?.username;

      let restaurantOrTiffinName = "Unknown";
      if (updatedOrder.items && updatedOrder.items.length > 0) {
        const primarySourceEntityId = updatedOrder.items[0].sourceEntityId;
        const primarySourceEntityName = updatedOrder.items[0].sourceEntityName;

        let entityModel;
        if (primarySourceEntityName === "Firm") {
          entityModel = Firm;
        } else if (primarySourceEntityName === "Tiffin") {
          entityModel = Tiffin;
        }
        if (entityModel) {
          const entity = await entityModel.findById(primarySourceEntityId);
          if (entity) {
            restaurantOrTiffinName =
              entity.restaurantInfo?.name || entity.kitchenName || "Service";
          }
        }
      }

      if (status === "rejected") {
        sendUserOrderCancellationConfirmation(userEmail, username, orderId);
      } else if (status === "accept") {
        sendUserTakeawayOrderApproved(
          userEmail,
          username,
          orderId,
          restaurantOrTiffinName
        );
      }
    } else if (date && statue) {
      // This block handles subStatus updates (daily delivery status)
      // Find the order
      updatedOrder = await Order.findById(orderId).populate(
        "userId",
        "username email phone address"
      );
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Ensure subStatus array exists
      if (!updatedOrder.subStatus) {
        updatedOrder.subStatus = [];
      }

      const incomingDate = new Date(date);
      // Check if an entry for this date already exists
      const existingSubStatusIndex = updatedOrder.subStatus.findIndex(
        (sub) =>
          new Date(sub.date).toDateString() === incomingDate.toDateString()
      );

      if (existingSubStatusIndex !== -1) {
        // Update existing subStatus entry
        updatedOrder.subStatus[existingSubStatusIndex].statue = statue;
      } else {
        // Add new subStatus entry if not found
        updatedOrder.subStatus.push({ date: incomingDate, statue: statue });
      }

      await updatedOrder.save();
      socket.to(updatedOrder.userId.toString()).emit("userNotification", {
        message: "order States is updated check it please",
        orderId: orderId,
        order: updatedOrder,
      });
      // Save the updated order
      // No historyLogRecorder or Notify for daily subStatus updates, based on original code structure
      // You might want to add separate logging or notifications for daily updates if needed.
    } else {
      return res
        .status(400)
        .json({
          error:
            "Invalid request: Either 'status' or 'date' and 'statue' are required.",
        });
    }
    const savedNotification = await createNotification(updatedOrder.userId,"Tiffin Order", "Your Order is status Updated !",status,{orderId:updatedOrder?._id})
    return res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    return res
      .status(500)
      .json({
        error: "An error occurred while updating the order",
        details: error.message,
      });
  }
});

//change here pratik
router.get("/all-orders", async (req, res) => {
  try {
    // Fetch all orders and populate references

    const orders = await Order.find({
      history: false,
    })
      .populate({
        path: "items.productId",
        select: "name price category description", // Specify fields to include from Product
      })
      .populate({
        path: "items.restaurantName",
        model: "Firm",
        select:
          "restaurantInfo.name restaurantInfo.country restaurantInfo.address", // Specify fields to include from Restaurant
      })
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching orders" });
  }
});

router.get("/all-orders/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Convert to ObjectId
    const firmId = new mongoose.Types.ObjectId(id);

    const orders = await Order.find({
      history: false,
      "items.sourceEntityId": firmId,
    })
    .populate({
      path: "items.productId",
      select: "img name description foodType mealType",
    })
    .populate({
      path: "items.sourceEntityId",
      select:
        "restaurantInfo.name restaurantInfo.address restaurantInfo.deliveryCity  kitchenName",
    })
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching orders" });
  }
});

router.get("/all-orders", async (req, res) => {
  try {
    const orders = await populateOrderItems(
      Order.find({ history: false })
    ).populate({
      path: "userId",
      model: "User",
      select: "username email",
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No active orders found" });
    }

    const processedOrders = orders.map((order) => {
      const newOrder = order.toObject();
      newOrder.items = newOrder.items.map((item) => {
        if (
          item.sourceEntityName === "Firm" &&
          item.sourceEntityId &&
          item.sourceEntityId.image_urls
        ) {
          item.sourceEntityId.image_url =
            item.sourceEntityId.image_urls.length > 0
              ? item.sourceEntityId.image_urls[0]
              : null;
          delete item.sourceEntityId.image_urls;
        }
        return item;
      });
      return newOrder;
    });

    return res.status(200).json({ orders: processedOrders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching orders" });
  }
});

//check here pratik
// router.get("/takeaway/user", async (req, res) => {
//   try {
//     const userId = req.session?.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     // Get pagination parameters from the query string
//     const page = parseInt(req.query.page) || 1; // Default to page 1
//     const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
//     const skip = (page - 1) * limit;

//     // Fetch takeaway orders with pagination
//     const takeawayOrders = await Order.find({ userId: userId })
//       .skip(skip)
//       .limit(limit)
//       .populate({
//         path: "items.productId",
//         select: "name price category description",
//       })
//       .populate({
//         path: "items.restaurantName",
//         model: "Firm",
//         select:
//           "restaurantInfo.name restaurantInfo.country restaurantInfo.address image_urls",
//       })
//       .populate({
//         path: "userId",
//         model: "User",
//         select: "username email",
//       });

//     if (!takeawayOrders || takeawayOrders.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No takeaway orders found for this user" });
//     }

//     // Count total documents for the user
//     const totalOrders = await Order.countDocuments({ userId: userId });

//     return res.status(200).json({
//       takeawayOrders,
//       totalOrders,
//       totalPages: Math.ceil(totalOrders / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     console.error("Error fetching user's takeaway orders:", error);
//     return res.status(500).json({
//       error: "An error occurred while fetching user's takeaway orders",
//     });
//   }
// });

router.get("/takeaway/user", async (req, res) => {
  try {
    const userId = req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = Order.find({ history: false, userId: userId });
    const totalOrders = await Order.countDocuments({
      history: false,
      userId: userId,
    });

    const takeawayOrders = await populateOrderItems(query)
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!takeawayOrders || takeawayOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No takeaway orders found for this user" });
    }

    const processedOrders = takeawayOrders.map((order) => {
      const newOrder = order.toObject();
      newOrder.items = newOrder.items.map((item) => {
        if (
          item.sourceEntityName === "Firm" &&
          item.sourceEntityId &&
          item.sourceEntityId.image_urls
        ) {
          item.sourceEntityId.image_url =
            item.sourceEntityId.image_urls.length > 0
              ? item.sourceEntityId.image_urls[0]
              : null;
          delete item.sourceEntityId.image_urls;
        }
        return item;
      });
      return newOrder;
    });

    return res.status(200).json({
      takeawayOrders: processedOrders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching user's takeaway orders:", error);
    return res.status(500).json({
      error: "An error occurred while fetching user's takeaway orders",
    });
  }
});

router.get("/orders/menu", async (req, res) => {
  try {
    const queryFilter = {
      history: false,
      "items.sourceEntityName": "Firm",
      "items.itemType": "firm",
    };

    const totalOrders = await Order.countDocuments(queryFilter);
    let orders = await populateOrderItems(Order.find(queryFilter))
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No active restaurant menu orders found" });
    }

    const processedOrders = orders.map((order) => {
      const newOrder = order.toObject();
      newOrder.items = newOrder.items.map((item) => {
        if (
          item.sourceEntityName === "Firm" &&
          item.sourceEntityId &&
          item.sourceEntityId.image_urls
        ) {
          item.sourceEntityId.image_url =
            item.sourceEntityId.image_urls.length > 0
              ? item.sourceEntityId.image_urls[0]
              : null;
          delete item.sourceEntityId.image_urls;
        }
        return item;
      });
      return newOrder;
    });

    return res.status(200).json({
      orders: processedOrders,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching restaurant menu orders:", error);
    return res
      .status(500)
      .json({
        error: "An error occurred while fetching restaurant menu orders",
      });
  }
});
router.get("/orders/menu/user", async (req, res) => {
  try {
    const user = req?.session?.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryFilter = {
      history: false,
      userId: user,
      "items.sourceEntityName": "Firm",
      "items.itemType": "firm",
    };

    const totalOrders = await Order.countDocuments(queryFilter);
    let orders = await populateOrderItems(Order.find(queryFilter))
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No active restaurant menu orders found" });
    }

    const processedOrders = orders.map((order) => {
      const newOrder = order.toObject();
      newOrder.items = newOrder.items.map((item) => {
        if (
          item.sourceEntityName === "Firm" &&
          item.sourceEntityId &&
          item.sourceEntityId.image_urls
        ) {
          item.sourceEntityId.image_url =
            item.sourceEntityId.image_urls.length > 0
              ? item.sourceEntityId.image_urls[0]
              : null;
          delete item.sourceEntityId.image_urls;
        }
        return item;
      });
      return newOrder;
    });

    return res.status(200).json({
      orders: processedOrders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching restaurant menu orders:", error);
    return res
      .status(500)
      .json({
        error: "An error occurred while fetching restaurant menu orders",
      });
  }
});

router.get("/orders/tiffin", async (req, res) => {
  try {
    const queryFilter = {
      history: false,
      "items.sourceEntityName": "Tiffin",
      "items.itemType": "tiffin",
    };

    const totalOrders = await Order.countDocuments(queryFilter);
    const orders = await populateOrderItems(Order.find(queryFilter))
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No active tiffin orders found." });
    }

    const processedOrders = orders.map((order) => {
      const newOrder = order.toObject();
      newOrder.items = newOrder.items.map((item) => {
        if (
          item.itemType === "tiffin" &&
          item.productId &&
          item.productId.mealType
        ) {
          item.mealType = item.productId.mealType;
        }
        if (
          item.sourceEntityName === "Tiffin" &&
          item.sourceEntityId &&
          item.sourceEntityId.image_urls
        ) {
          item.sourceEntityId.image_url =
            item.sourceEntityId.image_urls.length > 0
              ? item.sourceEntityId.image_urls[0]
              : null;
          delete item.sourceEntityId.image_urls;
        }
        return item;
      });
      return newOrder;
    });

    return res.status(200).json({
      orders: processedOrders,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching tiffin orders:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching tiffin orders" });
  }
});
router.get("/orders/tiffin/email", authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const tiffin = await Tiffin.findOne({ ownerMail: email });
    const tiffinId = tiffin._id;
    const queryFilter = {
      history: false,
      "items.sourceEntityId": tiffinId,
      "items.sourceEntityName": "Tiffin",
      "items.itemType": "tiffin",
    };

    const totalOrders = await Order.countDocuments(queryFilter);
    const orders = await populateOrderItems(Order.find(queryFilter))
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No active tiffin orders found." });
    }

    const processedOrders = orders.map((order) => {
      const newOrder = order.toObject();
      newOrder.items = newOrder.items.map((item) => {
        if (
          item.itemType === "tiffin" &&
          item.productId &&
          item.productId.mealType
        ) {
          item.mealType = item.productId.mealType;
        }
        if (
          item.sourceEntityName === "Tiffin" &&
          item.sourceEntityId &&
          item.sourceEntityId.image_urls
        ) {
          item.sourceEntityId.image_url =
            item.sourceEntityId.image_urls.length > 0
              ? item.sourceEntityId.image_urls[0]
              : null;
          delete item.sourceEntityId.image_urls;
        }
        return item;
      });
      return newOrder;
    });

    return res.status(200).json({
      orders: processedOrders,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching tiffin orders:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching tiffin orders" });
  }
});
router.get("/orders/tiffin/user", async (req, res) => {
  try {
    const user = req?.session?.user?.id;
    console.log(user, req?.session?.user);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryFilter = {
      history: false,
      userId: user,
      "items.sourceEntityName": "Tiffin",
      "items.itemType": "tiffin",
    };

    const totalOrders = await Order.countDocuments(queryFilter);
    const orders = await populateOrderItems(Order.find(queryFilter))
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No active tiffin orders found." });
    }

    const processedOrders = orders.map((order) => {
      const newOrder = order.toObject();
      newOrder.items = newOrder.items.map((item) => {
        if (
          item.itemType === "tiffin" &&
          item.productId &&
          item.productId.mealType
        ) {
          item.mealType = item.productId.mealType;
        }
        if (
          item.sourceEntityName === "Tiffin" &&
          item.sourceEntityId &&
          item.sourceEntityId.image_urls
        ) {
          item.sourceEntityId.image_url =
            item.sourceEntityId.image_urls.length > 0
              ? item.sourceEntityId.image_urls[0]
              : null;
          delete item.sourceEntityId.image_urls;
        }
        return item;
      });
      return newOrder;
    });

    return res.status(200).json({
      orders: processedOrders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching tiffin orders:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching tiffin orders" });
  }
});

router.put("/orderFav/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    console.log(order);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.fav = !order.fav;

    const updatedOrder = await order.save();

    return res.status(200).json({
      message: `Order favorite status toggled to ${updatedOrder.fav}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error toggling order favorite status:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid Order ID format" });
    }
    return res
      .status(500)
      .json({
        error: "An error occurred while toggling the order favorite status",
      });
  }
});

router.get("/orders/user/favorites", async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const favoriteOrders = await Order.find({ userId: userId, fav: true });
    if (favoriteOrders.length === 0) {
      return res
        .status(200)
        .json({
          message: "No favorite orders found for this user.",
          orders: [],
        });
    }
    return res.status(200).json({
      message: `Successfully fetched favorite orders for user ID: ${userId}`,
      orders: favoriteOrders,
    });
  } catch (error) {
    console.error(`Error fetching favorite orders for user ${userId}:`, error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid User ID format or data" });
    }
    return res
      .status(500)
      .json({ error: "An error occurred while fetching favorite orders" });
  }
});

router.get("/orderFav", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const type=req.query?.type;
  console.log(type);
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const queryFilter = {
      userId: userId,
      fav: true,
      "items.productModelType":type,
    };
    const totalFavoriteOrders = await Order.countDocuments(queryFilter);
    const favoriteOrders = await populateOrderItems(Order.find(queryFilter))
      .populate({
        path: "userId",
        model: "User",
        select: "username email",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalFavoriteOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    return res.status(200).json({
      message: `Successfully fetched favorite orders for user ID: ${userId}`,
      currentPage: page,
      limit: limit,
      totalOrders: totalFavoriteOrders,
      totalPages: totalPages,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
      orders: favoriteOrders,
    });
  } catch (error) {
    console.error(
      `Error fetching paginated favorite orders for user ${userId}:`,
      error
    );
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid User ID format or data" });
    }
    return res
      .status(500)
      .json({ error: "An error occurred while fetching favorite orders" });
  }
});

router.delete("/delete-all-orders", async (req, res) => {
  try {
    const result = await Order.deleteMany({});

    historyLogRecorder(
      req,
      Order.modelName,
      "DELETE_ALL",
      null,
      `All orders deleted by user ${
        req.session?.user?.username || "Unknown User"
      }. Count: ${result.deletedCount}`
    );

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} orders from the collection.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all orders:", error);
    return res
      .status(500)
      .json({
        error: "An error occurred while deleting all orders",
        details: error.message,
      });
  }
});

module.exports = router;
