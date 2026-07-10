const mongoose = require("mongoose");

const ChargesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  normalizedName: { type: String },
  isApplicable: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firm",
  },
  type: { type: String, enum: ["flat", "percentage", "item"], default: "flat" },
});

module.exports = mongoose.model("Charges", ChargesSchema);
