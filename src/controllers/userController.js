const User = require("../models/User");
const Order = require("../models/Order");

// Get all customers with their order stats
const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    
    // For each customer, find their orders to calculate total spent and order count
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id });
        
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        
        return {
          ...customer.toObject(),
          totalOrders,
          totalSpent
        };
      })
    );
    
    res.json(customersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer by ID with their orders
const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 });
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    res.json({
      ...customer.toObject(),
      totalOrders,
      totalSpent,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer status (active/disabled)
const updateCustomerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["active", "disabled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.status = status;
    await customer.save();

    res.json({ message: "Customer status updated", status: customer.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
};
