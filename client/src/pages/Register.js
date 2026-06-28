import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      setSuccess("נרשמת בהצלחה!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Register</h2>

        <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <button onClick={handleRegister}>
          {loading ? "Loading..." : "Register"}
        </button>

        {/* 🔥 כפתור חזרה לבית */}
        <button style={styles.homeBtn} onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <p>
          כבר יש חשבון? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: 300,
    padding: 20,
    background: "#1e293b",
    borderRadius: 12,
  },
  error: {
    background: "red",
    padding: 8,
    borderRadius: 6,
  },
  success: {
    background: "green",
    padding: 8,
    borderRadius: 6,
  },
  homeBtn: {
    marginTop: 10,
    background: "#64748b",
    color: "white",
    border: "none",
    padding: 8,
    cursor: "pointer",
    borderRadius: 6,
  },
};