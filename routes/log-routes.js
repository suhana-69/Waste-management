const express = require("express");
const router = express.Router();
const logController = require("../controllers/log-controller");
const checkAuth = require("../middleware/check-auth");

// ✅ All log routes need authentication
router.use(checkAuth);

// Create a donation log (usually when delivery is confirmed)
router.post("/create", logController.createLog);

// Get all logs (for admin/NGO reports)
router.get("/all", logController.getAllLogs);

// Get summary stats (for dashboard charts)
router.get("/summary", logController.getSummary);

module.exports = router;
