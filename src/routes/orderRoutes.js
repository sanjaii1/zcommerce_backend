const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// Admin routes
router.get("/all", auth, adminAuth, getAllOrders);

// All order routes require authentication
router.post("/", auth, createOrder);
router.get("/", auth, getUserOrders);
router.get("/:id", auth, getOrderById);

// This would typically be protected by an admin middleware
router.put("/:id/status", auth, adminAuth, updateOrderStatus);

module.exports = router;
