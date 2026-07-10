// olcademybackend/models/event.js

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ALLOWED_EVENT_CATEGORIES } = require("../utils/eventFilters");

const performerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    image: { type: String },
    bio: { type: String },
  },
  { _id: false }
);

const scheduleItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    description: { type: String },
  },
  { _id: false }
);

const pricingSchema = new Schema(
  {
    general: { type: Number, required: true },
    vip: { type: Number },
    currency: { type: String, required: true, default: "usd" },
  },
  { _id: false }
);

const venueSnapshotSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, ref: "Venue" },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

const ticketTypeSnapshotSchema = new Schema(
  {
    ticketTypeId: { type: Schema.Types.ObjectId, ref: "TicketType" },
    name: { type: String, required: true },
    priceCents: { type: Number, required: true },
    currency: { type: String, required: true },
    inventory: { type: Number },
    type: { type: String, enum: ["GA", "RESERVED"], default: "GA" },
    seatMapId: { type: String },
  },
  { _id: false }
);

const metadataSchema = new Schema(
  {
    isKidsFriendly: { type: Boolean },
    isPetFriendly: { type: Boolean },
    layout: { type: String },
  },
  { _id: false }
);

const supportSchema = new Schema(
  {
    email: { type: String },
    phone: { type: String },
  },
  { _id: false }
);

const eventSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "draft", "cancelled"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ALLOWED_EVENT_CATEGORIES,
      required: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    dateTime: {
      type: Date,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    registrationDeadline: {
      type: Date,
    },
    venue: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    venueSnapshot: {
      type: venueSnapshotSchema,
      default: undefined,
    },
    pricing: {
      type: pricingSchema,
      required: true,
    },
    ticketTypes: [
      {
        type: Schema.Types.ObjectId,
        ref: "TicketType",
      },
    ],
    ticketTypeSnapshot: {
      type: [ticketTypeSnapshotSchema],
      default: [],
    },
    performers: {
      type: [performerSchema],
      default: [],
    },
    schedule: {
      type: [scheduleItemSchema],
      default: [],
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    metadata: {
      type: metadataSchema,
      default: undefined,
    },
    support: {
      type: supportSchema,
      default: undefined,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resaleRules: {
      allowed: { type: Boolean, default: false },
      maxPriceMultiplier: { type: Number, default: 1.0 },
    },
    // Deprecated legacy fields retained for backward compatibility
    eventName: { type: String },
    location: { type: String },
    ticketCost: { type: Number },
    eventOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Keep a stable `id` field for clients that expect it (without removing `_id`).
eventSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

eventSchema.set("toObject", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;