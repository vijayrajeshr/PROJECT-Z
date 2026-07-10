const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const moment = require("moment");
const cron = require("node-cron");
const {sendTiffinBookingConfirmationEmail,sendAdminTiffinBookingCancellation}=require("../CustomerNotification/DiningEmailNotify")

const checkAndUpdateOrderStatus = async () => {
    console.log("\n=== Starting Order Status Check ===");
    try {
        const orders = await Order.find({ status: "Processing" });
        console.log(`Found ${orders.length} orders in Processing status`);

        // WARN: You had a hardcoded date here. Using dynamic 'today' is safer for production.
        // const today = moment("2025-02-22").startOf("day"); 
        const today = moment().startOf("day");

        for (const order of orders) {
            let subStatusChanged = false;

            if (order.flexiblePlan.type === "normal") {
                const startDate = moment(order.startDate).local();
                const planDuration = parseInt(order.flexiblePlan.plan, 10);
                const endDate = moment(order.startDate).local().add(planDuration, "days");

                if (today.isBetween(startDate, endDate, "day", "[]") || (planDuration === 1 && today.isSame(startDate, "day"))) {
                    const subStatus = order.subStatus.find((entry) =>
                        moment(entry.date).local().isSame(today, "day")
                    );
                    if (subStatus) {
                        if (subStatus.status === null) {
                            subStatus.status = "Not Delivered";
                            subStatusChanged = true;
                        }
                    }
                }

            } else if (order.flexiblePlan.type === "date-range") {
                const startDate = moment(order.flexiblePlan.startDate).local();
                const endDate = moment(order.flexiblePlan.endDate).local();

                if (today.isBetween(startDate, endDate, "day", "[]")) {
                    const subStatus = order.subStatus.find((entry) =>
                        moment(entry.date).local().isSame(today, "day")
                    );

                    if (subStatus) {
                        if (subStatus.status === null) {
                            subStatus.status = "Not Delivered";
                            subStatusChanged = true;
                        }
                    }
                }

            } else if (order.flexiblePlan.type === "flexi-dates") {

                const isTodayInFlexiDates = order.flexiblePlan.flexiDates.some((date) =>
                    moment(date).local().isSame(today, "day")
                );

                if (isTodayInFlexiDates) {
                    const subStatus = order.subStatus.find((entry) =>
                        moment(entry.date).local().isSame(today, "day")
                    );

                    if (subStatus) {
                        if (subStatus.status === null) {
                            subStatus.status = "Not Delivered";
                            subStatusChanged = true;
                        }
                    }
                }
            }

            if (subStatusChanged) {
                await order.save();
                console.log("Order saved successfully");
            }
        }
        console.log("\n=== Order Status Check Complete ===");
    } catch (err) {
        console.error("Error in checkAndUpdateOrderStatus:", err);
    }
};

// REMOVED: checkAndUpdateOrderStatus();  <-- THIS WAS CRASHING YOUR APP

// --- Cron Job 1 ---
cron.schedule("0 */6 * * *", async () => {
    console.log("Running scheduled order status check...");
    await checkAndUpdateOrderStatus();
});

