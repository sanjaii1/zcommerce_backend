const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error verifying admin privileges", error: error.message });
  }
};

module.exports = adminAuth;
