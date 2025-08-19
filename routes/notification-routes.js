const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification-controller");
const checkAuth = require("../middleware/check-auth");

// ✅ All notification routes need authentication
router.use(checkAuth);

// Create new notification
router.post("/create", notificationController.createNotification);

// Get all notifications for user
router.get("/my", notificationController.getMyNotifications);

// Mark notification as read
router.post("/mark-read", notificationController.markAsRead);

// Delete notification
router.delete("/delete", notificationController.deleteNotification);

module.exports = router;
