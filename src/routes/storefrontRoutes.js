const express = require("express");
const router = express.Router();
const {
  getStorefront,
  updateStorefront,
  addHeroBanner,
  deleteHeroBanner,
  updateHeroBanner,
} = require("../controllers/storefrontController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// Public
router.get("/", getStorefront);

// Admin only
router.put("/", auth, adminAuth, updateStorefront);
router.post("/hero-banners", auth, adminAuth, addHeroBanner);
router.put("/hero-banners/:index", auth, adminAuth, updateHeroBanner);
router.delete("/hero-banners/:index", auth, adminAuth, deleteHeroBanner);

module.exports = router;
