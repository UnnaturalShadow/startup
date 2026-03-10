import React, { useEffect } from 'react';
import './login.css';

import { AuthState } from './authState';
import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';

export function Login() {
  const [userName, setUserName] = React.useState('');
  const [authState, setAuthState] = React.useState(AuthState.Unknown);

  function handleAuthChange(newUserName, newAuthState) {
    setUserName(newUserName);
    setAuthState(newAuthState);
  }

  // Server-side session check
  useEffect(() => {
    async function checkSession() {
      const savedUser = localStorage.getItem('userName');
      if (!savedUser) {
        handleAuthChange('', AuthState.Unauthenticated);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/session', {
          credentials: 'include', // Needed if backend uses cookies
        });
        if (res.ok) {
          const data = await res.json();
          handleAuthChange(data.email, AuthState.Authenticated);
        } else {
          localStorage.removeItem('userName');
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
            handleAuthChange(
              loginUserName,
              AuthState.Authenticated
            )
          }
        />
      )}
    </main>
  );
}