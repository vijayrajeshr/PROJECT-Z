const mongoose = require("mongoose");
//in progress
const bookingSchema = new mongoose.Schema(
  {
    orderDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    scheduleDate:{
      type:Date,
      required:true
    },
    guests: {
      type: Number,
      required: true,
    },
    meal: {
      type: String,
      required: true,
    },
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantOffers",
      default: null,
    },
    firm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "canceled", "rejected"],
      default: "pending",
    },
    history: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subStatus:[
    {
    date:{
        type:Date,
    },
    statue:{
    type:String,
    }
    }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
