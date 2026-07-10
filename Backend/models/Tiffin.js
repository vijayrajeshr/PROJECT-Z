// const mongoose = require("mongoose");
// const moment = require("moment");
// const Firm = require("./Firm");
// // Plan schema
// const planSchema = new mongoose.Schema({
//   label: { type: String, required: true, default: "1" },
// });

// // Meal type schema
// const mealTypeSchema = new mongoose.Schema({
//   mealTypeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     default: new mongoose.Types.ObjectId(),
//   },
//   label: { type: String, required: true },
//   description: { type: String, required: true },
//   prices: { type: Map, of: Number, default: {} },
//   specificPlans: { type: [String], default: [] },
// });

// const instructionSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   details: { type: String, required: true },
// });

// // Menu schema
// const menuSchema = new mongoose.Schema({
//   plans: [planSchema],
//   mealTypes: [mealTypeSchema],
//   instructions: [instructionSchema],
//   serviceDays: { type: [String] },
//   isFlexibleDates: { type: Boolean, default: false },
// });

// const operatingTimesSchema = new mongoose.Schema({
//   Monday: { open: String, close: String },
//   Tuesday: { open: String, close: String },
//   Wednesday: { open: String, close: String },
//   Thursday: { open: String, close: String },
//   Friday: { open: String, close: String },
//   Saturday: { open: String, close: String },
//   Sunday: { open: String, close: String },
// });

// const taxSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   rate: { type: String, required: true },
//   isApplicable: { type: Boolean, default: true },
//   isDefault: { type: Boolean, default: false },
// });

// const ChargesSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   value: { type: String, required: true },
//   isApplicable: { type: Boolean, default: true },
//   isDefault: { type: Boolean, default: false },
//   type: { type: String, enum: ["flat", "percentage"], default: "flat" },
// });

// const deliveryRangeSchema = new mongoose.Schema({
//   minDistance: {
//     type: Number,
//     required: true,
//   },
//   maxDistance: {
//     type: Number,
//     required: true,
//   },
//   charge: {
//     type: Number,
//     required: true,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Offer Schema
// const offerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   code: {
//     type: String,
//     required: true,
//     // unique: true,
//     uppercase: true,
//     trim: true,
//   },
//   type: { type: String },
//   discount: {
//     type: Number,
//     required: true,
//   },
//   scope: {
//     type: String,
//     enum: ["Tiffin-wide", "MealType-specific", "MealPlan-Specific"],
//     required: true,
//   },
//   mealTypes: [
//     {
//       mealTypeId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Tiffin.menu.mealTypes",
//       },
//       label: String,
//     },
//   ],

//   mealPlans: [
//     {
//       type: String,
//       ref: "Tiffin.menu.plans",
//     },
//   ],
//   startDate: {
//     type: Date,
//     required: true,
//   },
//   endDate: {
//     type: Date,
//     required: true,
//   },
//   active: {
//     type: Boolean,
//     default: true,
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Pre-save middleware for date validation
// offerSchema.pre("save", function (next) {
//   if (moment(this.endDate).isBefore(this.startDate)) {
//     next(new Error("End date must be after start date"));
//   }

//   this.updatedAt = Date.now();

//   next();
// });

// const kitchenSchema = new mongoose.Schema({
//   id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
//   kitchenName: {
//     type: String,
//     required: true,
//   },
//   menu: menuSchema,
//   ownerMail: { type: String },
//   ownerPhoneNo: {
//     countryCode: {
//       type: String,
//       // required: true,
//     },
//     number: {
//       type: String,
//       // required: true,
//     },
//     fullNumber: {
//       type: String,
//       // required: true,
//       // unique: true,
//     },
//   },
//   category: {
//     type: [
//       {
//         type: String,
//         enum: ["veg", "non-veg", "both"],
//       },
//     ],
//   },
//   images: {
//     type: [String],
//   },
//   specialMealDay: {
//     type: String,
//   },
//   address: {
//     type: String,
//   },
//   reviews: {
//     type: String,
//   },
//   freeDelivery: {
//     type: String,
//   },
//   deliveryDetails: {
//     type: String,
//   },
//   deliveryCity: {
//     type: String,
//   },
//   ratings: {
//     type: Number,
//     min: 0,
//     max: 5,
//     default: 0,
//   },
//   operatingTimes: operatingTimesSchema,
//   serviceClouserDay: {
//     type: [String],
//   },
//   catering: {
//     type: Boolean,
//   },
//   houseParty: {
//     type: Boolean,
//   },
//   specialEvents: {
//     type: Boolean,
//   },
//   kitchenOwner: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
//   tax: [taxSchema],
//   charges: [ChargesSchema],
//   deliveryCharge: [deliveryRangeSchema],
//   offers: [offerSchema],
//   newlyAdded: {
//     type: Boolean,
//     default: true,
//   },
//   termsAccepted: {
//     type: Boolean,
//     default: false,
//   },
//   termsAcceptedDate: {
//     type: Date,
//   },
//   registrationStatus: {
//     type: String,
//     enum: ["incomplete", "pending", "complete"],
//     default: "incomplete",
//   },
//   status: {
//     type: String,
//     enum: ["Pending", "Claimed", "Unclaimed", "Revoked", "Approved"],
//     default: "Pending", // Default to Pending for tiffins
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Tiffin = mongoose.model("Tiffin", kitchenSchema);
// module.exports = Tiffin;

const mongoose = require("mongoose");
const moment = require("moment");

// Existing Plan schema
const planSchema = new mongoose.Schema({
  label: { type: String, required: true, default: "1" },
});

