const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.userData.type !== "Admin") {
    return next(new HttpError("Access denied. Admins only.", 403));
  }
  next();
};
