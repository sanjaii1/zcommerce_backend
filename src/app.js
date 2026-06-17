const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api", limiter);

// We need the raw body to verify webhook signatures.
// Let's compute it only for webhooks
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// Standard Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/storefront", require("./routes/storefrontRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = app;
