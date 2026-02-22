import React from 'react';

export function Unauthenticated({ userName, onLogin }) {
  const [email, setEmail] = React.useState(userName);
  const [password, setPassword] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('userName', email);
    onLogin(email);
  }

  function handleRegister() {
    localStorage.setItem('userName', email);
    onLogin(email);
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