const HttpError = require("../models/http-error");
const Receive = require("../models/receive");

// 📌 NGO accepts a food donation (creates receive record)
const createReceive = async (req, res, next) => {
  const { donor, food, receiver, volunteer, name, email, mobile, address, exptime } = req.body;

  let receive;
  try {
    receive = new Receive({
      donor,
      food,
      receiver,
      volunteer,
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

// 📌 Get receives for logged-in NGO
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

// 📌 Update receive status (volunteer/NGO updates)
const updateStatus = async (req, res, next) => {
  const { receiveId, status } = req.body;

  let receive;
  try {
    receive = await Receive.findById(receiveId);
    if (!receive) return next(new HttpError("Receive record not found.", 404));

    receive.status = status;

    if (status === "Picked") receive.pickedAt = new Date();
    if (status === "Delivered") receive.deliveredAt = new Date();

    await receive.save();
  } catch (err) {
    return next(new HttpError("Updating status failed, please try again.", 500));
  }

  res.json({ message: "Status updated successfully.", receive });
};

module.exports = {
  createReceive,
  getMyReceives,
  updateStatus,
};
