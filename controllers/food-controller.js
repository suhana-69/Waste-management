const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require("dotenv").config();

const HttpError = require("../models/http-error");
const Food = require("../models/food");
const Receive = require("../models/receive");
const User = require("../models/user");

const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.Mail_API,
    },
  })
);

const getPendingFoods = async (req, res) => {
  try {
    const foods = await Food.find({ status: "Pending" })
      .populate("donor", "name email mobile"); // fetch donor info
    res.json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// ✅ Add Food Donation
const addfood = async (req, res, next) => {
  const {
    funcname,
    name,
    mobile,
    description,
    quantity,
    foodtype,
    cookedtime,
    expirytime,
    address,
    city,
    state,
    lat,
    lng
  } = req.body;

  try {
    const createdFood = new Food({
      donor: req.userData.userId,   // from JWT
      recId: req.userData.userId,   // required
      funcname,
      name,
      mobile,
      description,
      quantity,
      foodtype,
      cookedtime,
      expirytime,
      address,
      city,
      state,
      lat,
      lng,
      status: "Pending",
      datetime: new Date().toISOString(),
      images: [] // keep empty since we don’t want images
    });

    await createdFood.save();

    res.status(201).json({ food: createdFood.toObject({ getters: true }) });
  } catch (err) {
    console.error("Error saving food:", err.message);
    return next(new HttpError("Adding Food failed: " + err.message, 500));
  }
};



// ✅ Get Available Food (not expired, not taken)
const getFood = async (req, res, next) => {
  let foods;
  try {
    foods = await Food.find({ status: "Pending" }).populate("donor", "fullname email mobile");
  } catch (err) {
    return next(new HttpError("Fetching foods failed, please try again later.", 500));
  }

  if (!foods || foods.length === 0) {
    return res.json({ message: "No available food donations." });
  }

  res.json(foods.map((food) => food.toObject({ getters: true })));
};


// ✅ View Single Food
// const viewfood = async (req, res, next) => {
//   try {
//     const food = await Food.findById(req.body.foodId).select("-datetime");
//     if (!food) return next(new HttpError("Food not found.", 404));

//     res.json(food.toObject({ getters: true }));
//   } catch (err) {
//     return next(new HttpError("Fetching food failed, please try again later.", 500));
//   }
// };

// ✅ Delete Food (only owner can delete)
// const deletefood = async (req, res, next) => {
//   try {
//     const food = await Food.findOne({
//       _id: req.body.foodId,
//       userId: req.userData.userId,
//     });
//     if (!food) return next(new HttpError("Not authorized to delete this food.", 403));

//     await food.deleteOne();
//     res.json({ message: "Food deleted successfully." });
//   } catch (err) {
//     return next(new HttpError("Deleting food failed, please try again later.", 500));
//   }
// };

// ✅ Accept Food
const acceptfood = async (req, res, next) => {
  console.log("Accept food called by:", req.userData.userId, "foodId:", req.body.foodId);

  const { foodId } = req.body;

  let food;
  try {
    food = await Food.findById(foodId);
    if (!food) {
      console.log("❌ Food not found");
      return next(new HttpError("Food not found.", 404));
    }
    console.log("✅ Food found:", food);

    if (food.status !== "Pending") {
      console.log("❌ Food already accepted or not pending");
      return next(new HttpError("Food is already accepted or not available.", 400));
    }

    food.recId = req.userData.userId;
    food.status = "Accepted";

    console.log("🔹 Saving food...");
    await food.save();
    console.log("✅ Food saved successfully");

  } catch (err) {
    console.error("❌ Error in acceptfood controller:", err);
    return next(new HttpError("Accepting food failed: " + err.message, 500));
  }

  res.json({ message: "Food accepted successfully.", food: food.toObject({ getters: true }) });
};
;



// ✅ View donations of the logged-in donor
const viewDonatedFood = async (req, res) => {
  console.log("viewdonatedfood called!");
  console.log("Donor ID from JWT:", req.userData.userId);

  try {
    // req.user comes from your auth middleware (JWT decoded user)
    const donorId = req.userData.userId; // same as addfood


    const foods = await Food.find({ donor: donorId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, foods });
  } catch (err) {
    console.error("Error fetching donated food:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// ✅ View Received Foods
// const viewreceivedfood = async (req, res, next) => {
//   try {
//     const foods = await Food.find({ recId: req.userData.userId });
//     res.json({ foods: foods.map((food) => food.toObject({ getters: true })) });
//   } catch (err) {
//     return next(new HttpError("Fetching food failed, please try again later.", 500));
//   }
// };

// ✅ Confirm Food Received
// const receivedfood = async (req, res, next) => {
//   try {
//     const food = await Food.findById(req.body.foodId);
//     if (!food) return next(new HttpError("Food not found.", 404));

//     const receiver = await User.findById(food.recId);
//     const donator = await User.findById(food.userId);

//     food.received = true;
//     await food.save();

//     // Notify both parties
//     transporter.sendMail({
//       to: donator.email,
//       from: "we-dont-waste-food@king.buzz",
//       subject: `Pickup confirmed for ${food.name}`,
//       html: `<h1>${receiver.fullname} collected ${food.name}</h1>`,
//     });

//     transporter.sendMail({
//       to: receiver.email,
//       from: "we-dont-waste-food@king.buzz",
//       subject: `Pickup confirmed`,
//       html: `<h1>${donator.fullname} confirmed you collected ${food.name}</h1>`,
//     });

//     res.json({ message: "Food marked as received." });
//   } catch (err) {
//     return next(new HttpError("Marking food as received failed.", 500));
//   }
// };

// ✅ Cancel Food Request
// const cancelledfood = async (req, res, next) => {
//   try {
//     const food = await Food.findById(req.body.foodId);
//     if (!food) return next(new HttpError("Food not found.", 404));

//     const receiver = await User.findById(food.recId);
//     const donator = await User.findById(food.userId);

//     await Receive.deleteOne({ foodId: req.body.foodId });

//     food.recId = null;
//     food.status = true;
//     await food.save();

//     transporter.sendMail({
//       to: donator.email,
//       from: "we-dont-waste-food@king.buzz",
//       subject: `Request for ${food.name} rejected`,
//       html: `<h1>You rejected ${receiver.fullname}'s request for ${food.name}</h1>`,
//     });

//     transporter.sendMail({
//       to: receiver.email,
//       from: "we-dont-waste-food@king.buzz",
//       subject: `Your request was rejected`,
//       html: `<h1>${donator.fullname} rejected your request for ${food.name}</h1>
//              <p>Reason: ${req.body.rejmessage || "Not specified"}</p>`,
//     });

//     res.json({ message: "Food request cancelled." });
//   } catch (err) {
//     return next(new HttpError("Cancelling food failed.", 500));
//   }
// };

// ✅ Top Contributors
// const contributors = async (req, res, next) => {
//   try {
//     const Don = [];
//     const Rec = [];

//     const donator = await Receive.aggregate([
//       { $group: { _id: "$donId", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//     ]);

//     for (let i = 0; i < donator.length && i < 3; i++) {
//       let don = await User.findById(donator[i]._id);
//       Don.push({ don, count: donator[i].count });
//     }

//     const receiver = await Receive.aggregate([
//       { $group: { _id: "$recId", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//     ]);

//     for (let i = 0; i < receiver.length && i < 3; i++) {
//       let rec = await User.findById(receiver[i]._id);
//       Rec.push({ rec, count: receiver[i].count });
//     }

//     res.json({ Don, Rec });
//   } catch (err) {
//     return next(new HttpError("Fetching contributors failed.", 500));
//   }
// };

// exports.addfood = addfood;
// exports.getFood = getFood;
// // exports.viewfood = viewfood;
// // exports.deletefood = deletefood;
// exports.acceptfood = acceptfood;
//  exports.viewdonatedfood = viewDonatedFood;
// // exports.viewreceivedfood = viewreceivedfood;
// // exports.receivedfood = receivedfood;
// // exports.cancelledfood = cancelledfood;
// // exports.contributors = contributors;
// module.exports = { getPendingFoods };


module.exports = {
  addfood,
  getFood,
  acceptfood,
  viewDonatedFood,
  getPendingFoods
};

