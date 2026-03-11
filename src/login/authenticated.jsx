import React from "react";
import { useNavigate } from "react-router-dom";

export function Authenticated({ userName, onLogout }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // send session cookie
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Logout failed");
      }

      onLogout();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="login-form">
      <h1>Welcome</h1>
      <p>{userName}</p>

      <div className="button-group">
        <button onClick={() => navigate("/")}>Go to Home</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}