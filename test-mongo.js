// test-mongo.js
const mongoose = require("mongoose");

const uri = "mongodb+srv://SoumyadeepaNayek:prcHzzoW1MiIyaoF@cluster0.czy6p4z.mongodb.net/foodsavior?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    process.exit(0); // exit when success
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // exit with error
  });
