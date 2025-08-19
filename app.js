require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const HttpError = require('./models/http-error');
const usersRoutes = require('./routes/user-routes');

const app = express();
app.use(express.json());

// ✅ Enable CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://we-dont-waste-food.herokuapp.com',
  'https://we-dont-waste-food.herokuapp.com',
  'https://api.cloudinary.com/v1_1/wdwfsdp/image/upload'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// ✅ Routes
app.use('/api/users', usersRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// ✅ Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
