// backend/routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
require("dotenv").config();

const router = express.Router();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/checkout", async (req, res) => {
  try {
    const options = {
      amount: 5000 * 100, // amount in paise
      currency: "INR",
      receipt: "receipt#1"
    };
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send("Error creating order");
  }
});

module.exports = router;
