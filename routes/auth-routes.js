const express = require("express");
const authController = require("../controllers/auth-controller");
const signupValidation = require("../middleware/signup-validation");

const router = express.Router();

router.post("/signup", signupValidation, authController.signup);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);
router.post("/new-password", authController.newPassword);

module.exports = router;
