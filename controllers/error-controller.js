const HttpError = require("../models/http-error");

// 404 Handler
const notFound = (req, res, next) => {
  const error = new HttpError("404 Page Not Found, Please go back!", 404);
  next(error); // Pass it to the error handler middleware
};

// General Error Handler (catches all errors)
const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error); // If response already sent, delegate to default Express
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || "An unknown error occurred!",
  });
};

exports.notFound = notFound;
exports.errorHandler = errorHandler;
