import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      if (!res.data.token) {
        setError("Login failed");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);

      window.location.href = "/chat";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>💬</div>

        <h1 style={styles.title}>Welcome Back</h1>

        <p style={styles.subtitle}>
          Sign in to continue using ShareTalk
        </p>

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

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.loginBtn} onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button style={styles.homeBtn} onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link style={styles.link} to="/register">
            Register
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
    width: 380,
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
    textAlign: "center",
    margin: 0,
    color: "#4338ca",
    fontSize: 32,
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 10,
    marginBottom: 30,
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

  loginBtn: {
    marginTop: 5,
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
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    textAlign: "center",
    border: "1px solid #fecaca",
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