// routes/food-routes.js
const express = require("express");
const foodController = require("../controllers/food-controller");
const Authenticate = require("../middleware/check-auth");

const router = express.Router();

// Donate food
router.post("/donate", Authenticate, foodController.addfood);

// Get available food
router.get("/request", foodController.getFood);

// Delete food
router.delete("/deletefood", Authenticate, foodController.deletefood);

// View specific food
router.post("/viewfood", Authenticate, foodController.viewfood);

// Accept food
router.post("/acceptfood", Authenticate, foodController.acceptfood);

// View donated foods
router.post("/viewdonatedfood", Authenticate, foodController.viewdonatedfood);

// View received foods
router.post("/viewreceivedfood", Authenticate, foodController.viewreceivedfood);

// Donor side open view
// router.post("/openviewdonatefood", Authenticate, foodController.openviewdonatefood);

// // Receiver side open view
// router.post("/openviewreceivedfood", Authenticate, foodController.openviewreceivedfood);

// Mark as received
router.post("/receivedfood", Authenticate, foodController.receivedfood);

// Cancel food request
router.post("/cancelledfood", Authenticate, foodController.cancelledfood);

// Contributors ranking
router.get("/contributors", foodController.contributors);

module.exports = router;
