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

// ✅ Add Food Donation
const addfood = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    funcname,
    name,
    mobile,
    description,
    quantity,
    quality,
    foodtype,
    cookedtime,
    expirytime,
    address,
    city,
    state,
    lat,
    lng,
    Url,
  } = req.body;

  const datetime = new Date().toLocaleString();

  const addedFood = new Food({
    userId: req.userData.userId,
    recId: null,
    funcname,
    name,
    mobile,
    description,
    quantity,
    quality,
    foodtype,
    cookedtime,
    expirytime,
    status: true,
    received: false,
    address,
    city,
    state,
    lat,
    lng,
    Url,
    datetime,
  });

  try {
    await addedFood.save();
  } catch (err) {
    return next(new HttpError("Adding Food failed, please try again later.", 500));
  }

  res.status(201).json(addedFood.toObject({ getters: true }));
};

// ✅ Get Available Food (not expired, not taken)
const getFood = async (req, res, next) => {
  try {
    const foods = await Food.find({
      status: true,
      received: false,
      expirytime: { $gt: new Date() },
    }).select("-datetime");

    res.json({ foods: foods.map((food) => food.toObject({ getters: true })) });
  } catch (err) {
    return next(new HttpError("Fetching food failed, please try again later.", 500));
  }
};

// ✅ View Single Food
const viewfood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.body.foodId).select("-datetime");
    if (!food) return next(new HttpError("Food not found.", 404));

    res.json(food.toObject({ getters: true }));
  } catch (err) {
    return next(new HttpError("Fetching food failed, please try again later.", 500));
  }
};

// ✅ Delete Food (only owner can delete)
const deletefood = async (req, res, next) => {
  try {
    const food = await Food.findOne({
      _id: req.body.foodId,
      userId: req.userData.userId,
    });
    if (!food) return next(new HttpError("Not authorized to delete this food.", 403));

    await food.deleteOne();
    res.json({ message: "Food deleted successfully." });
  } catch (err) {
    return next(new HttpError("Deleting food failed, please try again later.", 500));
  }
};

// ✅ Accept Food
const acceptfood = async (req, res, next) => {
  const { donId, foodId, name, email, mobile, address, exptime } = req.body;

  try {
    const food = await Food.findById(foodId);
    const donator = await User.findById(donId);
    const receiver = await User.findById(req.userData.userId);

    if (!food || !donator || !receiver) {
      return next(new HttpError("Invalid data for accepting food.", 422));
    }

    food.status = false;
    food.recId = req.userData.userId;

    const receive = new Receive({
      donId,
      foodId,
      recId: req.userData.userId,
      name,
      email,
      mobile,
      address,
      exptime,
    });

    await receive.save();
    await food.save();

    // Email Notifications
    transporter.sendMail({
      to: donator.email,
      from: "we-dont-waste-food@king.buzz",
      subject: `${receiver.fullname} has requested ${food.name}`,
      html: `<h1>${receiver.fullname} requested ${food.name}</h1>
             <img src="${food.Url}" width="200" height="200"/>
             <p>Pickup time: ${exptime}</p>`,
    });

    transporter.sendMail({
      to: receiver.email,
      from: "we-dont-waste-food@king.buzz",
      subject: `Request confirmed for ${food.name}`,
      html: `<h1>You successfully requested ${food.name} from ${donator.fullname}</h1>`,
    });

    res.json(receive.toObject({ getters: true }));
  } catch (err) {
    return next(new HttpError("Accepting food failed, please try again later.", 500));
  }
};

// ✅ View Donated Foods
const viewdonatedfood = async (req, res, next) => {
  try {
    const foods = await Food.find({ userId: req.userData.userId });
    res.json({ foods: foods.map((food) => food.toObject({ getters: true })) });
  } catch (err) {
    return next(new HttpError("Fetching food failed, please try again later.", 500));
  }
};

// ✅ View Received Foods
const viewreceivedfood = async (req, res, next) => {
  try {
    const foods = await Food.find({ recId: req.userData.userId });
    res.json({ foods: foods.map((food) => food.toObject({ getters: true })) });
  } catch (err) {
    return next(new HttpError("Fetching food failed, please try again later.", 500));
  }
};

// ✅ Confirm Food Received
const receivedfood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.body.foodId);
    if (!food) return next(new HttpError("Food not found.", 404));

    const receiver = await User.findById(food.recId);
    const donator = await User.findById(food.userId);

    food.received = true;
    await food.save();

    // Notify both parties
    transporter.sendMail({
      to: donator.email,
      from: "we-dont-waste-food@king.buzz",
      subject: `Pickup confirmed for ${food.name}`,
      html: `<h1>${receiver.fullname} collected ${food.name}</h1>`,
    });

    transporter.sendMail({
      to: receiver.email,
      from: "we-dont-waste-food@king.buzz",
      subject: `Pickup confirmed`,
      html: `<h1>${donator.fullname} confirmed you collected ${food.name}</h1>`,
    });

    res.json({ message: "Food marked as received." });
  } catch (err) {
    return next(new HttpError("Marking food as received failed.", 500));
  }
};

// ✅ Cancel Food Request
const cancelledfood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.body.foodId);
    if (!food) return next(new HttpError("Food not found.", 404));

    const receiver = await User.findById(food.recId);
    const donator = await User.findById(food.userId);

    await Receive.deleteOne({ foodId: req.body.foodId });

    food.recId = null;
    food.status = true;
    await food.save();

    transporter.sendMail({
      to: donator.email,
      from: "we-dont-waste-food@king.buzz",
      subject: `Request for ${food.name} rejected`,
      html: `<h1>You rejected ${receiver.fullname}'s request for ${food.name}</h1>`,
    });

    transporter.sendMail({
      to: receiver.email,
      from: "we-dont-waste-food@king.buzz",
      subject: `Your request was rejected`,
      html: `<h1>${donator.fullname} rejected your request for ${food.name}</h1>
             <p>Reason: ${req.body.rejmessage || "Not specified"}</p>`,
    });

    res.json({ message: "Food request cancelled." });
  } catch (err) {
    return next(new HttpError("Cancelling food failed.", 500));
  }
};

// ✅ Top Contributors
const contributors = async (req, res, next) => {
  try {
    const Don = [];
    const Rec = [];

    const donator = await Receive.aggregate([
      { $group: { _id: "$donId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    for (let i = 0; i < donator.length && i < 3; i++) {
      let don = await User.findById(donator[i]._id);
      Don.push({ don, count: donator[i].count });
    }

    const receiver = await Receive.aggregate([
      { $group: { _id: "$recId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    for (let i = 0; i < receiver.length && i < 3; i++) {
      let rec = await User.findById(receiver[i]._id);
      Rec.push({ rec, count: receiver[i].count });
    }

    res.json({ Don, Rec });
  } catch (err) {
    return next(new HttpError("Fetching contributors failed.", 500));
  }
};

exports.addfood = addfood;
exports.getFood = getFood;
exports.viewfood = viewfood;
exports.deletefood = deletefood;
exports.acceptfood = acceptfood;
exports.viewdonatedfood = viewdonatedfood;
exports.viewreceivedfood = viewreceivedfood;
exports.receivedfood = receivedfood;
exports.cancelledfood = cancelledfood;
exports.contributors = contributors;
