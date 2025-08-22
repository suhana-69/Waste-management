const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receiveSchema = new Schema({
  // Relationships
  donor: { type: mongoose.Types.ObjectId, ref: 'User', required: true },   // Donor user
  food: { type: mongoose.Types.ObjectId, ref: 'Food', required: true },    // Food donation
  receiver: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // NGO user

  volunteer: { type: mongoose.Types.ObjectId, ref: 'User' }, // Assigned Volunteer (optional)

  // Receiver details (optional for simplicity)
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  address: { type: String },

  // Status tracking
  status: { 
    type: String, 
    enum: ["Assigned", "Picked", "In Transit", "Delivered", "Rejected"], 
    default: "Assigned" 
  },
  assignedAt: { type: Date, default: Date.now },
  pickedAt: { type: Date },
  deliveredAt: { type: Date },

  // Expiry (optional)
  exptime: { type: Date },

  // Feedback (optional)
  feedback: {
    ngo: { type: String },          
    volunteer: { type: String },    
    donor: { type: String }         
  }
}, { timestamps: true });

module.exports = mongoose.model('Receive', receiveSchema);
