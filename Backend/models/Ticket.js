const mongoose = require("mongoose");
const { Schema } = mongoose;

const ticketSchema = new Schema(
  {
    // *** THIS IS THE CORRECTION ***
    // It now links to "EventBooking"
    booking: {
      type: Schema.Types.ObjectId,
      ref: "EventBooking", // Links to our new EventBooking model
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    // The user who currently owns this ticket
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketType: {
      type: Schema.Types.ObjectId,
      ref: "TicketType",
      required: true,
    },
    qrSecret: {
      // A secure, unique UUID for the QR code
      type: String,
      required: true,
      unique: true,
    },
    seatInfo: {
      // e.g., { section: '101', row: 'B', seat: '12' }
      type: Object,
    },
    status: {
      type: String,
      enum: ["active", "checked_in", "resale_pending", "transferred"],
      default: "active",
    },
    checkedInAt: {
      type: Date,
      nullable: true,
    },
    scannerId: {
      // ID of the scanner that processed the check-in
      type: String,
      nullable: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;