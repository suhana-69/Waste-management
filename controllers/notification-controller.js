const HttpError = require("../models/http-error");
const Notification = require("../models/notification");
const User = require("../models/user");

// ✅ Create a new notification
exports.createNotification = async (req, res, next) => {
  const { recipientId, message, type } = req.body;

  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return next(new HttpError("Recipient not found", 404));
    }

    const notification = new Notification({
      recipient: recipientId,
      message,
      type,
      status: "Unread"
    });

    await notification.save();

    res.status(201).json({ message: "Notification created", notification });
  } catch (err) {
    return next(new HttpError("Creating notification failed", 500));
  }
};

// ✅ Get all notifications for logged-in user
exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.userData.userId })
      .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    return next(new HttpError("Fetching notifications failed", 500));
  }
};

// ✅ Mark a notification as read
exports.markAsRead = async (req, res, next) => {
  const { notificationId } = req.body;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) return next(new HttpError("Notification not found", 404));

    notification.status = "Read";
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (err) {
    return next(new HttpError("Marking notification as read failed", 500));
  }
};

// ✅ Delete a notification
exports.deleteNotification = async (req, res, next) => {
  const { notificationId } = req.body;

  try {
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    return next(new HttpError("Deleting notification failed", 500));
  }
};
