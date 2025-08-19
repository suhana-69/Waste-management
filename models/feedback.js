// models/feedback.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // who gave feedback
  food: { type: mongoose.Types.ObjectId, ref: "Food", required: true }, // linked donation
  role: { 
    type: String, 
    enum: ["Donor", "NGO", "Volunteer", "Beneficiary"], 
    required: true 
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Feedback", FeedbackSchema);
