const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food-controller");
const checkAuth = require("../middleware/check-auth"); // import middleware

router.post("/addfood", checkAuth, foodController.addfood);
router.get("/foods", checkAuth, foodController.getFood);
router.post("/acceptfood", checkAuth, foodController.acceptfood); // ✅ add checkAuth
router.get("/donor-foods", checkAuth, foodController.viewDonatedFood);
router.get("/pending-foods", checkAuth, foodController.getPendingFoods);
// Get donation history (Accepted or Delivered)
router.get("/donation-history", checkAuth, foodController.getDonationHistory);

module.exports = router;
