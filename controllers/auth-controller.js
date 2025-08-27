// controllers/auth-controller.js
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const HttpError = require("../models/http-error");
const User = require("../models/user");

// ✅ Setup Nodemailer with SendGrid
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: { api_key: process.env.Mail_API },
  })
);

// ✅ Signup
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    name,
    email,
    password,
    mobile = "",
    gender = "",
    role,
    address = "",
    city = "",
    state = "",
    url = "",
    donorDetails = {},
    ngoDetails = {},
    volunteerDetails = {},
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError("User exists already, please login instead.", 422));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      gender,
      role,
      address,
      city,
      state,
      url,
      donorDetails: role === "donor" ? donorDetails : undefined,
      ngoDetails: role === "ngo" ? ngoDetails : undefined,
      volunteerDetails: role === "volunteer" ? volunteerDetails : undefined,
    });

    await createdUser.save();

    // JWT Token
    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email, role: createdUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Optional: send welcome email (will not block signup)
    try {
      await transporter.sendMail({
        to: createdUser.email,
        from: "we-dont-waste-food@king.buzz", // make sure this is verified
        subject: "Registration Successful",
        html: "<h1>Welcome to We Don't Waste Food</h1>",
      });
    } catch (err) {
      console.warn("Email send failed (non-blocking):", err.message);
    }

    // ✅ Return user object for frontend role-based navigation
    res.status(201).json({
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
      token,
    });

  } catch (err) {
    console.error("Signup failed:", err.message);
    return next(new HttpError("Signing up failed, please try again later.", 500));
  }
};

// ✅ Login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login failed:", err.message);
    res.status(500).json({ error: "Login failed, please try again later." });
  }
};

// ✅ View Profile
const viewProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userData.userId);
    if (!user) return next(new HttpError("User not found.", 404));

    res.json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      role: user.role,
      address: user.address,
      city: user.city,
      state: user.state,
      url: user.url,
      donorDetails: user.donorDetails,
      ngoDetails: user.ngoDetails,
      volunteerDetails: user.volunteerDetails,
    });
  } catch (err) {
    console.error("Fetch profile failed:", err.message);
    return next(new HttpError("Fetching user failed, please try again later.", 500));
  }
};

module.exports = {
  signup,
  login,
  viewProfile,
};
