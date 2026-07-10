// olcademybackend/models/Venue.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const venueSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  organizer: {
    // The user who created this venue (for management)
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Venue = mongoose.model("Venue", venueSchema);
module.exports = Venue;