const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// 📜 קבלת היסטוריית הודעות לפי חדר
router.get("/:roomId", async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId });
  res.json(messages);
});

// מחיקת הודעה אחת
router.delete("/:id", async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// מחיקת חדר (לא מתנגש יותר!)
router.delete("/room/:roomId", async (req, res) => {
  await Message.deleteMany({ roomId: req.params.roomId });
  res.json({ success: true });
});

module.exports = router;