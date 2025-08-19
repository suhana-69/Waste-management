const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  donor: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // Donor user
  ngo: { type: mongoose.Types.ObjectId, ref: 'User' }, // Assigned NGO
  volunteer: { type: mongoose.Types.ObjectId, ref: 'User' }, // Assigned Volunteer

  // Basic details
  recId: { type: String, required: true }, 
  funcname: { type: String, required: true }, // Event / Function Name
  name: { type: String, required: true },     // Contact person
  mobile: { type: Number, required: true }, 
  description: { type: String, required: true },
  quantity: { type: String, required: true },
  foodtype: { type: String, required: true }, 
  cookedtime: { type: String, required: true },
  expirytime: { type: Date, required: true },

  // Status lifecycle
  status: { 
    type: String, 
    enum: ["Pending", "Accepted", "Picked", "In Transit", "Delivered", "Rejected"], 
    default: "Pending" 
  },
  received: { type: Boolean, default: false },

  // Location
  address: { type: String, required: true }, 
  city: { type: String, required: true }, 
  state: { type: String, required: true }, 
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },

  // Food Images
  images: [String], // S3 URLs

  // Hygiene checklist
  hygieneCheck: {
    packedProperly: { type: Boolean, default: false },
    notExpired: { type: Boolean, default: false },
    temperatureSafe: { type: Boolean, default: false },
    verifiedByVolunteer: { type: Boolean, default: false }
  },

  // Metadata
  datetime: { type: String, required: true },
  resetToken: { type: String },
  expireToken: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
