const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const authController = require("../controllers/auth-controller");
const signupValidation = require("../middleware/signup-validation");

// 🔹 Signup with validation
router.post("/signup", signupValidation, authController.signup);

// 🔹 Login
router.post("/login", authController.login);

// 🔹 Profile (protected route)
router.get("/profile", checkAuth, authController.viewProfile);

module.exports = router;
