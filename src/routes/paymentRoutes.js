const express = require("express");
const router = express.Router();
const { createPaymentIntent, stripeWebhook } = require("../controllers/paymentController");
const auth = require("../middleware/auth");

router.post("/create-intent", auth, createPaymentIntent);

// Note: webhook does not use auth middleware because it comes from Stripe
// Note: express.raw is handled in app.js for this specific route
router.post("/webhook", stripeWebhook);

module.exports = router;
