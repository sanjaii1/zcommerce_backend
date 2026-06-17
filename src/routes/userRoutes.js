const express = require("express");
const router = express.Router();
const { getCustomers, getCustomerById, updateCustomerStatus } = require("../controllers/userController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// All user routes require admin authentication
router.get("/customers", auth, adminAuth, getCustomers);
router.get("/customers/:id", auth, adminAuth, getCustomerById);
router.put("/customers/:id/status", auth, adminAuth, updateCustomerStatus);

module.exports = router;
