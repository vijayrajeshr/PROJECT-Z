const expressAsyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid"); // For generating unique QR secrets
const EventBooking = require("../models/EventBooking");
const TicketType = require("../models/TicketType");
const Ticket = require("../models/Ticket");

/**
 * @desc    Create a new event booking (Order)
 * @route   POST /api/bookings
 * @access  Private (User)
 */
const createBooking = expressAsyncHandler(async (req, res) => {
  const { eventId, items, idempotencyKey } = req.body; 
  // items example: [{ ticketTypeId: "123", quantity: 2 }]

  const userId = req.session.user?._id || req.session.dashboardUser?._id;
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No tickets selected" });
  }

  let totalAmountCents = 0;
  const bookingItems = [];

  // 1. Validate Inventory and Calculate Price
  for (const item of items) {
    const ticketType = await TicketType.findById(item.ticketTypeId);
    
    if (!ticketType) {
      return res.status(404).json({ message: `Ticket Type not found: ${item.ticketTypeId}` });
    }

    if (ticketType.inventory < item.quantity) {
      return res.status(400).json({ 
        message: `Not enough inventory for ${ticketType.name}. Only ${ticketType.inventory} left.` 
      });
    }

    // Add to total
    const lineTotal = ticketType.priceCents * item.quantity;
    totalAmountCents += lineTotal;

    bookingItems.push({
      ticketType: ticketType._id,
      quantity: item.quantity,
      priceCents: ticketType.priceCents, // Lock in the price at time of booking
    });
  }

  // 2. Create the Booking (Status: Pending)
  const booking = new EventBooking({
    user: userId,
    event: eventId,
    items: bookingItems,
    totalAmountCents,
    status: "pending", // Waiting for payment
    idempotencyKey,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

/**
 * @desc    Mock Payment Confirmation & Issue Tickets
 * @route   POST /api/bookings/confirm-mock
 * @access  Private (User)
 */
const confirmMockPayment = expressAsyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await EventBooking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status === "completed") {
    return res.status(400).json({ message: "Booking already paid" });
  }

  // --- HERE IS WHERE REAL STRIPE LOGIC WOULD GO ---
  // For now, we just assume payment succeeded.

  // 1. Update Booking Status
  booking.status = "completed";
  await booking.save();

  // 2. ISSUE TICKETS (The most important part)
  // We iterate through the order items and create individual Ticket documents
  const ticketsToCreate = [];

  for (const item of booking.items) {
    // Find the ticket type to decrement inventory (Simple DB decrement)
    await TicketType.findByIdAndUpdate(item.ticketType, {
        $inc: { inventory: -item.quantity }
    });

    // Create N tickets for this item type
    for (let i = 0; i < item.quantity; i++) {
      ticketsToCreate.push({
        booking: booking._id,
        event: booking.event,
        owner: booking.user,
        ticketType: item.ticketType,
        qrSecret: uuidv4(), // Generate unique QR code string
        status: "active",
      });
    }
  }

  // Bulk insert all tickets
  await Ticket.insertMany(ticketsToCreate);

  res.status(200).json({ 
    message: "Payment confirmed and tickets issued", 
    bookingId: booking._id 
  });
});

/**
 * @desc    Get My Event Bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
const getMyBookings = expressAsyncHandler(async (req, res) => {
  const userId = req.session.user?._id || req.session.dashboardUser?._id;

  const bookings = await EventBooking.find({ user: userId })
    .populate("event", "title startAt images venue") // Get event details
    .sort({ createdAt: -1 });

  res.status(200).json(bookings);
});

/**
 * @desc    Get My Tickets (Individual QR codes)
 * @route   GET /api/bookings/my-tickets
 * @access  Private
 */
const getMyTickets = expressAsyncHandler(async (req, res) => {
    const userId = req.session.user?._id || req.session.dashboardUser?._id;
  
    const tickets = await Ticket.find({ owner: userId })
      .populate("event", "title startAt venue")
      .populate("ticketType", "name")
      .sort({ createdAt: -1 });
  
    res.status(200).json(tickets);
  });

module.exports = {
  createBooking,
  confirmMockPayment,
  getMyBookings,
  getMyTickets
};