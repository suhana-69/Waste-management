const express = require("express");
const adminController = require("../controllers/admin-controller");
const Authenticate = require("../middleware/check-auth");
const checkAdmin = require("../middleware/check-admin"); // custom middleware

const router = express.Router();

// ✅ User Management
router.get("/users", Authenticate, checkAdmin, adminController.getAllUsers);
router.put("/approve-ngo/:userId", Authenticate, checkAdmin, adminController.approveNGO);

router.get("/feedbacks", Authenticate, checkAdmin, adminController.getAllFeedbacks);
// ✅ Food/Donation Oversight
router.get("/all-donations", Authenticate, checkAdmin, adminController.getAllDonations);
router.get("/expired-foods", Authenticate, checkAdmin, adminController.getExpiredFoods);



module.exports = router;
