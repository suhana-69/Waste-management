const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require("dotenv").config();

const HttpError = require("../models/http-error");
const Food = require("../models/food");
const Receive = require("../models/receive");
const User = require("../models/user");

const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(
  sendgridTransport({ auth: { api_key: process.env.Mail_API } })
);

// -----------------------------
// Controller functions
// -----------------------------

// ✅ Add Food Donation
const addfood = async (req, res, next) => {
  const {
    funcname,
    name,
    mobile,
    description,
    quantity,
    foodtype,
    cookedtime,
    expirytime,
    address,
    city,
    state,
    lat,
    lng,
  } = req.body;

  try {
    const createdFood = new Food({
      donor: req.userData.userId, // from JWT
      funcname,
      name,
      mobile,
      description,
      quantity,
      foodtype,
      cookedtime,
      expirytime,
      address,
      city,
      state,
      lat,
      lng,
      status: "Pending",
      datetime: new Date().toISOString(),
      images: [],
    });

    await createdFood.save();
    res.status(201).json({ food: createdFood.toObject({ getters: true }) });
  } catch (err) {
    console.error("Error saving food:", err.message);
    return next(new HttpError("Adding Food failed: " + err.message, 500));
  }
};

// ✅ View Donations of Logged-in Donor
const viewDonatedFood = async (req, res, next) => {
  try {
    const donorId = req.userData.userId;
    if (!donorId) return next(new HttpError("Unauthorized", 401));

    const foods = await Food.find({ donor: donorId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, foods });
  } catch (err) {
    console.error("Error fetching donated food:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get All Pending Foods
const getPendingFoods = async (req, res, next) => {
  try {
    const foods = await Food.find({ status: "Pending" }).populate(
      "donor",
      "name email mobile"
    );
    console.log("Pending foods:", foods); // debug
    res.json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Available Foods (Pending)
const getFood = async (req, res, next) => {
  try {
    const foods = await Food.find({ status: "Pending" }).populate(
      "donor",
      "name email mobile"
    );
    if (!foods || foods.length === 0) {
      return res.json({ message: "No available food donations." });
    }
    res.json(foods.map((food) => food.toObject({ getters: true })));
  } catch (err) {
    return next(new HttpError("Fetching foods failed, please try again later.", 500));
  }
};

// ✅ Accept Food
const acceptfood = async (req, res, next) => {
  const { foodId } = req.body;

  try {
    const food = await Food.findById(foodId);
    if (!food) return next(new HttpError("Food not found.", 404));
    if (food.status !== "Pending")
      return next(new HttpError("Food already accepted or unavailable.", 400));

    food.recId = req.userData.userId;
    food.status = "Accepted";
    await food.save();

    res.json({ message: "Food accepted successfully.", food: food.toObject({ getters: true }) });
  } catch (err) {
    console.error("Error in acceptfood controller:", err);
    return next(new HttpError("Accepting food failed: " + err.message, 500));
  }
};

// ✅ Get Donation History (Accepted or Delivered)
const getDonationHistory = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const foods = await Food.find({
      recId: userId,
      status: { $in: ["Accepted", "Delivered"] },
    })
      .populate("donor", "name email mobile")
      .sort({ updatedAt: -1 });

    res.status(200).json({ foods });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Failed to fetch donation history", 500));
  }
};

// -----------------------------
// Export all functions
// -----------------------------
module.exports = {
  addfood,
  viewDonatedFood,
  getFood,
  getPendingFoods,
  acceptfood,
  getDonationHistory,
};
