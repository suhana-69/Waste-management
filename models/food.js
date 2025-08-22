const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  donor: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // Donor user
  ngo: { type: mongoose.Types.ObjectId, ref: 'User' }, // Assigned NGO
  volunteer: { type: mongoose.Types.ObjectId, ref: 'User' }, // Assigned Volunteer

  // Basic details (all required in donor form)
  funcname: { type: String, required: true },       // Function / Event Name
  name: { type: String, required: true },           // Contact person name
  mobile: { type: String, required: true },         // Mobile number (keep as String to avoid leading 0 issues)
  description: { type: String, required: true },    // Food description
  quantity: { type: String, required: true },       // Quantity
  foodtype: { type: String, required: true },       // Veg / Non-Veg / Packed
  cookedtime: { type: String, required: true },     // Cooked time
  expirytime: { type: Date, required: true },       // Expiry time

  // Status lifecycle
  status: { 
    type: String, 
    enum: ["Pending", "Accepted", "Picked", "In Transit", "Delivered", "Rejected"], 
    default: "Pending" 
  },
  received: { type: Boolean, default: false },

  // Location (all required in donor form)
  address: { type: String, required: true }, 
  city: { type: String, required: true }, 
  state: { type: String, required: true }, 
  lat: { type: Number },
  lng: { type: Number },

  // Food Images (single file → store in array for flexibility)
  images: [String], 

  // Hygiene checklist
  hygieneCheck: {
    packedProperly: { type: Boolean, default: false },
    notExpired: { type: Boolean, default: false },
    temperatureSafe: { type: Boolean, default: false },
    verifiedByVolunteer: { type: Boolean, default: false }
  },

  // Metadata
  datetime: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);