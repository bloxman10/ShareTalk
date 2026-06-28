import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SHARETALK</h1>

      <p style={styles.subtitle}>Real-time chat app</p>

      <div style={styles.buttons}>
        <button onClick={() => navigate("/login")} style={styles.login}>
          Login
        </button>

        <button onClick={() => navigate("/register")} style={styles.register}>
          Register
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    color: "white",
    fontFamily: "Arial",
  },
  title: {
    fontSize: 60,
    marginBottom: 10,
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 30,
  },
  buttons: {
    display: "flex",
    gap: 15,
  },
  login: {
    padding: "10px 20px",
    background: "#22c55e",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    color: "white",
  },
  register: {
    padding: "10px 20px",
    background: "#3b82f6",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    color: "white",
  },
};