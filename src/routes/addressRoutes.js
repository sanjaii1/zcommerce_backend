const express = require("express");
const router = express.Router();
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const auth = require("../middleware/auth"); // Must be logged in

// All routes are protected and bound to req.user.id
router.post("/", auth, addAddress);
router.get("/", auth, getAddresses);
router.put("/:id", auth, updateAddress);
router.delete("/:id", auth, deleteAddress);

module.exports = router;
