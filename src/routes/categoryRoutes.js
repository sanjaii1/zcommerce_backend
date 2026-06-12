const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/", auth, adminAuth, createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.put("/:id", auth, adminAuth, updateCategory);
router.delete("/:id", auth, adminAuth, deleteCategory);

module.exports = router;
