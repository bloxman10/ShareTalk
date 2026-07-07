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

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          username,
          email,
          password,
        }
      );

      setSuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>💬</div>

        <h1 style={styles.title}>Create Account</h1>

        <p style={styles.subtitle}>
          Join ShareTalk and start chatting.
        </p>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={styles.passwordInfo}>
          Password must contain:
          <br />
          • At least 8 characters
          <br />
          • Uppercase letter
          <br />
          • Lowercase letter
          <br />
          • Number
          <br />
          • Special character
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <button style={styles.registerBtn} onClick={handleRegister}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <button style={styles.homeBtn} onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link style={styles.link} to="/login">
            Login
          </Link>
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
    background:
      "linear-gradient(135deg,#eef2ff,#dbeafe,#f8fafc)",
    fontFamily: "Segoe UI, sans-serif",
  },

  card: {
    width: 390,
    background: "white",
    borderRadius: 20,
    padding: 40,
    boxShadow: "0 20px 45px rgba(0,0,0,.15)",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    fontSize: 55,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    margin: 0,
    textAlign: "center",
    color: "#4338ca",
    fontSize: 32,
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 10,
    marginBottom: 25,
    lineHeight: 1.5,
  },

  input: {
    padding: 14,
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 16,
    outline: "none",
  },

  passwordInfo: {
    background: "#f3f4f6",
    color: "#6b7280",
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    lineHeight: 1.6,
    marginBottom: 18,
  },

  registerBtn: {
    padding: 14,
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
  },

  homeBtn: {
    marginTop: 12,
    padding: 14,
    background: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: "bold",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    textAlign: "center",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #86efac",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    textAlign: "center",
  },

  footer: {
    textAlign: "center",
    marginTop: 25,
    color: "#6b7280",
  },

  link: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "bold",
  },
};