const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Receive = require("../models/receive");
const User = require("../models/user");
const Food = require("../models/food");

// ✅ Assign a volunteer to a food donation (by NGO/Admin)
exports.assignVolunteer = async (req, res, next) => {
  const { receiveId, volunteerId } = req.body;

  try {
    const receive = await Receive.findById(receiveId);
    if (!receive) return next(new HttpError("Receive record not found", 404));

    const volunteer = await User.findById(volunteerId);
    if (!volunteer || volunteer.type !== "Volunteer") {
      return next(new HttpError("Invalid volunteer", 400));
    }

    receive.volunteer = volunteerId;
    receive.status = "Assigned";
    await receive.save();

    res.status(200).json({ message: "Volunteer assigned successfully", receive });
  } catch (err) {
    return next(new HttpError("Assigning volunteer failed", 500));
  }
};

// ✅ Volunteer updates status (Picked → In Transit → Delivered)
exports.updateStatus = async (req, res, next) => {
  const { receiveId, status } = req.body;

  const validStatuses = ["Picked", "In Transit", "Delivered", "Rejected"];
  if (!validStatuses.includes(status)) {
    return next(new HttpError("Invalid status", 400));
  }

  try {
    const receive = await Receive.findById(receiveId).populate("food");
    if (!receive) return next(new HttpError("Receive record not found", 404));

    receive.status = status;

    if (status === "Picked") receive.pickedAt = new Date();
    if (status === "Delivered") receive.deliveredAt = new Date();

    await receive.save();

    res.status(200).json({ message: "Status updated", receive });
  } catch (err) {
    return next(new HttpError("Updating status failed", 500));
  }
};

// ✅ Volunteer sees their assigned tasks
exports.getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Receive.find({ volunteer: req.userData.userId })
      .populate("donor", "fullname email")
      .populate("receiver", "fullname email")
      .populate("food", "description quantity foodtype expirytime");

    res.json({ tasks });
  } catch (err) {
    return next(new HttpError("Fetching volunteer tasks failed", 500));
  }
};
