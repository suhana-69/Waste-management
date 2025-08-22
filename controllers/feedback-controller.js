const HttpError = require("../models/http-error");
const Feedback = require("../models/feedback");
const Food = require("../models/food");
const User = require("../models/user");

// ✅ Add feedback for a donation
exports.addFeedback = async (req, res, next) => {
  const { foodId, rating, comment } = req.body;

  try {
    const food = await Food.findById(foodId);
    if (!food) return next(new HttpError("Food donation not found", 404));

    const feedback = new Feedback({
      user: req.userData.userId, // who is giving feedback
      food: foodId,
      role: req.userData.type,   // Donor, NGO, Volunteer, Beneficiary
      rating,
      comment
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (err) {
    return next(new HttpError("Adding feedback failed", 500));
  }
};

// ✅ Get feedback for a specific food donation
exports.getFeedbackForFood = async (req, res, next) => {
  const { foodId } = req.params;

  try {
    const feedbacks = await Feedback.find({ food: foodId })
      .populate("user", "fullname email type");

    res.json({ feedbacks });
  } catch (err) {
    return next(new HttpError("Fetching feedback failed", 500));
  }
};

