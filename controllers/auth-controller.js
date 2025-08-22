const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const HttpError = require("../models/http-error");
const User = require("../models/user");

const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.Mail_API,
    },
  })
);

// ✅ Signup
const signup = async (req, res, next) => {
  console.log("Request Body:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation Errors:", errors.array());
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }

  const {
    fullname,
    email,
    password,
    mobile = "",
    gender = "",
    type,
    address = "",
    city = "",
    state = "",
    url = "",
    donorDetails = {},
    ngoDetails = {},
    volunteerDetails = {},
  } = req.body;

  const datetime = new Date().toISOString();

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.error("DB lookup failed:", err);
    return next(new HttpError("Signing up failed, please try again later.", 500));
  }

  if (existingUser) {
    return next(new HttpError("User exists already, please login instead.", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.error("Password hashing failed:", err.message);
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  const createdUser = new User({
    fullname,
    email,
    password: hashedPassword,
    mobile,
    gender,
    type,
    address,
    city,
    state,
    url,
    datetime,
    donorDetails: type === "Donor" ? donorDetails : undefined,
    ngoDetails: type === "NGO" ? ngoDetails : undefined,
    volunteerDetails: type === "Volunteer" ? volunteerDetails : undefined,
  });

  try {
    await createdUser.save();
    console.log("User created:", createdUser);
  } catch (err) {
    console.error("User save failed:", err.message);
    return next(new HttpError("Signing up failed, please try again later.", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email, type: createdUser.type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.error("JWT signing failed:", err.message);
    return next(new HttpError("Signing up failed, please try again later.", 500));
  }

  // Optional: send welcome email (fails silently)
  try {
    await transporter.sendMail({
      to: createdUser.email,
      from: "we-dont-waste-food@king.buzz",
      subject: "Registration Successful",
      html: "<h1>Welcome to We Don't Waste Food</h1>",
    });
  } catch (err) {
    console.warn("Email send failed:", err.message);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    type: createdUser.type,
    token,
  });
};

// ✅ Login
// AuthController.js
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    console.log("User type at login:", existingUser?.type); // ← Add this line
  } catch (err) {
    return res.status(500).json({ error: "Database lookup failed" });
  }

  if (!existingUser) {
    return res.status(403).json({ error: "Invalid credentials" });
  }

  // Compare hashed password
  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword) {
    return res.status(403).json({ error: "Invalid credentials" });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email, type: existingUser.type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res.status(500).json({ error: "Token generation failed" });
  }

  res.status(200).json({
    userId: existingUser._id,
    email: existingUser.email,
    type: existingUser.type,
    token
  });
};







// ✅ View Profile
const viewProfile = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.error("Fetch user failed:", err);
    return next(new HttpError("Fetching user failed, please try again later.", 500));
  }

  if (!user) {
    return next(new HttpError("User not found.", 404));
  }

  res.json({
    fullname: user.fullname,
    email: user.email,
    mobile: user.mobile,
    gender: user.gender,
    type: user.type,
    address: user.address,
    city: user.city,
    state: user.state,
    url: user.url,
    donorDetails: user.donorDetails,
    ngoDetails: user.ngoDetails,
    volunteerDetails: user.volunteerDetails,
  });
};


module.exports = {
  signup,
  login,
  viewProfile,
};