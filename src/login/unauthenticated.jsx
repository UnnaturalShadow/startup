import React from "react";

export function Unauthenticated({ userName, onLogin }) {
  const [email, setEmail] = React.useState(userName || "");
  const [password, setPassword] = React.useState("");
  const [displayError, setDisplayError] = React.useState(null);

  async function loginOrRegister(endpoint) {
    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",   // allow session cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `${endpoint} failed`);

      onLogin(data.email);
    } catch (err) {
      setDisplayError(err.message);
    }
  }

  return (
    <>
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          loginOrRegister("login");
        }}
      >
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
            onClick={() => loginOrRegister("register")}
          >
            Register
          </button>
        </div>
      </form>

      {displayError && (
        <div className="error-message">
          ⚠ {displayError}
          <button onClick={() => setDisplayError(null)}>Close</button>
        </div>
      )}
    </>
  );
}