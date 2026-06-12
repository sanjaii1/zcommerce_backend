const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const auth = require("../middleware/auth");

// All order routes require authentication
router.post("/", auth, createOrder);
router.get("/", auth, getUserOrders);
router.get("/:id", auth, getOrderById);

// This would typically be protected by an admin middleware
router.put("/:id/status", auth, updateOrderStatus);

module.exports = router;
