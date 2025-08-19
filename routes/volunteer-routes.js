const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteer-controller");
const checkAuth = require("../middleware/check-auth");

// ✅ All routes need authentication
router.use(checkAuth);

// Assign volunteer (NGO/Admin only)
router.post("/assign", volunteerController.assignVolunteer);

// Volunteer updates status
router.post("/update-status", volunteerController.updateStatus);

// Volunteer views their tasks
router.get("/my-tasks", volunteerController.getMyTasks);

module.exports = router;
