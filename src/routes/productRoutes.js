const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/", auth, adminAuth, productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", auth, adminAuth, productController.updateProduct);
router.delete("/:id", auth, adminAuth, productController.deleteProduct);

module.exports = router;
