import React from 'react';
import './login.css';

import { AuthState } from './authState';
import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';

export function Login() {
  const [userName, setUserName] = React.useState(
    localStorage.getItem('userName') || ''
  );

  const [authState, setAuthState] = React.useState(
    userName ? AuthState.Authenticated : AuthState.Unauthenticated
  );

  function handleAuthChange(newUserName, newAuthState) {
    setUserName(newUserName);
    setAuthState(newAuthState);
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