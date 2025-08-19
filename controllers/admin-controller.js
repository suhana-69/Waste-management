const HttpError = require("../models/http-error");
const User = require("../models/user");
const Food = require("../models/food");
const Feedback = require("../models/feedback");
const Receive = require("../models/receive");

// ✅ Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    res.json({ users });
  } catch (err) {
    return next(new HttpError("Fetching users failed.", 500));
  }
};

// ✅ Approve NGO
const approveNGO = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    let ngo = await User.findById(userId);
    if (!ngo || ngo.type !== "NGO") {
      return next(new HttpError("NGO not found.", 404));
    }
    ngo.ngoDetails.isApproved = true;
    await ngo.save();
    res.json({ message: "NGO approved successfully", ngo });
  } catch (err) {
    return next(new HttpError("Approving NGO failed.", 500));
  }
};

// ✅ Delete User
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    return next(new HttpError("Deleting user failed.", 500));
  }
};

// ✅ All donations
const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Food.find({});
    res.json({ donations });
  } catch (err) {
    return next(new HttpError("Fetching donations failed.", 500));
  }
};

// ✅ Expired foods
const getExpiredFoods = async (req, res, next) => {
  try {
    const now = new Date();
    const expired = await Food.find({ expirytime: { $lt: now } });
    res.json({ expired });
  } catch (err) {
    return next(new HttpError("Fetching expired food failed.", 500));
  }
};

// ✅ All feedbacks
const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({});
    res.json({ feedbacks });
  } catch (err) {
    return next(new HttpError("Fetching feedbacks failed.", 500));
  }
};

// ✅ Delete feedback
const deleteFeedback = async (req, res, next) => {
  try {
    await Feedback.findByIdAndDelete(req.params.feedbackId);
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    return next(new HttpError("Deleting feedback failed.", 500));
  }
};

// ✅ System Stats
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonations = await Food.countDocuments();
    const totalReceived = await Receive.countDocuments();
    const expiredFoods = await Food.countDocuments({ expirytime: { $lt: new Date() } });

    res.json({
      totalUsers,
      totalDonations,
      totalReceived,
      expiredFoods
    });
  } catch (err) {
    return next(new HttpError("Fetching stats failed.", 500));
  }
};

exports.getAllUsers = getAllUsers;
exports.approveNGO = approveNGO;
exports.deleteUser = deleteUser;
exports.getAllDonations = getAllDonations;
exports.getExpiredFoods = getExpiredFoods;
exports.getAllFeedbacks = getAllFeedbacks;
exports.deleteFeedback = deleteFeedback;
exports.getStats = getStats;
