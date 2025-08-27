const express = require("express");
const router = express.Router();
const receiveController = require("../controllers/receive-controller");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

// NGO creates a receive record
router.post("/create", receiveController.createReceive);

// NGO views their receives
router.get("/my-receives", receiveController.getMyReceives);

module.exports = router;
