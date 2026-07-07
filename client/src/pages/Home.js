import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>💬</div>

        <h1 style={styles.title}>ShareTalk</h1>

        <p style={styles.subtitle}>
          Chat with friends in real time.
          <br />
          Fast, secure and simple.
        </p>

        <button
          style={styles.primaryButton}
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>

        <p style={styles.footer}>
          Built with React • Node.js • Socket.IO
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
      "linear-gradient(135deg,#eef2ff 0%,#dbeafe 50%,#f8fafc 100%)",
    fontFamily: "Segoe UI, sans-serif",
  },

  card: {
    width: 430,
    background: "#fff",
    borderRadius: 20,
    padding: 45,
    textAlign: "center",
    boxShadow: "0 20px 45px rgba(0,0,0,.15)",
  },

  logo: {
    fontSize: 70,
    marginBottom: 10,
  },

  title: {
    margin: 0,
    fontSize: 42,
    color: "#4338ca",
    fontWeight: "700",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: 15,
    marginBottom: 35,
    fontSize: 17,
    lineHeight: 1.6,
  },

  primaryButton: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    border: "none",
    borderRadius: 12,
    background: "#4f46e5",
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },

  secondaryButton: {
    width: "100%",
    padding: 15,
    border: "2px solid #4f46e5",
    borderRadius: 12,
    background: "white",
    color: "#4f46e5",
    fontSize: 17,
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },

  footer: {
    marginTop: 30,
    color: "#9ca3af",
    fontSize: 13,
  },
};