// Existing Meal type schema
const mealTypeSchema = new mongoose.Schema({
  mealTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  label: { type: String, required: true },
  description: { type: String, default: "" },
  prices: { type: Map, of: Number, default: {} },
  specificPlans: { type: [String], default: [] },
});

// Existing Instruction schema
const instructionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, required: true },
});

// Existing Menu schema
const menuSchema = new mongoose.Schema({
  plans: [planSchema],
  mealTypes: [mealTypeSchema],
  instructions: [instructionSchema],
  serviceDays: { type: [String] },
  isFlexibleDates: { type: Boolean, default: false },
});

// Existing Operating Times schema
const operatingTimesSchema = new mongoose.Schema({
  Monday: { open: String, close: String },
  Tuesday: { open: String, close: String },
  Wednesday: { open: String, close: String },
  Thursday: { open: String, close: String },
  Friday: { open: String, close: String },
  Saturday: { open: String, close: String },
  Sunday: { open: String, close: String },
});

// Existing Tax schema
const taxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: String, required: true },
  isApplicable: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
});

// Existing Charges schema
const ChargesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  isApplicable: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
  type: { type: String, enum: ["flat", "percentage"], default: "flat" },
});
const reviewSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    email: String,
    days: String,
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    comments: [String],

    ownerReply: {
      reply: String,
      username: String,
      createdAt: Date,
    },

    usercomments: [
      {
        commentId: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        username: String,
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
        replies: [
          {
            reply: String,
            username: String,
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [String],
    followers: {
      type: Number,
      default: 0,
    },
    followBy: [String],
    reviewType: {
      type: String,
      enum: ["tiffin", null],
      required: true,
      default: null,
    },
    aspects: {
      pricePerPerson: String,
      food: { type: Number, min: 0, max: 5 },
      service: { type: Number, min: 0, max: 5 },
      atmosphere: { type: Number, min: 0, max: 5 },
      noiseLevel: String,
      groupSize: String,
      waitTime: String,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    author_name: {
      type: String,
      required: true,
    },
    date: String,
  },
  { timestamps: true } // << adds createdAt and updatedAt
);
// Existing Delivery Range schema
const deliveryRangeSchema = new mongoose.Schema({
  minDistance: {
    type: Number,
    required: true,
  },
  maxDistance: {
    type: Number,
    required: true,
  },
  charge: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Existing Offer Schema
const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  type: { type: String },
  discount: {
    type: Number,
    required: true,
  },
  scope: {
    type: String,
    enum: ["Tiffin-wide", "MealType-specific", "MealPlan-Specific"],
    required: true,
  },
  mealTypes: [
    {
      mealTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tiffin.menu.mealTypes",
      },
      label: String,
    },
  ],

  mealPlans: [
    {
      type: String,
      ref: "Tiffin.menu.plans",
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  accept: {
    type: Boolean,
    default: false,
  },
});

offerSchema.pre("save", function (next) {
  if (moment(this.endDate).isBefore(this.startDate)) {
    next(new Error("End date must be after start date"));
  }
  this.updatedAt = Date.now();
  next();
});

// NEW: Review Schema to accurately capture review data
// const reviewSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   date: { type: Date, required: true },
//   author: { type: String, required: true },
//   rating: { type: Number, min: 1, max: 5, required: true },
// });

const kitchenSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() }, // This 'id' seems to be a secondary ID
  kitchenName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    // required: true,
  },
  menu: menuSchema,
  ownerMail: { type: String },
  ownerPhoneNo: {
    countryCode: {
      type: String,
    },
    number: {
      type: String,
    },
    fullNumber: {
      type: String,
    },
  },
  category: {
    type: [
      {
        type: String,
        enum: ["veg", "non-veg", "both"],
      },
    ],
  },
  images: {
    type: [String],
  },
  specialMealDay: {
    type: String,
  },
  address: {
    type: String,
  },
  // UPDATED: 'reviews' field to be an array of reviewSchema
  reviews: [reviewSchema],
  freeDelivery: {
    type: String,
  },
  deliveryDetails: {
    type: String,
  },
  // UPDATED: 'deliveryCity' to be an array of strings
  deliveryCity: {
    type: [String],
  },
  // NEW: Field for Delivery Times as provided in the input
  deliveryTimeSlots: {
    type: [String],
    default: [],
  },
  // NEW: Field for Additional Info
  additionalInfo: {
    type: String,
  },
  // NEW: Field for Terms and Conditions
  termsAndConditions: {
    type: String,
  },
  // NEW: Field for Website URL
  websiteURL: {
    type: String,
  },
  // NEW: Field for Instagram URL
  instagramURL: {
    type: String,
  },
  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  operatingTimes: operatingTimesSchema,
  serviceClouserDay: {
    type: [String],
  },
  catering: {
    type: Boolean,
  },
  houseParty: {
    type: Boolean,
  },
  specialEvents: {
    type: Boolean,
  },
  kitchenOwner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tax: [taxSchema],
  charges: [ChargesSchema],
  deliveryCharge: [deliveryRangeSchema],
  offers: [offerSchema],
  newlyAdded: {
    type: Boolean,
    default: true,
  },
  termsAccepted: {
    type: Boolean,
    default: false,
  },
  termsAcceptedDate: {
    type: Date,
  },
  registrationStatus: {
    type: String,
    enum: ["incomplete", "pending", "completed"],
    default: "incomplete",
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: {
    type: String,
    enum: ["Pending", "Claimed", "Unclaimed", "Revoked", "Approved"],
    default: "Pending", // Default to Pending for tiffins
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Tiffin = mongoose.model("Tiffin", kitchenSchema);

module.exports = Tiffin;
