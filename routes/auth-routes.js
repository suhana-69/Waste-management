const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const authController = require("../controllers/auth-controller");
const signupValidation = require("../middleware/signup-validation");

//const router = express.Router();

router.post("/signup", signupValidation, authController.signup);
router.post("/login", authController.login);
router.get("/profile", checkAuth, authController.viewProfile);

module.exports = router;