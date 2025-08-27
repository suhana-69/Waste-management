const HttpError = require("../models/http-error");
const Receive = require("../models/receive");
const User = require("../models/user");

// ✅ Assign a volunteer
exports.assignVolunteer = async (req, res, next) => {
  const { receiveId, volunteerId } = req.body;

  try {
    const receive = await Receive.findById(receiveId);
    if (!receive) return next(new HttpError("Receive record not found", 404));

    const volunteer = await User.findById(volunteerId);
    if (!volunteer || volunteer.role !== "volunteer") {
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

// ✅ Volunteer updates status
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

// ✅ Volunteer sees tasks assigned to them
exports.getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Receive.find({ volunteer: req.userData.userId })
      .populate("food", "title description location")
      .populate("donor", "fullname email mobile")
      .populate("receiver", "fullname email mobile");

    res.json({ tasks });
  } catch (err) {
    return next(new HttpError("Fetching volunteer tasks failed", 500));
  }
};

// ✅ Volunteer sees delivered tasks
exports.getDeliveredTasks = async (req, res, next) => {
  try {
    const delivered = await Receive.find({
      volunteer: req.userData.userId,
      status: "Delivered"
    })
      .populate("food", "title description location")
      .populate("donor", "fullname email mobile")
      .populate("receiver", "fullname email mobile");

    res.json({ delivered });
  } catch (err) {
    return next(new HttpError("Fetching delivered tasks failed", 500));
  }
};
// Get all available (unassigned) tasks
// Get all available (unassigned) tasks
// Get all available (unassigned) tasks
exports.getAvailableTasks = async (req, res, next) => {
  try {
    const tasks = await Receive.find({
      volunteer: null,     // only unassigned
      status: "Accepted"   // only accepted donations
    })
    .populate("food", "title description location")
    .populate("donor", "fullname email mobile")
    .populate("receiver", "fullname email mobile");

    res.json({ tasks }); // <-- return JSON object
  } catch (err) {
    console.error(err);
    return next(new HttpError("Fetching available tasks failed", 500));
  }
};


// Pick a task (assign to the logged-in volunteer)
exports.pickTask = async (req, res, next) => {
  const { taskId } = req.body;

  try {
    const task = await Receive.findById(taskId);
    if (!task) return next(new HttpError("Task not found", 404));
    if (task.volunteer) return next(new HttpError("Task already picked", 400));

    // Assign volunteer and update status
    task.volunteer = req.userData.userId;
    task.status = "Assigned";
    await task.save();

    // Populate fields for frontend
    const populatedTask = await task
      .populate("food", "title description location")
      .populate("donor", "fullname email mobile")
      .populate("receiver", "fullname email mobile")
      .execPopulate();

    res.status(200).json({ message: "Task successfully picked", task: populatedTask });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Picking task failed", 500));
  }
};

