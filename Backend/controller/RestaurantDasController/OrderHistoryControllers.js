

const cron = require("node-cron");
const OrderTakeAway = require("../../models/UserOrderTakeaway");
const Bookings = require("../../models/RestaurantsDasModel/Booking");
const OrderHistory = require("../../models/RestaurantsDasModel/History");
const Connect = require("../../config/database.config.js");

Connect();

// Reverted to original delay for scheduled cron runs
const HISTORY_DELAY_HOURS = 5;
const HISTORY_DELAY_MS = HISTORY_DELAY_HOURS * 60 * 60 * 1000;

const getOrderDateFromTimeSlot = (orderDate, timeSlot) => {
    const baseDate = new Date(orderDate);

    if (!timeSlot) {
        console.warn("timeSlot is missing, using orderDate as is for history calculation.");
        return baseDate;
    }

    const [time, period] = timeSlot.split(' ');
    let [hours, minutes] = time.split(':');

    if (period === 'PM' && hours !== '12') {
        hours = parseInt(hours) + 12;
    } else if (period === 'AM' && hours === '12') {
        hours = 0; // Midnight (12 AM)
    }

    baseDate.setHours(parseInt(hours));
    baseDate.setMinutes(parseInt(minutes));
    baseDate.setSeconds(0);
    baseDate.setMilliseconds(0);

    return baseDate;
};

const saveDiningOrderAsHistory = async (order, actualOrderTime) => {
    try {
        await OrderHistory.create({
            username: order.username || (order.userId ? order.userId.username : 'N/A'),
            mode: "dining",
            items: order.items || [],
            totalPrice: order.totalPrice || 0,
            status: order.status,
            orderTime: actualOrderTime,
        });

        console.log(`[Dining History] Successfully created history record for order: ${order._id}`);
        await Bookings.findByIdAndUpdate(order._id, { history: true }, { new: true });
        console.log(`[Dining History] Successfully marked dining order ${order._id} as history: true.`);
    } catch (error) {
        console.error(`[Dining History Error] Error saving dining order ${order._id} as history:`, error.message);
    }
};

const diningOrdersCron = () => {
    // Cron schedule for 12:00 AM (midnight) and 12:00 PM (noon) daily
    cron.schedule('0 0,12 * * *', async () => {
        console.log("--- Dining orders cron job started at:", new Date(), "---");
        try {
            const now = new Date();
            console.log(`[Dining Cron] Current time (now): ${now.toISOString()}`);

            const ordersToProcess = await Bookings.find({
                history: false,
                status: { $in: ["accepted", "canceled", 'user_cancel'] }
            });

            if (ordersToProcess.length === 0) {
                console.log("[Dining Cron] No dining orders found to process.");
            }

            for (const order of ordersToProcess) {
                console.log(`\n[Dining Cron] Processing dining order ID: ${order._id}`);
                console.log(`[Dining Cron] Order status: ${order.status}`);
                console.log(`[Dining Cron] Order ScheduleDate: ${order.ScheduleDate}`);
                console.log(`[Dining Cron] Order timeSlot: ${order.timeSlot}`);
                console.log(`[Dining Cron] Order updatedAt: ${order.updatedAt}`);

                let completionOrCancellationTime;

                if (order.status === "accepted") {
                    completionOrCancellationTime = getOrderDateFromTimeSlot(order.ScheduleDate, order.timeSlot);
                    console.log(`[Dining Cron] Calculated completion time (accepted): ${completionOrCancellationTime.toISOString()}`);
                } else if (order.status === "canceled" || order.status === "user_cancel") {
                    completionOrCancellationTime = new Date(order.updatedAt);
                    console.log(`[Dining Cron] Calculated cancellation time (${order.status}): ${completionOrCancellationTime.toISOString()}`);
                } else {
                    console.log(`[Dining Cron] Skipping dining order ${order._id} due to unsupported status: ${order.status}`);
                    continue;
                }

                if (isNaN(completionOrCancellationTime.getTime())) {
                    console.error(`[Dining Cron Error] Invalid date calculated for order ${order._id}. Skipping.`);
                    continue;
                }

                const markAsHistoryAfter = new Date(completionOrCancellationTime.getTime() + HISTORY_DELAY_MS);
                console.log(`[Dining Cron] Order will be marked as history after: ${markAsHistoryAfter.toISOString()}`);

                if (now >= markAsHistoryAfter) {
                    console.log(`[Dining Cron] Condition met: now (${now.toISOString()}) >= markAsHistoryAfter (${markAsHistoryAfter.toISOString()}). Moving to history.`);
                    await saveDiningOrderAsHistory(order, completionOrCancellationTime);
                } else {
                    console.log(`[Dining Cron] Condition NOT met: now (${now.toISOString()}) < markAsHistoryAfter (${markAsHistoryAfter.toISOString()}). Not moving to history yet.`);
                }
            }
        } catch (error) {
            console.error("[Dining Cron Error] Error in dining orders cron job:", error.message);
        }
        console.log("--- Dining orders cron job finished ---");
    });
};

