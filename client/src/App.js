import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

export default function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    setAuth(!!token);
  }, []);

  // 🔥 בזמן טעינה אל תציג כלום
  if (auth === null) return null;

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={auth ? <Navigate to="/chat" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={auth ? <Navigate to="/chat" replace /> : <Register />}
      />

      <Route
        path="/chat"
        element={auth ? <Chat /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}