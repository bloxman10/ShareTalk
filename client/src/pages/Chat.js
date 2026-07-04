import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import axios from "axios";

export default function Chat() {
  const [room, setRoom] = useState("general");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username") || "me";
  const messagesEndRef = useRef(null);

  // 🔥 SOCKET + REALTIME
  useEffect(() => {
    const token = localStorage.getItem("token");

    socket.auth = { token };
    socket.connect();

    const handleConnect = () => {
      console.log("🟢 connected:", socket.id);

      socket.emit("join_room", room);
      loadHistory(room);
    };

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleDelete = (id) => {
      setMessages((prev) =>
        prev.filter((m) => m._id !== id)
      );
    };

    const handleClear = () => {
      setMessages([]);
    };

    socket.on("connect", handleConnect);
    socket.on("receive_message", handleMessage);
    socket.on("message_deleted", handleDelete);
    socket.on("room_cleared", handleClear);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive_message", handleMessage);
      socket.off("message_deleted", handleDelete);
      socket.off("room_cleared", handleClear);
      socket.disconnect();
    };
  }, [room]);

  // 🔥 scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 load history
  const loadHistory = async (roomId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${roomId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log("History error:", err.message);
    }
  };

  // 🔥 join room
  const joinRoom = (r) => {
    setRoom(r);
    setMessages([]);

    socket.emit("join_room", r);
    loadHistory(r);
  };

  // 🔥 send message
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send_message", {
      roomId: room,
      text,
    });

    setText("");
  };

  // 🔥 logout
  const logout = () => {
    localStorage.removeItem("token");
    socket.disconnect();
    window.location.href = "/login";
  };

  // 🔥 delete account
  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      socket.disconnect();
      window.location.href = "/";
    } catch (err) {
      console.log("DELETE ERROR:", err.message);
    }
  };

  // 🔥 clear chat
  const clearChat = () => {
  const confirmClear = window.confirm(
    `Are you sure you want to clear the "${room}" chat?\n\nThis action cannot be undone.`
  );

  if (!confirmClear) return;

  socket.emit("clear_room", room);
  setMessages([]);
};

  // 🔥 delete message
  const deleteMessage = (id) => {
    socket.emit("delete_message", id);

    setMessages((prev) =>
      prev.filter((m) => m._id !== id)
    );
  };

  return (
  <div style={styles.container}>

    {/* SIDEBAR */}
<div style={styles.sidebar}>
  <h2 style={{ marginBottom: 20 }}>SHARETALK</h2>

  <button style={styles.roomBtn} onClick={() => joinRoom("general")}>
    # general
  </button>

  <button style={styles.roomBtn} onClick={() => joinRoom("gaming")}>
    # gaming
  </button>

  <button style={styles.roomBtn} onClick={() => joinRoom("school")}>
    # school
  </button>

  {/* Spacer - דוחף את כל הכפתורים למטה */}
  <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>

    <button
  onClick={clearChat}
  style={{
    background: "red",
    color: "white",
    padding: 10,
    border: "none",
    cursor: "pointer",
    borderRadius: 6,
    width: "100%",
  }}
>
  Clear Chat
</button>

    <button
      onClick={deleteAccount}
      style={{
        background: "red",
        color: "white",
        padding: 10,
        border: "none",
        cursor: "pointer",
        borderRadius: 6,
        width: "100%",
      }}
    >
      Delete Account
    </button>

    <button
      style={styles.logoutBtn}
      onClick={logout}
    >
      Logout
    </button>

  </div>
</div>


    {/* CHAT AREA */}
    <div style={styles.chatArea}>

      {/* HEADER */}
      <div style={styles.header}>
        Room: #{room}
      </div>

      {/* MESSAGES */}
      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.empty}>
            No messages yet. Start the conversation 🚀
          </div>
        )}

        {messages.map((m, i) => {
  const isMine = m.username === username;

  return (
    <div
      key={i}
      style={{
        ...styles.message,
        alignSelf: isMine ? "flex-end" : "flex-start",
        background: isMine ? "#dcf8c6" : "white",
        position: "relative",
      }}
    >
      {/* 👤 username */}
      <div style={styles.msgUser}>
        {m.username || "user"}
      </div>

      {/* 💬 text */}
      <div>{m.text}</div>

      {/* 🗑 delete button (רק שלי) */}
      {isMine && (
  <button
    onClick={() => deleteMessage(m._id)}
    style={{
      background: "transparent",
      border: "none",
      color: "red",
      cursor: "pointer",
      marginLeft: 6,
    }}
  >
    ✕
  </button>
)}
    </div>
  );
})}



        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button style={styles.sendBtn} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  </div>
);
}
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial",
  },

  sidebar: {
    width: 220,
    background: "#111b21",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: 10,
  },

  roomBtn: {
    padding: 10,
    marginBottom: 8,
    background: "#1f2c33",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: 6,
  },

  logoutBtn: {
    width: "100%",
    padding: 10,
    background: "red",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: 6,
  },

  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#efeae2",
  },

  header: {
    padding: 15,
    background: "#075e54",
    color: "white",
    fontWeight: "bold",
  },

  messages: {
    flex: 1,
    padding: 15,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  message: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "60%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },

  msgUser: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    opacity: 0.7,
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },

  inputBar: {
    display: "flex",
    padding: 10,
    gap: 10,
    background: "#f0f0f0",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ccc",
    outline: "none",
  },

  sendBtn: {
    padding: "10px 20px",
    borderRadius: 20,
    border: "none",
    background: "#075e54",
    color: "white",
    cursor: "pointer",
  },
};