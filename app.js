// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const HttpError = require('./models/http-error');

// ✅ Import routes
const authRoutes = require('./routes/auth-routes');
const foodRoutes = require('./routes/food-routes');
const volunteerRoutes = require('./routes/volunteer-routes');
const feedbackRoutes = require('./routes/feedback-routes');
const receiveRoutes = require('./routes/receive-routes');
const paymentRoute = require("./routes/payment");
const app = express();

// ---------------------------
// Middleware
// ---------------------------

// Parse incoming JSON
app.use(express.json());

// Setup CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://we-dont-waste-food.herokuapp.com',
  'https://we-dont-waste-food.herokuapp.com',
  'https://api.cloudinary.com/v1_1/wdwfsdp/image/upload'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error('CORS policy does not allow access from this origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// ---------------------------
// Routes
// ---------------------------

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/receive', receiveRoutes);
app.use("/api/payment", paymentRoute);
// Simple root route
app.get('/', (req, res) => {
  res.send('API is running...');
});
 
app.post('/api/contact', (req, res) => {
  console.log('📩 New Contact Message:', req.body);
  res.json({ success: true, message: 'Message received!' });
});


// ---------------------------
// 404 Handler
// ---------------------------
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  next(error);
});

// ---------------------------
// Global Error Handler
// ---------------------------
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// ---------------------------
// Serve Frontend in Production
// ---------------------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// ---------------------------
// Connect to MongoDB and Start Server
// ---------------------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
