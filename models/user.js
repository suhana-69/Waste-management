const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, required: true, enum: ["Donor", "NGO", "Volunteer"] },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  url: { type: String, required: true },

  donorDetails: {
    orgName: { type: String },
    donationType: { type: String },
  },

  ngoDetails: {
    orgName: { type: String },
    license: { type: String },
  },

  volunteerDetails: {
    skills: { type: String },
    availability: { type: String },
  },

  resetToken: String,
  expireToken: Date,
});

// ✅ Correct export: returns a Mongoose model, not just schema
module.exports = mongoose.model("User", userSchema);