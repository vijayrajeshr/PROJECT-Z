const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getAllEvents,
  getEventById,
  createEvent, // <-- IMPORT THIS
  updateEvent,
} = require("../controller/eventController");

// Import our middleware
const authMiddleware = require("../middleware/auth"); // Your existing auth file
const checkRole = require("../middleware/checkRole"); // Our new role checker
const eventUpload = require("../middleware/eventUpload"); // <-- THIS IS THE CHANGE

// Define the roles that are allowed to create events
const authorizedRoles = ["eventCreator", "admin"];

// --- PUBLIC ROUTES ---
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// --- ORGANIZER/ADMIN ROUTES ---

// Validation rules for creating an event
const eventValidationRules = [
  body("title", "Event title is required").not().isEmpty(),
  body("description", "Description is required").not().isEmpty(),
  body("startAt", "Start date is required").isISO8601(),
  body("endAt", "End date is required").isISO8601(),
  body("venue", "Venue ID is required").isMongoId(),
];

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (eventCreator, admin)
router.post(
  "/",
  authMiddleware, // 1. Check login
  checkRole(authorizedRoles), // 2. Check role
  eventUpload.array("images", 5), // 3. Handle 'images' field (up to 5 files)
  eventValidationRules, // 4. Validate text fields
  createEvent // 5. Run the controller
);

// @route   PUT /api/events/:id
// @desc    Update an existing event
// @access  Private (eventCreator, admin)
router.put(
  "/:id",
  authMiddleware,
  checkRole(authorizedRoles),
  eventUpload.array("images", 5),
  // Minimal required-field validation is handled in controller to support partial updates.
  updateEvent
);

module.exports = router;