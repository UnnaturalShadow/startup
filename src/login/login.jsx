import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export function Login() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // Temporary behavior — just redirect to home
    navigate("/");
  }

  return (
    <main className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div className="input-group">
          <input
            type="text"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="password"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit">Login</button>
          <button type="button" onClick={() => navigate("/")}>
            Register
          </button>
        </div>
      </form>
    </main>
  );
}
