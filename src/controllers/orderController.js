const Order = require("../models/Order");

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      subtotal,
      shippingCharge,
      tax,
      totalAmount,
      paymentMethod,
    } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Generate a simple unique order number (e.g., ORD-1678901234)
    const orderNumber = "ORD-" + Date.now().toString().slice(-6) + Math.floor(1000 + Math.random() * 9000);

    const order = new Order({
      orderNumber,
      user: req.user.id,
      items,
      shippingAddress,
      subtotal,
      shippingCharge,
      tax,
      totalAmount,
      paymentMethod,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get logged in user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (order) {
      // Check if user is admin
      const User = require("../models/User");
      const requestUser = await User.findById(req.user.id);
      const isAdmin = requestUser && requestUser.role === "admin";

      // Basic check: user can only see their own order (unless they are admin)
      if (order.user._id.toString() !== req.user.id && !isAdmin) {
        return res.status(401).json({ message: "Not authorized to view this order" });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Usually for Admin, but kept available for testing)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};
