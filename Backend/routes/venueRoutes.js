const express = require("express");
const router = express.Router();
const { body } = require("express-validator"); // For validation
const {
  createVenue,
  getMyVenues,
} = require("../controller/venueController");

// Import our middleware
const authMiddleware = require("../middleware/auth"); // Your existing auth file
const checkRole = require("../middleware/checkRole"); // Our new role checker

// Define the roles that are allowed to access these routes
const authorizedRoles = ["eventCreator", "admin"];

// Validation rules for creating a venue
const venueValidationRules = [
  body("name", "Venue name is required").not().isEmpty(),
  body("address", "Address is required").not().isEmpty(),
  body("city", "City is required").not().isEmpty(),
  body("state", "State is required").not().isEmpty(),
  body("country", "Country is required").not().isEmpty(),
  body("lat", "Latitude is required").isNumeric(),
  body("lng", "Longitude is required").isNumeric(),
];

// @route   POST /api/venues
// @desc    Create a new venue
// @access  Private (eventCreator, admin)
router.post(
  "/",
  authMiddleware, // 1. Check if user is logged in
  checkRole(authorizedRoles), // 2. Check if user has the correct role
  venueValidationRules, // 3. Validate the incoming data
  createVenue
);

// @route   GET /api/venues
// @desc    Get all venues for the logged-in organizer
// @access  Private (eventCreator, admin)
router.get(
  "/",
  authMiddleware, // 1. Check if logged in
  checkRole(authorizedRoles), // 2. Check for role
  getMyVenues
);

module.exports = router;