// --- Function 2: Auto Reject/Complete ---
const autoUpdateOrderStatusToRejectedOrPlanCompleted = async () => {
    try {
        const planTypes = ["normal", "date-range", "flexi-dates"];

        for (const planType of planTypes) {
            const orders = await Order.find({ "flexiblePlan.type": planType });
            const today = moment().startOf("day").local();
            
            for (const order of orders) {
                let subStatusChanged = false;
                let statusUpdated = false;
                let startDate, endDate;

                if (planType === "normal") {
                    startDate = moment(order.startDate).local();
                    endDate = moment(order.startDate).local().add(parseInt(order.flexiblePlan.plan, 10), "days");
                } else if (planType === "date-range") {
                    startDate = moment(order.flexiblePlan.startDate).local();
                    endDate = moment(order.flexiblePlan.endDate).local();
                } else if (planType === "flexi-dates") {
                    if (!order.flexiblePlan.flexiDates?.length) continue;
                    const sortedDates = [...order.flexiblePlan.flexiDates].sort((a, b) => moment(a).valueOf() - moment(b).valueOf());
                    startDate = moment(sortedDates[0]).local();
                    endDate = moment(sortedDates[sortedDates.length - 1]).local();
                }

                // Check for Timeout (New Orders only)
                if (planType === "flexi-dates") {
                     const sortedDates = [...order.flexiblePlan.flexiDates].sort((a, b) => moment(a).valueOf() - moment(b).valueOf());
                     const orderStartDay = moment(sortedDates[0]).local();
                     const orderTimeout = orderStartDay.clone().add(2, 'days');
                     if (order.status === "New Order" && moment().isAfter(orderTimeout)) {
                         order.status = "Rejected";
                         statusUpdated = true;
                         await order.save();
                         continue;
                     }
                } else {
                    const orderStartDay = moment(order.startDate).local();
                    const orderTimeout = orderStartDay.clone().add(2, 'days');
                    if (order.status === "New Order" && moment().isAfter(orderTimeout)) {
                        order.status = "Rejected";
                        statusUpdated = true;
                        await order.save();
                        continue;
                    }
                }
                // Check if today is beyond the end date
                if (today.isAfter(endDate)) {
                    if (planType === "flexi-dates") {
                        if (order.status === "New Order") {
                            order.status = "Rejected";
                            statusUpdated = true;
                        } else if (order.status === "Processing") {
                            order.status = "Plan Completed";
                            statusUpdated = true;
                        }
                    } else {
                        if (order.status !== "Plan Completed" && order.status !== "Processing") {
                            order.status = "Rejected";
                            statusUpdated = true;
                        } else if (order.status === "Processing") {
                            order.status = "Plan Completed";
                            statusUpdated = true;
                        }
                    }
                }

                if (statusUpdated) {
                    await order.save();
                    console.log(`Order ${order._id} saved with status: ${order.status}`);
                }
            }
        }
    } catch (error) {
        console.error("Error in autoUpdateOrderStatusToRejectedOrPlanCompleted:", error);
    }
};

// REMOVED: autoUpdateOrderStatusToRejectedOrPlanCompleted(); <-- THIS WAS ALSO CRASHING YOUR APP

// --- Cron Job 2 ---
cron.schedule("0 */6 * * *", async () => {
    console.log("Running scheduled order status check...");
    await autoUpdateOrderStatusToRejectedOrPlanCompleted();
});

