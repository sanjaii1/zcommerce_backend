const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");
// If you have auth middleware, you can import and use it here
// const { protect, admin } = require("../middleware/authMiddleware");

// Route: POST /api/upload
// Note: We use upload.single('image') where 'image' is the field name expected in the FormData
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
