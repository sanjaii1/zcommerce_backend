const Stripe = require('stripe');
const Order = require('../models/Order');

// Initialize stripe. If STRIPE_SECRET_KEY is not yet defined, it will throw an error, 
// so we wrap it in a function or check it.
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = Stripe(process.env.STRIPE_SECRET_KEY.trim());
} else {
  console.warn("WARNING: STRIPE_SECRET_KEY is not defined in backend .env");
}

const createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ message: "Stripe is not configured." });

    const { amount, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Ensure order exists and belongs to user
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: error.message || 'An error occurred' });
  }
};

const stripeWebhook = async (req, res) => {
  if (!stripe) return res.status(500).json({ message: "Stripe is not configured." });

  const payload = req.body; // Raw buffer from express.raw
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      try {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'Completed',
          orderStatus: 'Confirmed'
        });
        console.log(`Order ${orderId} marked as completed.`);
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Failed' });
    }
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  stripeWebhook,
};
