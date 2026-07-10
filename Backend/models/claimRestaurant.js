const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    cuisine: { type: String, required: true },
    status: {
      type: String,
      enum: ["claimed", "unclaimed"],
      default: "unclaimed",
    },
    address: { type: String, required: true },
    hours: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 format
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },

    image: { type: String, default: "" },
    ownerName: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
