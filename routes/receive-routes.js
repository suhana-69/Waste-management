const express = require("express");
const router = express.Router();
const receiveController = require("../controllers/receive-controller");
const checkAuth = require("../middleware/check-auth");

// All routes need authentication
router.use(checkAuth);

// NGO accepts a food donation
router.post("/create", receiveController.createReceive);

// NGO views their received donations
router.get("/my-receives", receiveController.getMyReceives);

// Update status (NGO/Volunteer can mark Picked/Delivered)
router.post("/update-status", receiveController.updateStatus);

module.exports = router;
