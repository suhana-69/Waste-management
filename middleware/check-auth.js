const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
require("dotenv").config();

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next(); // Allow preflight
  }

  try {
    const authHeader = req.headers.authorization;
    console.log("🔐 Incoming Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No or invalid Auth header format");
      throw new HttpError("No token provided or invalid format.", 401);
    }

    const token = authHeader.split(" ")[1];
    console.log("📦 Extracted Token:", token);

    // Debug secret value
    console.log("🔑 JWT_SECRET from .env:", process.env.JWT_SECRET);

    // Decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decodedToken);

    req.userData = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      type: decodedToken.type,
    };

    next();
  } catch (err) {
    console.error("❌ JWT Verification Error:", err.message || err);
    return next(new HttpError("Authentication failed!", 403));
  }
};

module.exports = checkAuth;