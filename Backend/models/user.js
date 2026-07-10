const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const Firm = require("./Firm");
const Tiffin = require("./Tiffin");
const Event = require("./event");
const notificationSettingsSchema = new mongoose.Schema({
  
  enableAll: {
    type: Boolean,
    default: false,
  },
  promoPush: {
    type: Boolean,
    default: false,
  },
  promoWhatsapp: {
    type: Boolean,
    default: false,
  },
  socialPush: {
    type: Boolean,
    default: false,
  },
  orderPush: {
    type: Boolean,
    default: false,
  },
  orderWhatsapp: {
    type: Boolean,
    default: false,
  }
}, { _id: false });

const NotificationSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  time: { type: String, default: "" }
});
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    anniversary: {
      type: Date,
    },
    address: {
      type: String,
    },
    des: {
      type: String,
    },
    handle: {
      type: String,
    },
    website: {
      type: String,
    },
    kitchens: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tiffin",
      },
    ],
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    role: {
      type: [String],
      default: ["user"],
      enum: [
        "user",
        "admin",
        "moderator",
        "kitchenOwner",
        "restaurantOwner",
        "eventCreator",
        "marketingPerson",
      ],
    },
    notificationSettings: notificationSettingsSchema,
    Notifications: [NotificationSchema],
      vegMode:{
          type:Boolean,
          default:false,
        },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Firm",
      },
    ],
    recentlyViewed: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        itemType: { type: String, enum: ["Firm", "Tiffin"], required: true },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    favoritesRestaurant: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Firm" },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    await Firm.deleteMany({ _id: { $in: doc.firms } });
    await Tiffin.deleteMany({ _id: { $in: doc.kitchens } });
    await Event.deleteMany({ _id: { $in: doc.events } });
    next();
  } catch (err) {
    console.error("Error in post hook:", err);
    next(err);
  }
});

const User = model("User", userSchema);
module.exports = User;
