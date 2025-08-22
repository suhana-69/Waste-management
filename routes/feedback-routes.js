const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback-controller");
const checkAuth = require("../middleware/check-auth");

// ✅ All feedback routes require authentication
router.use(checkAuth);

// Add feedback (Donor/NGO/Volunteer/Beneficiary)
router.post("/add", feedbackController.addFeedback);

// Get feedback for a specific food donation
router.get("/food/:foodId", feedbackController.getFeedbackForFood);


module.exports = router;
