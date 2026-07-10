
const mongoose = require("mongoose");
const { Schema } = mongoose;

// This schema defines one item in the cart (e.g., 2 x 'VIP')
const eventOrderItemSchema = new Schema(
  {
    ticketType: {
      type: Schema.Types.ObjectId,
      ref: "TicketType", // Links to the TicketType model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    priceCents: {
      // Price at the time of purchase
      type: Number,
      required: true,
    },
  },
  { _id: false } // Don't create separate _id for sub-documents
);

// This is the main "EventBooking" (or Ticket Order)
const eventBookingSchema = new Schema(
  {
    // The user who placed the booking
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Correctly links to your User model
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event", // Links to the Event model
      required: true,
    },
    items: [eventOrderItemSchema],
    totalAmountCents: {
      // Stored as integer cents, per the spec
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    // For idempotency, from the spec
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but unique otherwise
    },
  },
  {
    timestamps: true,
  }
);

const EventBooking = mongoose.model("EventBooking", eventBookingSchema);
module.exports = EventBooking;