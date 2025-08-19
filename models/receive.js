const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receiveSchema = new Schema({
  // Relationships
  donor: { type: mongoose.Types.ObjectId, ref: 'User', required: true },   // Donor user
  food: { type: mongoose.Types.ObjectId, ref: 'Food', required: true },    // Food donation
  receiver: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // NGO
  volunteer: { type: mongoose.Types.ObjectId, ref: 'User' },                // Assigned Volunteer

  // Receiver details
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: Number, required: true },
  address: { type: String, required: true },

  // Tracking
  status: { 
    type: String, 
    enum: ["Assigned", "Picked", "In Transit", "Delivered", "Rejected"], 
    default: "Assigned" 
  },
  assignedAt: { type: Date, default: Date.now },
  pickedAt: { type: Date },
  deliveredAt: { type: Date },

  // Expiry
  exptime: { type: Date, required: true },

  // Feedback
  feedback: {
    ngo: { type: String },          // NGO comments
    volunteer: { type: String },    // Volunteer comments
    donor: { type: String }         // Donor feedback
  }

}, { timestamps: true });

module.exports = mongoose.model('Receive', receiveSchema);
