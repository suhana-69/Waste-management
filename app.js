// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const HttpError = require('./models/http-error');

// ✅ Import routes
const authRoutes = require('./routes/auth-routes');
const foodRoutes = require('./routes/food-routes');
const volunteerRoutes = require('./routes/volunteer-routes');
const feedbackRoutes = require('./routes/feedback-routes');
const receiveRoutes = require('./routes/receive-routes');
const paymentRoute = require('./routes/payment');
// const chatRoutes = require('./routes/chat-routes');
const app = express();

// ---------------------------
// Middleware
// ---------------------------
app.use(express.json());
app.use(bodyParser.json()); // Optional, in case some routes use it

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
    if (!origin) return callback(null, true); // allow server-to-server
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
app.use('/api/payment', paymentRoute);
// app.use("/api/chat", authRoutes);

// Root Test Route
app.get('/', (req, res) => {
  res.send('🌍 API is running...');
});

// 📩 Contact Form Route
app.post('/api/contact', (req, res) => {
  console.log('📩 Contact form submitted:', req.body);
  res.json({ success: true, message: 'Message received!' });
});

// 🤖 Gemini AI Chatbot Route
// Optional: list available models to find the correct one
// async function listModels() {
//   const models = await genAI.listModels();
//   console.log("Available models:", models);
// }

// listModels();

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ reply: "Message is required." });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userMessage);

    // ✅ Get AI reply from text() or first candidate
    const reply =
      result.response?.text?.() || 
      result.response?.candidates?.[0]?.content || 
      "Sorry, I couldn't generate a response.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    res.status(500).json({ reply: "Sorry, something went wrong while contacting the AI." });
  }
});


// ---------------------------
// 404 Not Found Handler
// ---------------------------
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  next(error);
});

// ---------------------------
// Global Error Handler
// ---------------------------
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred!' });
});

// ---------------------------
// Serve Frontend (in production)
// ---------------------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// ---------------------------
// Start Server
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
