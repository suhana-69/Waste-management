// models/notification.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  recipient: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Email", "SMS", "Push"], 
    default: "Push" 
  },
  status: { 
    type: String, 
    enum: ["Unread", "Read"], 
    default: "Unread" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
