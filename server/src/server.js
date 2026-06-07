const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded; // id + username

    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// realtime connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.user.username);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", async (data) => {
  const messageData = {
    roomId: data.roomId,
    text: data.text,
    userId: socket.user.id,
    username: socket.user.username,
  };

  // 💾 שמירה ב-DB
  await Message.create(messageData);

  // ⚡ שליחה לכולם בחדר
  io.to(data.roomId).emit("receive_message", messageData);
});
});

// חשוב לשנות כאן:
server.listen(5000, () => {
  console.log("Server running on port 5000");
});