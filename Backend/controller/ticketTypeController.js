// Backend/controller/ticketTypeController.js

const expressAsyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
// Make sure these paths match your structure. 
// If your models are in 'Backend/models', use '../models/...'
const TicketType = require("../models/TicketType");
const Event = require("../models/event"); 

// --- 1. Define createTicketType ---
/**
 * @desc    Create a Ticket Type for an Event
 * @route   POST /api/ticket-types
 * @access  Private (eventCreator, admin)
 */
const createTicketType = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { eventId, name, priceCents, inventory, type, seatMapId } = req.body;

  // 1. Verify the user is logged in
  const organizerId = req.session.user?._id || req.session.dashboardUser?._id;
  if (!organizerId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // 2. Find the event and verify ownership
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Ensure the logged-in user is the one who created this event
  if (event.organizer.toString() !== organizerId.toString()) {
    return res.status(403).json({ message: "Not authorized to modify this event" });
  }

  // 3. Create the TicketType
  const ticketType = new TicketType({
    event: eventId,
    name,
    priceCents,
    inventory,
    type: type || "GA",
    seatMapId,
  });

  const createdTicketType = await ticketType.save();

  // 4. CRITICAL: Push the new TicketType ID into the Event's ticketTypes array
  event.ticketTypes.push(createdTicketType._id);
  await event.save();

  res.status(201).json(createdTicketType);
});

// --- 2. Define getEventTicketTypes ---
/**
 * @desc    Get all ticket types for a specific event
 * @route   GET /api/ticket-types/:eventId
 * @access  Public
 */
const getEventTicketTypes = expressAsyncHandler(async (req, res) => {
  const ticketTypes = await TicketType.find({ event: req.params.eventId });
  res.status(200).json(ticketTypes);
});

// --- 3. Export Functions ---
module.exports = {
  createTicketType,
  getEventTicketTypes,
};