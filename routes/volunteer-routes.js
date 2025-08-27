const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteer-controller");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

router.post("/assign", volunteerController.assignVolunteer);
router.post("/update-status", volunteerController.updateStatus);
router.get("/my-tasks", volunteerController.getMyTasks);
router.get("/delivered", volunteerController.getDeliveredTasks);
router.get("/available-tasks", volunteerController.getAvailableTasks);
router.post("/pick-task", volunteerController.pickTask);


module.exports = router;
