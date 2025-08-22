// const HttpError = require("../models/http-error");
// const DonationLog = require("../models/donationLog");
// const User = require("../models/user");
// const Food = require("../models/food");

// // ✅ Create a log entry whenever a donation is completed
// exports.createLog = async (req, res, next) => {
//   const { donor, ngo, volunteer, food, mealsServed, region } = req.body;

//   try {
//     const log = new DonationLog({
//       donor,
//       ngo,
//       volunteer,
//       food,
//       mealsServed,
//       region,
//       status: "Completed"
//     });

//     await log.save();
//     res.status(201).json({ message: "Donation log created", log });
//   } catch (err) {
//     return next(new HttpError("Creating donation log failed", 500));
//   }
// };

// // ✅ Fetch all logs (Admin/NGO reports)
// exports.getAllLogs = async (req, res, next) => {
//   try {
//     const logs = await DonationLog.find()
//       .populate("donor", "fullname email")
//       .populate("ngo", "fullname email")
//       .populate("volunteer", "fullname email")
//       .populate("food", "description quantity foodtype expirytime");

//     res.json({ logs });
//   } catch (err) {
//     return next(new HttpError("Fetching logs failed", 500));
//   }
// };

// // ✅ Get summary statistics (for charts)
// exports.getSummary = async (req, res, next) => {
//   try {
//     const totalDonations = await DonationLog.countDocuments();
//     const totalMeals = await DonationLog.aggregate([
//       { $group: { _id: null, total: { $sum: "$mealsServed" } } }
//     ]);

//     const regionStats = await DonationLog.aggregate([
//       { $group: { _id: "$region", count: { $sum: 1 } } }
//     ]);

//     res.json({
//       totalDonations,
//       totalMeals: totalMeals.length > 0 ? totalMeals[0].total : 0,
//       regionStats
//     });
//   } catch (err) {
//     return next(new HttpError("Fetching summary failed", 500));
//   }
// };
