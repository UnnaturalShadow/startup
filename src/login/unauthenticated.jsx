import React from "react";

export function Unauthenticated({ userName, onLogin }) {
  const [email, setEmail] = React.useState(userName || "");
  const [password, setPassword] = React.useState("");

  // Login handler
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Store session identifier (email for now, can swap for JWT later)
      localStorage.setItem("userName", data.email);
      onLogin(data.email);
    } catch (err) {
      alert(err.message);
    }
  }

  // Register handler
  async function handleRegister() {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");

      localStorage.setItem("userName", data.email);
      onLogin(data.email);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>Login</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="button-group">
        <button type="submit" disabled={!email || !password}>
          Login
        </button>

        <button
          type="button"
          disabled={!email || !password}
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
    </form>
  );
}