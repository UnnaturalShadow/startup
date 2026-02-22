import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Authenticated({ userName, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('userName');
    onLogout();
  }

  return (
    <div className="login-form">
      <h1>Welcome</h1>

      <p>{userName}</p>

      <div className="button-group">
        <button onClick={() => navigate('/')}>
          Go to Home
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}