module.exports = (io) => {
    
    // ... (Rest of your routes remain exactly the same) ...
    
    router.put("/order/:id/status", async (req, res) => {
        // ... your existing code ...
        const { id } = req.params;
        const { status } = req.body;
        try {
            const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
            if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

            if(status!=="Rejected"){
                sendTiffinBookingConfirmationEmail(updatedOrder.customer, updatedOrder.email, updatedOrder?._id, updatedOrder?.time || updatedOrder?.startDate, updatedOrder?.mealType, updatedOrder?.total, updatedOrder?.address, updatedOrder?.phone?.fullNumber);
            } else {
                sendAdminTiffinBookingCancellation(updatedOrder.customer, updatedOrder.email, updatedOrder?._id, updatedOrder?.time || updatedOrder?.startDate, updatedOrder?.mealType, updatedOrder?.total, updatedOrder?.address, updatedOrder?.phone?.fullNumber);
            }
            io.emit("orderStatusUpdated", updatedOrder);
            res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

    router.post("/orders/bulk-action", async (req, res) => {
        const { action, orderIds } = req.body;

        try {
            if (action === "Delivered All") {
                const today = moment().local().startOf("day").toDate();

                // Find all orders in "Processing" and check if today's subStatus is matched
                const orders = await Order.find({
                    _id: { $in: orderIds },
                    status: "Processing",
                    subStatus: { $elemMatch: { date: { $gte: today }, status: { $ne: "Delivered" } } } // Ensure status for today exists and not already "Delivered"
                });

                for (const order of orders) {
                    const subStatusIndex = order.subStatus.findIndex((entry) =>
                        moment(entry.date).local().isSame(today, "day") // Ensure comparison in local time
                    );

                    if (subStatusIndex !== -1) {
                        // Update today's subStatus to "Delivered"
                        order.subStatus[subStatusIndex].status = "Delivered";
                    } else {
                        // Add today's subStatus if not present
                        order.subStatus.push({ date: today, status: "Delivered" });
                    }

                    await order.save();
                }

                // Emit updated orders to connected clients
                const updatedOrders = await Order.find({ _id: { $in: orderIds } });
                io.emit("bulkOrderStatusUpdated", {
                    action,
                    orders: updatedOrders,
                });

                return res.status(200).json({
                    message: "Bulk action completed successfully",
                    updatedCount: updatedOrders.length,
                });
            } else {
                // Handle "All Accept" and "All Reject"
                const validStatuses = ["New Order"]; // Only target New Orders
                const newStatus = action === "All Accept" ? "Processing" : "Rejected";

                const ordersToUpdate = await Order.find({
                    _id: { $in: orderIds },
                    status: { $in: validStatuses },
                    // subStatus: { $elemMatch: { date: { $gte: moment().local().startOf('day').toDate() }, status: { $ne: "Delivered" } } } // Ensure today's status is either not delivered or absent
                });

                for (const order of ordersToUpdate) {
                    order.status = newStatus;
                    await order.save();
                }

                // Fetch and emit updated orders
                const updatedOrders = await Order.find({ _id: { $in: orderIds } });
                io.emit("bulkOrderStatusUpdated", {
                    action,
                    orders: updatedOrders,
                });

                return res.status(200).json({
                    message: "Bulk action completed successfully",
                    updatedCount: updatedOrders.length,
                });
            }
        } catch (err) {
            console.error("Error performing bulk action:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });


    router.put("/order/:id/sub-status", async (req, res) => {
        const { id } = req.params;
        const { date, status } = req.body;

        try {
            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            const targetDate = moment(date).local().startOf("day");

            const subStatusIndex = order.subStatus.findIndex((entry) =>
                moment(entry.date).local().isSame(targetDate, "day")
            );

            if (subStatusIndex !== -1) {
                order.subStatus[subStatusIndex].status = status;
            } else {
                order.subStatus.push({ date: targetDate.toDate(), status });
            }

            await order.save();

            io.emit("subStatusUpdated", order);
            res.status(200).json(order);
        } catch (err) {
            console.error("Error updating sub-status:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

    router.get("/auto-rejected-orders", async (req, res) => {
        try {
            // const order = await Order.find();
            // console.log("Orders is", order)
            const twoDaysAgo = moment().subtract(2, 'days').toDate();

            const autoRejectedOrders = await Order.find({
                status: "Rejected",
                $or: [
                    {
                        "flexiblePlan.type": { $in: ["normal", "date-range"] },
                        startDate: { $lte: twoDaysAgo }
                    },
                    {
                        "flexiblePlan.type": "flexi-dates",
                        "flexiblePlan.flexiDates": {
                            $not: { $elemMatch: { $gte: new Date() } } // No future dates left
                        }
                    }
                ]
            }).sort({ startDate: -1 });

            res.status(200).json(autoRejectedOrders);
        } catch (error) {
            console.error("Error fetching auto-rejected orders:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });

    // Restore auto-rejected orders
    router.post("/restore-rejected-orders", async (req, res) => {
        try {
            const { orderIds } = req.body;

            const restoredOrders = await Order.updateMany(
                {
                    _id: { $in: orderIds },
                    status: "Rejected"
                },
                {
                    $set: {
                        status: "Processing",
                        restoredAt: new Date()
                    }
                },
                { new: true }
            );

            // Emit socket event for real-time updates
            const updatedOrders = await Order.find({ _id: { $in: orderIds } });
            io.emit("ordersRestored", updatedOrders);

            res.status(200).json({
                message: "Orders restored successfully",
                restoredCount: restoredOrders.modifiedCount
            });
        } catch (error) {
            console.error("Error restoring orders:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });


    return router;
};