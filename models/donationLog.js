// models/donationLog.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonationLogSchema = new Schema({
  donor: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  ngo: { type: mongoose.Types.ObjectId, ref: "User" },
  volunteer: { type: mongoose.Types.ObjectId, ref: "User" },
  food: { type: mongoose.Types.ObjectId, ref: "Food", required: true },
  
  status: { 
    type: String, 
    enum: ["Pending", "Completed", "Rejected"], 
    default: "Pending" 
  },
  
  mealsServed: { type: Number, default: 0 }, // for analytics
  region: String, // city/state for location-based reports
}, { timestamps: true });

module.exports = mongoose.model("DonationLog", DonationLogSchema);
