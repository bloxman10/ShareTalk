require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");
const connectDB = require("./config/db");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔐 JWT (עם fallback כדי שלא יקרוס לך כל המערכת)
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("No token - allowing guest mode");
      return next(); // 👈 לא חוסם יותר
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;

    next();
  } catch (err) {
    console.log("Invalid token - allowing guest mode");
    next(); // 👈 לא מפיל connection
  }
});

// ⚡ socket
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`joined room ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    const messageData = {
      roomId: data.roomId,
      text: data.text,
      userId: socket.user?.id || "guest",
      username: socket.user?.username || "guest",
    };

    try {
      await Message.create(messageData);
    } catch (err) {
      console.log("DB error:", err.message);
    }

    io.to(data.roomId).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});