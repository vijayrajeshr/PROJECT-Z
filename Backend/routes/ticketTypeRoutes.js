const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createTicketType,
  getEventTicketTypes,
} = require("../controller/ticketTypeController");

const authMiddleware = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

const authorizedRoles = ["eventCreator", "admin"];

// Validation Rules
const ticketValidationRules = [
  body("eventId", "Event ID is required").isMongoId(),
  body("name", "Ticket name is required").not().isEmpty(),
  body("priceCents", "Price (in cents) is required").isNumeric(),
  body("inventory", "Inventory count is required").isNumeric(),
  body("type", "Type must be GA or RESERVED").optional().isIn(["GA", "RESERVED"]),
];

// @route   POST /api/ticket-types
// @desc    Add a ticket type to an event
// @access  Private
router.post(
  "/",
  authMiddleware,
  checkRole(authorizedRoles),
  ticketValidationRules,
  createTicketType
);

// @route   GET /api/ticket-types/:eventId
// @desc    Get tickets for an event
// @access  Public
router.get("/:eventId", getEventTicketTypes);

module.exports = router;