const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

// קבלת הודעות (פתוח לכולם)
router.get("/:roomId", async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId })
    .sort({ createdAt: 1 });

  res.json(messages);
});

// שליחת הודעה (רק מחובר)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { roomId, text } = req.body;

    const message = await Message.create({
      roomId,
      text,
      userId: req.user.id,
      username: req.user.username || "user",
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;