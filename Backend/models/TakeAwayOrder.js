const mongoose = require("mongoose");
const selectedPlanSubSchema = new mongoose.Schema(
  {
    id: {
      type: String, // String type for id
      required: false, // Based on your requirement
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);
const mealTypeSubSchema = new mongoose.Schema(
  {
    id: {
      type: String, // String type for id
      required: false, // Based on your requirement
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "productModelType",
    },
    name: {
      type: String,
      required: [true, "Item name is required."],
    },
    description: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1."],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative."],
    },
    foodType: {
      type: String,
      default: "",
    },
    itemType: {
      type: String,
      enum: ["firm", "tiffin"],
      required: true,
    },
    productModelType: {
      type: String,
      required: true,
      enum: ["Firm", "Tiffin"],
    },
    sourceEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "sourceEntityName",
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sourceEntityName: {
      type: String,
      enum: ["Firm", "Tiffin"],
      required: true,
    },

    mealType: {
      type: mealTypeSubSchema, // Refer to the sub-schema here
      required: function () {
        return this.itemType === "tiffin";
      },
    },
    selectedPlan: {
      type: selectedPlanSubSchema,
      required: function () {
        return this.itemType === "tiffin";
      },
    },
    selectedDeliveryTimeSlot: {
      type: String,
      required: function () {
        return this.itemType === "tiffin";
      },
    },
    startDate: {
      type: Date,
      required: function () {
        return this.itemType === "tiffin";
      },
    },
    endDate: {
      type: Date,
      required: function () {
        return this.itemType === "tiffin";
      },
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Subtotal cannot be negative."],
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, "Platform fee cannot be negative."],
    },
    gstCharges: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "GST charges cannot be negative."],
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Total price cannot be negative."],
    },
  },
  {
    timestamps: true,
  }
);

// cartSchema.pre("save", function (next) {
//   this.totalPrice =
//     this.subtotal + this.deliveryFee + this.platformFee + this.gstCharges;
//   next();
// });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
