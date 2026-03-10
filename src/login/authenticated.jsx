import React from "react";
import { useNavigate } from "react-router-dom";

export function Authenticated({ userName, onLogout }) {
  const navigate = useNavigate();

  async function handleLogout() {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      alert("You are not logged in");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Logout failed");

      // Clear session
      localStorage.removeItem("userName");
      localStorage.removeItem("sessionId");
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