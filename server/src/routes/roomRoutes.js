const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;