const takeawayOrdersCron = () => {
    // Cron schedule for 12:00 AM (midnight) and 12:00 PM (noon) daily
    cron.schedule('0 0,12 * * *', async () => {
        console.log("--- Takeaway orders cron job started at:", new Date(), "---");
        try {
            const now = new Date();
            console.log(`[Takeaway Cron] Current time (now): ${now.toISOString()}`);

            const ordersToProcess = await OrderTakeAway.find({
                history: false,
                status: { $in: ["ready", "rejected", 'user_cancel'] }
            })
            .populate({
                path: "userId",
                model: "User",
                select: "username",
            });

            if (ordersToProcess.length === 0) {
                console.log("[Takeaway Cron] No takeaway orders found to process.");
            }

            for (const order of ordersToProcess) {
                console.log(`\n[Takeaway Cron] Processing takeaway order ID: ${order._id}`);
                console.log(`[Takeaway Cron] Order status: ${order.status}`);
                console.log(`[Takeaway Cron] Order orderTime: ${order.orderTime}`);
                console.log(`[Takeaway Cron] Order updatedAt: ${order.updatedAt}`);

                let completionOrCancellationTime;

                if (order.status === "ready") {
                    completionOrCancellationTime = new Date(order.orderTime);
                    console.log(`[Takeaway Cron] Calculated completion time (ready): ${completionOrCancellationTime.toISOString()}`);
                } else if (order.status === "rejected" || order.status === "user_cancel") {
                    completionOrCancellationTime = new Date(order.updatedAt);
                    console.log(`[Takeaway Cron] Calculated cancellation time (${order.status}): ${completionOrCancellationTime.toISOString()}`);
                } else {
                    console.log(`[Takeaway Cron] Skipping takeaway order ${order._id} due to unsupported status: ${order.status}`);
                    continue;
                }

                if (isNaN(completionOrCancellationTime.getTime())) {
                    console.error(`[Takeaway Cron Error] Invalid date calculated for order ${order._id}. Skipping.`);
                    continue;
                }

                const markAsHistoryAfter = new Date(completionOrCancellationTime.getTime() + HISTORY_DELAY_MS);
                console.log(`[Takeaway Cron] Order will be marked as history after: ${markAsHistoryAfter.toISOString()}`);

                if (now >= markAsHistoryAfter) {
                    console.log(`[Takeaway Cron] Condition met: now (${now.toISOString()}) >= markAsHistoryAfter (${markAsHistoryAfter.toISOString()}). Marking as history.`);
                    try {
                        await OrderTakeAway.findByIdAndUpdate(order._id, { history: true }, { new: true });
                        console.log(`[Takeaway Cron] Successfully marked takeaway order ${order._id} as history: true.`);
                    } catch (updateError) {
                        console.error(`[Takeaway Cron Error] Error marking takeaway order ${order._id} as history:`, updateError.message);
                    }
                } else {
                    console.log(`[Takeaway Cron] Condition NOT met: now (${now.toISOString()}) < markAsHistoryAfter (${markAsHistoryAfter.toISOString()}). Not marking as history yet.`);
                }
            }
        } catch (error) {
            console.error("[Takeaway Cron Error] Error in takeaway orders cron job:", error.message);
        }
        console.log("--- Takeaway orders cron job finished ---");
    });
};

// Start the cron jobs (ensure these are called in your main application file, e.g., index.js)
diningOrdersCron();
takeawayOrdersCron();

// Export functions and models
module.exports = {
    getOrderDateFromTimeSlot,
    diningOrdersCron,
    takeawayOrdersCron,
    OrderHistory,
    Bookings,
};
