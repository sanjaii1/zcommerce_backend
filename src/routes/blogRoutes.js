const express = require("express");
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/", auth, adminAuth, createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlog);
router.put("/:id", auth, adminAuth, updateBlog);
router.delete("/:id", auth, adminAuth, deleteBlog);

module.exports = router;
