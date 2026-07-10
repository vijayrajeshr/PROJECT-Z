const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); // Your existing auth
const {
  createBooking,
  confirmMockPayment,
  getMyBookings,
  getMyTickets
} = require("../controller/eventBookingController");

// All these routes require login
router.use(authMiddleware);

// @route   POST /api/bookings
// @desc    Start a new booking (Pending status)
router.post("/", createBooking);

// @route   POST /api/bookings/confirm-mock
// @desc    Finalize booking and issue tickets (Mock Payment)
router.post("/confirm-mock", confirmMockPayment);

// @route   GET /api/bookings/my-bookings
// @desc    Get order history
router.get("/my-bookings", getMyBookings);

// @route   GET /api/bookings/my-tickets
// @desc    Get actual tickets (with QR codes)
router.get("/my-tickets", getMyTickets);

module.exports = router;