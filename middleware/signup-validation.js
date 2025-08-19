// middleware/signup-validation.js
const { check } = require("express-validator");

const signupValidation = [
  check("fullname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Full name is required."),
  
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email."),
  
  check("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long."),
  
  check("type")
    .not()
    .isEmpty()
    .isIn(["Admin", "Donor", "NGO", "Volunteer"])
    .withMessage("User type must be one of Admin, Donor, NGO, Volunteer."),
  
  check("mobile")
    .not()
    .isEmpty()
    .withMessage("Mobile number is required.")
    .isMobilePhone()
    .withMessage("Please enter a valid mobile number."),
  
  check("gender")
    .not()
    .isEmpty()
    .withMessage("Gender is required."),
  
  check("address")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Address is required."),
  
  check("city")
    .trim()
    .not()
    .isEmpty()
    .withMessage("City is required."),
  
  check("state")
    .trim()
    .not()
    .isEmpty()
    .withMessage("State is required."),
  
  check("url")
    .not()
    .isEmpty()
    .withMessage("URL is required.")
    .isURL()
    .withMessage("Please enter a valid URL."),
];

module.exports = signupValidation;
