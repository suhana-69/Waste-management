const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food-controller");

router.post("/addfood", foodController.addfood);
router.get("/foods", foodController.getFood);
router.post("/acceptfood", foodController.acceptfood);
router.get("/donor-foods", foodController.viewDonatedFood);
router.get("/pending-foods", foodController.getPendingFoods);

module.exports = router;
