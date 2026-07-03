const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

const { register, login } = require("../controllers/authController");

// AUTH
router.post("/register", register);
router.post("/login", login);

// 💥 DELETE USER
router.delete("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    await Message.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;