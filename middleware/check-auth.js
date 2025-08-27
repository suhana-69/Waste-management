const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
require("dotenv").config();

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new HttpError("No token provided or invalid format.", 401));
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role,
    };

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message || err);
    return next(new HttpError("Authentication failed!", 403));
  }
};

module.exports = checkAuth;
