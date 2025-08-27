// fixReceiveRecords.js
const mongoose = require("mongoose");
require("dotenv").config();
const Receive = require("./models/receive");
const User = require("./models/user");
const Food = require("./models/food");

const MONGO_URL = process.env.MONGO_URL || "your_mongodb_connection_string";

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

async function fixRecords() {
  try {
    const receives = await Receive.find();
    console.log(`Found ${receives.length} receive records`);

    for (let r of receives) {
      let updated = false;

      // Check donor
      if (!r.donor || !(await User.findById(r.donor))) {
        console.log(`⚠️ Missing or invalid donor for Receive ID: ${r._id}`);
        // Optionally assign a default donor ID if you have one:
        // r.donor = "some_valid_donor_id";
        updated = true;
      }

      // Check food
      if (!r.food || !(await Food.findById(r.food))) {
        console.log(`⚠️ Missing or invalid food for Receive ID: ${r._id}`);
        // Optionally assign a default food ID if you have one:
        // r.food = "some_valid_food_id";
        updated = true;
      }

      // Check receiver
      if (!r.receiver || !(await User.findById(r.receiver))) {
        console.log(`⚠️ Missing or invalid receiver for Receive ID: ${r._id}`);
        updated = true;
      }

      if (updated) {
        // Option 1: Save record if you assigned defaults
        // await r.save();

        // Option 2: Just flag/log for manual inspection
        console.log(`🔹 Receive record ${r._id} needs attention`);
      }
    }

    console.log("✅ Done scanning all receive records");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing records:", err);
    process.exit(1);
  }
}

fixRecords();
