const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require("../controllers/cartController");
const auth = require("../middleware/auth"); 

// All cart routes require user to be authenticated
router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.delete("/remove", auth, removeFromCart);

module.exports = router;
