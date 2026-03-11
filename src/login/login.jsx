import React, { useEffect } from 'react';
import './login.css';

import { AuthState } from './authState';
import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';

export function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Login failed");
      setLoggedIn(true); // <-- updates header immediately
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

  // Check server session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/session', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          handleAuthChange(data.email, AuthState.Authenticated);
        } else {
          handleAuthChange('', AuthState.Unauthenticated);
        }
      } catch (err) {
        console.error('Session check failed', err);
        handleAuthChange('', AuthState.Unauthenticated);
      }
    }

    checkSession();
  }, []);

  if (authState === AuthState.Unknown) {
    return <p>Checking login status...</p>;
  }

  return (
    <main className="login-page">
      {authState === AuthState.Authenticated ? (
        <Authenticated
          userName={userName}
          onLogout={() =>
            handleAuthChange('', AuthState.Unauthenticated)
          }
        />
      ) : (
        <Unauthenticated
          userName={userName}
          onLogin={(loginUserName) =>
            handleAuthChange(loginUserName, AuthState.Authenticated)
          }
        />
      )}
    </main>
  );
