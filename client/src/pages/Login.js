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
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (!res.data.token) {
        setError("אין טוקן מהשרת");
        return;
      }

      localStorage.setItem("token", res.data.token);

      // 💥 חשוב: מעבר רק אחרי שמירה
      navigate("/chat", { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button onClick={handleLogin}>
          {loading ? "Loading..." : "Login"}
        </button>

        <button onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <p>
          אין חשבון? <Link to="/register">Register</Link>
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
};