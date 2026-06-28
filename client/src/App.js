import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/chat"
        element={token ? <Chat /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}