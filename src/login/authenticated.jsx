import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Authenticated({ userName, onLogout }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      // Call the backend logout endpoint
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userName }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Logout failed");
      }

      // Clear local storage and update UI state
      localStorage.removeItem("userName");
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
        <button onClick={() => navigate('/')}>Go to Home</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}