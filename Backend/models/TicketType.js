// olcademybackend/models/TicketType.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const ticketTypeSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  name: {
    // e.g., "General Admission", "VIP", "Balcony Seat"
    type: String,
    required: true,
  },
  priceCents: {
    // Store money as integers to avoid floating point errors
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "usd", // or "cad"
  },
  inventory: {
    // Total number of this ticket type available
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["GA", "RESERVED"], // General Admission or Reserved Seating
    default: "GA",
  },
  seatMapId: {
    // Optional: for "RESERVED" type, links to a seat map
    type: String,
    nullable: true,
  },
});

const TicketType = mongoose.model("TicketType", ticketTypeSchema);
module.exports = TicketType;