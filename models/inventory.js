// models/inventory.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  ngo: { type: mongoose.Types.ObjectId, ref: "User", required: true },  // which NGO
  food: { type: mongoose.Types.ObjectId, ref: "Food", required: true }, // which donation
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Inventory", InventorySchema);
