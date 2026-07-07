const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const roomRoutes = require("./routes/roomRoutes");

const app = express();

// 🔥 חשוב: קודם כל middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://share-talk-one.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ShareTalk API",
  });
});

console.log("AUTH ROUTES LOADED");

module.exports = app;