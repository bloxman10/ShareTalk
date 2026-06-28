import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";

export default function Chat() {
  const [room, setRoom] = useState("general");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    socket.auth = { token };
    socket.connect();

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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

  const joinRoom = (r) => {
    setRoom(r);
    setMessages([]);
    socket.emit("join_room", r);
    loadHistory(r);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send_message", {
      roomId: room,
      text,
    });

    setText("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    socket.disconnect();
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#075e54", color: "white", padding: 10 }}>
        <h3>Rooms</h3>

        <button onClick={() => joinRoom("general")}># general</button>
        <button onClick={() => joinRoom("gaming")}># gaming</button>
        <button onClick={() => joinRoom("school")}># school</button>

        <hr />

        <button onClick={logout} style={{ background: "red", color: "white" }}>
          Logout
        </button>
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        <div style={{ padding: 10, background: "#075e54", color: "white" }}>
          Room: #{room}
        </div>

        {/* MESSAGES */}
        <div
          style={{
            flex: 1,
            padding: 10,
            overflowY: "auto",
            background: "#e5ddd5",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: "flex-start",
                background: "white",
                padding: "8px 12px",
                borderRadius: 10,
                maxWidth: "60%",
              }}
            >
              <b>{m.username || "user"}:</b> {m.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div style={{ display: "flex", padding: 10, gap: 10 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1, padding: 10 }}
            placeholder="Type message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}