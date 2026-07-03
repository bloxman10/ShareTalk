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
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;

    next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
});

// ⚡ socket
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`joined room ${roomId}`);
  });

  socket.on("delete_message", async (id) => {
  try {
    const msg = await Message.findByIdAndDelete(id);

    if (!msg) return;

    io.to(msg.roomId).emit("message_deleted", id);

  } catch (err) {
    console.log(err.message);
  }
});

socket.on("clear_room", async (roomId) => {
  try {
    await Message.deleteMany({ roomId });

    io.to(roomId).emit("room_cleared");
  } catch (err) {
    console.log(err.message);
  }
});

  socket.on("send_message", async (data) => {
  try {
    const messageData = await Message.create({
      roomId: data.roomId,
      text: data.text,
      userId: socket.user?.id,
      username: socket.user?.username,
    });

    // שולח לכל מי שבחדר כולל _id
    io.to(data.roomId).emit("receive_message", messageData);

  } catch (err) {
    console.log("DB error:", err.message);
  }
});
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



server.listen(5000, () => {
  console.log("Server running on port 5000");
});