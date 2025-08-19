const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventory-controller');
const checkAuth = require('../middleware/check-auth');

// ✅ Protect all inventory routes
router.use(checkAuth);

// ➕ Add food to inventory
router.post('/add', inventoryController.addToInventory);

// 📦 Get NGO's current inventory
router.get('/', inventoryController.getInventory);

// ❌ Remove specific inventory item
router.delete('/remove', inventoryController.removeFromInventory);

// 🧹 Clean expired items
router.delete('/clean-expired', inventoryController.cleanExpired);

module.exports = router;
