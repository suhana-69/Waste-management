const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
require("dotenv").config();

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    // Allow preflight CORS requests
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpError("No token provided, authentication failed!", 401);
    }

    const token = authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      throw new HttpError("Invalid token format, authentication failed!", 401);
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // ✅ include role (type) as well
    req.userData = { 
      userId: decodedToken.userId, 
      email: decodedToken.email,
      type: decodedToken.type  // <-- Added user role
    };

    console.log("✅ Middleware Authentication Passed", req.userData);
    next();

  } catch (err) {
    console.error("❌ Authentication Failed:", err.message);
    return next(new HttpError("Authentication failed!", 403));
  }
};

