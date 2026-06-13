const express = require("express");
const router = express.Router();
const { register, login, googleLogin, profile, updateProfile, deleteProfile } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/profile", auth, profile);
router.put("/profile", auth, updateProfile);
router.delete("/profile", auth, deleteProfile);

module.exports = router;
