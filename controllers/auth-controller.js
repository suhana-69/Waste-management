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
    console.error("Password hashing failed:", err);
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
    donorDetails: type === "Donor" ? donorDetails : {},
    ngoDetails: type === "NGO" ? ngoDetails : {},
    volunteerDetails: type === "Volunteer" ? volunteerDetails : {},
  });

  try {
    await createdUser.save();
    console.log("User created:", createdUser);
  } catch (err) {
    console.error("User save failed:", err);
    return next(new HttpError("Signing up failed, please try again later.", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email, type: createdUser.type },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.error("JWT signing failed:", err);
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
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.error("DB lookup failed:", err);
    return next(new HttpError("Logging in failed, please try again later.", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid credentials, could not log you in.", 403));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError("Could not log you in, please check your credentials and try again.", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials, could not log you in.", 403));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, type: existingUser.type },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Logging in failed, please try again later.", 500));
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    type: existingUser.type,
    token,
  });
};

// ✅ Password Reset Request
const resetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return next(new HttpError("Token creation failed.", 500));
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return next(new HttpError("No user found.", 422));
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600 * 1000; // 1 hour
        return user.save().then(() => {
          return transporter.sendMail({
            to: user.email,
            from: "we-dont-waste-food@king.buzz",
            subject: "Password Reset",
            html: `
              <p>You requested a password reset</p>
              <h4>Click <a href="https://we-dont-waste-food.herokuapp.com/reset-password/${token}">here</a> to reset your password</h4>
            `,
          });
        });
      })
      .then(() => {
        res.json({ message: "Check your email" });
      })
      .catch((err) => {
        console.error("Password reset error:", err);
        return next(new HttpError("Password reset failed.", 500));
      });
  });
};

// ✅ Set New Password
const newPassword = (req, res, next) => {
  const { password: newPassword, token: sentToken } = req.body;

  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return next(new HttpError("Reset link invalid or expired.", 422));
      }
      return bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        return user.save().then(() => {
          res.json({ message: "Password updated successfully" });
        });
      });
    })
    .catch((err) => {
      console.error("New password error:", err);
      return next(new HttpError("Could not reset password, please try again.", 500));
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

// ✅ Edit Profile (Role cannot be changed)
const editProfile = async (req, res, next) => {
  const {
    fullname,
    email,
    mobile,
    gender,
    address,
    city,
    state,
    url,
    donorDetails,
    ngoDetails,
    volunteerDetails,
  } = req.body;

  let user;
  try {
    user = await User.findById(req.userData.userId);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    user.fullname = fullname;
    user.email = email;
    user.mobile = mobile;
    user.gender = gender;
    user.address = address;
    user.city = city;
    user.state = state;
    user.url = url;

    // Update role-specific details only
    if (user.type === "Donor") user.donorDetails = donorDetails;
    if (user.type === "NGO") user.ngoDetails = ngoDetails;
    if (user.type === "Volunteer") user.volunteerDetails = volunteerDetails;

    await user.save();
  } catch (err) {
    console.error("Edit profile failed:", err);
    return next(new HttpError("Editing profile failed, please try again later.", 500));
  }

  res.json({
    fullname: user.fullname,
    email: user.email,
    mobile: user.mobile,
    gender: user.gender,
    type: user.type, // role not editable
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
  resetPassword,
  newPassword,
  viewProfile,
  editProfile,
};
