// // models/OperatingHoursOffer.js
// const mongoose = require("mongoose");

// const operatingHoursOfferSchema = new mongoose.Schema({
//   day: {
//     type: String,
//     enum: [
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//       "Sunday",
//     ],
//     required: true,
//   },
//   openTime: {
//     type: String,
//     required: true,
//   },
//   closeTime: {
//     type: String,
//     required: true,
//   },
//   timeSlotOffers: [
//     {
//       timeSlot: {
//         type: String,
//         required: true,
//       },
//       offerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Offer",
//       },
//       firmId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Firm", // Assuming you have a Firm or Restaurant model
//         // required: true,
//       },
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Remove restaurantId index since we're not using it
// operatingHoursOfferSchema.index({ day: 1, firmId: 1 }, { unique: true });

// operatingHoursOfferSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model(
//   "OperatingHoursOffer",
//   operatingHoursOfferSchema
// );

// models/OperatingHoursOffer.js
const mongoose = require("mongoose");

const operatingHoursOfferSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  openTime: {
    type: String,
    required: true,
  },
  closeTime: {
    type: String,
    required: true,
  },
  timeSlotOffers: [
    {
      timeSlot: {
        type: String,
        required: true,
      },
      offers: [
        {
          offerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RestaurantOffers", // Updated to match populate model
          },
          firmId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Firm",
          },
          _id: {
            type: mongoose.Schema.Types.ObjectId,
          },
        },
      ],
      _id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

operatingHoursOfferSchema.index({ day: 1 }, { unique: true }); // Removed firmId from index as it's in timeSlotOffers

operatingHoursOfferSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model(
  "OperatingHoursOffer",
  operatingHoursOfferSchema
);
