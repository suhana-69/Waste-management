const HttpError = require("../models/http-error");
const Inventory = require("../models/inventory");
const Food = require("../models/food");
const User = require("../models/user");

// ✅ Add food to inventory (by NGO)
exports.addToInventory = async (req, res, next) => {
  const { foodId, quantity } = req.body;

  try {
    const food = await Food.findById(foodId);
    if (!food) return next(new HttpError("Food not found", 404));

    if (food.status !== "Delivered") {
      return next(new HttpError("Only delivered food can be stored in inventory", 400));
    }

    const inventoryItem = new Inventory({
      ngo: req.userData.userId,
      food: foodId,
      quantity,
      expiryDate: food.expirytime
    });

    await inventoryItem.save();
    res.status(201).json({ message: "Food added to inventory", inventoryItem });
  } catch (err) {
    return next(new HttpError("Adding to inventory failed", 500));
  }
};

// ✅ Get inventory for an NGO
exports.getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find({ ngo: req.userData.userId })
      .populate("food", "description quantity foodtype expirytime");

    res.json({ inventory });
  } catch (err) {
    return next(new HttpError("Fetching inventory failed", 500));
  }
};

// ✅ Remove expired items automatically (FIFO check)
exports.cleanExpired = async (req, res, next) => {
  try {
    const now = new Date();
    const expiredItems = await Inventory.find({ expiryDate: { $lt: now } });

    if (expiredItems.length > 0) {
      await Inventory.deleteMany({ expiryDate: { $lt: now } });
    }

    res.json({ message: "Expired items removed", removed: expiredItems.length });
  } catch (err) {
    return next(new HttpError("Cleaning expired items failed", 500));
  }
};

// ✅ Remove specific item from inventory (when NGO distributes it)
exports.removeFromInventory = async (req, res, next) => {
  const { inventoryId } = req.body;

  try {
    await Inventory.findByIdAndDelete(inventoryId);
    res.status(200).json({ message: "Item removed from inventory" });
  } catch (err) {
    return next(new HttpError("Removing item failed", 500));
  }
};
