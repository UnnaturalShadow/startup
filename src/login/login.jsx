// src/login/login.jsx
import React, { useState, useEffect } from 'react';
import './login.css';

import { AuthState } from './authState';
import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';

export function Login({ setLoggedIn }) {
  // -----------------------
  // Component state
  // -----------------------
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // -----------------------
  // Handle auth state changes
  // -----------------------
  const handleAuthChange = (user, state) => {
    setUserName(user);
    setAuthState(state);
    setLoggedIn(state === AuthState.Authenticated);
  };

  // -----------------------
  // Submit login form
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      handleAuthChange(data.email, AuthState.Authenticated);
    } catch (err) {
      alert(err.message);
    }
  };

  // -----------------------
  // Check server session on mount
  // -----------------------
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/session', { credentials: 'include' });
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

  // -----------------------
  // Show loading while checking session
  // -----------------------
  if (authState === AuthState.Unknown) {
    return <p>Checking login status...</p>;
  }

  // -----------------------
  // Render login form or authenticated view
  // -----------------------
  return (
    <main className="login-page">
      {authState === AuthState.Authenticated ? (
        <Authenticated
          userName={userName}
          onLogout={() => handleAuthChange('', AuthState.Unauthenticated)}
        />
      ) : (
        <Unauthenticated
          userName={userName}
          onLogin={(loginUserName) =>
            handleAuthChange(loginUserName, AuthState.Authenticated)
          }
        >
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
        </Unauthenticated>
      )}
    </main>
  );
}