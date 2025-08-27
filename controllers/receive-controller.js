const HttpError = require("../models/http-error");
const Receive = require("../models/receive");

// 📌 NGO accepts a food donation
const createReceive = async (req, res, next) => {
  const { donor, food, receiver, name, email, mobile, address, exptime } = req.body;

  let receive;
  try {
    receive = new Receive({
      donor,
      food,
      receiver,
      name,
      email,
      mobile,
      address,
      exptime
    });
    await receive.save();
  } catch (err) {
    return next(new HttpError("Creating receive record failed, please try again.", 500));
  }

  res.status(201).json({ receive });
};

// 📌 NGO views their received donations
const getMyReceives = async (req, res, next) => {
  let receives;
  try {
    receives = await Receive.find({ receiver: req.userData.userId })
      .populate("food")
      .populate("donor", "fullname email")
      .populate("volunteer", "fullname email");
  } catch (err) {
    return next(new HttpError("Fetching receives failed, please try again.", 500));
  }

  res.json({ receives });
};

module.exports = {
  createReceive,
  getMyReceives
};
