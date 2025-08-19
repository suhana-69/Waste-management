const express = require("express");
const adminController = require("../controllers/admin-controller");
const Authenticate = require("../middleware/check-auth");
const checkAdmin = require("../middleware/check-admin"); // custom middleware

const router = express.Router();

// ✅ User Management
router.get("/users", Authenticate, checkAdmin, adminController.getAllUsers);
router.put("/approve-ngo/:userId", Authenticate, checkAdmin, adminController.approveNGO);
router.delete("/delete-user/:userId", Authenticate, checkAdmin, adminController.deleteUser);

// ✅ Food/Donation Oversight
router.get("/all-donations", Authenticate, checkAdmin, adminController.getAllDonations);
router.get("/expired-foods", Authenticate, checkAdmin, adminController.getExpiredFoods);

// ✅ Feedback & Reports
router.get("/feedbacks", Authenticate, checkAdmin, adminController.getAllFeedbacks);
router.delete("/feedback/:feedbackId", Authenticate, checkAdmin, adminController.deleteFeedback);

// ✅ System Analytics
router.get("/stats", Authenticate, checkAdmin, adminController.getStats);

module.exports = router;
