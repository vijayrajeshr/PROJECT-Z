const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      "Tiffin Order",
    "Takeaway Order",
      "Dining Booking",
      "New Message",
      "System Alert",
      "Promotion",
      "Security Alert",
      "Account Activity"
    ],
    message: '{VALUE} is not a valid notification type.'
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  },
  status: {
    type: String,
  },
  details: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
