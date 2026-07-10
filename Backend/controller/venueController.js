const expressAsyncHandler = require("express-async-handler");
const Venue = require("../models/Venue");
const { validationResult } = require("express-validator"); // You have this in package.json

/**
 * @desc    Create a new venue
 * @route   POST /api/venues
 * @access  Private (eventCreator, admin)
 */
const createVenue = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, address, city, state, country, lat, lng } = req.body;
  
  // Get the logged-in user's ID from the session (set by authMiddleware)
  const organizerId = req.session.user?._id || req.session.dashboardUser?._id;

  if (!organizerId) {
     return res.status(401).json({ message: "Not authorized, no user session" });
  }

  const venue = new Venue({
    name,
    address,
    city,
    state,
    country,
    lat,
    lng,
    organizer: organizerId,
  });

  const createdVenue = await venue.save();
  res.status(201).json(createdVenue);
});

/**
 * @desc    Get all venues created by the logged-in organizer
 * @route   GET /api/venues
 * @access  Private (eventCreator, admin)
 */
const getMyVenues = expressAsyncHandler(async (req, res) => {
  const organizerId = req.session.user?._id || req.session.dashboardUser?._id;

  const venues = await Venue.find({ organizer: organizerId });
  res.status(200).json(venues);
});

// We can add updateVenue and deleteVenue logic here later

module.exports = {
  createVenue,
  getMyVenues,
};