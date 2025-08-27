const mongoose = require("mongoose");  // import mongoose

// extract Schema from mongoose
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  role: {
    type: String,
    enum: ["user", "admin", "ngo", "donor", "volunteer"],
    default: "donor",
  },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  url: { type: String },
});

// export User model
module.exports = mongoose.model("User", userSchema);
