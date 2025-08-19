require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const HttpError = require('./models/http-error');

// Import routes
const authRoutes = require('./routes/auth-routes');
const foodRoutes = require('./routes/food-routes');
const volunteerRoutes = require('./routes/volunteer-routes');
const feedbackRoutes = require('./routes/feedback-routes');
const inventoryRoutes = require('./routes/inventory-routes');
const logRoutes = require('./routes/log-routes');
const notificationRoutes = require('./routes/notification-routes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
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
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  return next(error);
});

// Global error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ Database connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
