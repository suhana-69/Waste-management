// middleware/signup-validation.js
const { check } = require("express-validator");

const signupValidation = [
  check("name") // ✅ changed from fullname → name
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is required."),

  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email."),

  check("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long."),

  check("role") // ✅ changed from type → role
    .not()
    .isEmpty()
    .isIn(["admin", "donor", "ngo", "volunteer"]) // ✅ match schema enums
    .withMessage("User role must be one of admin, donor, ngo, volunteer."),

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
    .optional() // ✅ allow optional (schema allows url to be empty)
    .isURL()
    .withMessage("Please enter a valid URL."),
];

module.exports = signupValidation;
