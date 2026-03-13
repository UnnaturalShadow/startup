import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { About } from './about/about';
import { Home } from './home/home';
import { Analytics } from './analytics/analytics';
import { Login } from './login/login';
import { ColMap } from './col-map/col-map';
import { Vog } from './vog/vog';
import { Vow } from './vow/vow';
import { Wish } from './last-wish/wish';
import { Garden } from './garden/garden';
import { King } from './kings-fall/king';
import { DSC } from './dsc/dsc';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check session on app mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/session', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setLoggedIn(data.loggedIn);
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        console.error('Session check failed:', err);
        setLoggedIn(false);
      } finally {
        setCheckingSession(false);
      }
    }
    checkSession();
  }, []);

  // Handle logout
  async function handleLogout() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setLoggedIn(false);
    }
  }

  if (checkingSession) {
    return <p className="text-center mt-5">Checking login status...</p>;
  }

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <header className="banner">
          <div className="left-content">
            <h1>RaidBuddy</h1>
            <nav>
              <ul>
                <li className="nav-item"><NavLink to="/">Home</NavLink></li>
                {loggedIn && <li className="nav-item"><NavLink to="/maps">Maps</NavLink></li>}
                <li className="nav-item"><NavLink to="/analytics">Insults</NavLink></li>
                <li className="nav-item"><NavLink to="/about">About</NavLink></li>
              </ul>
            </nav>
          </div>

          <div className="right-content">
            {loggedIn ? (
              <button className="profile-button" onClick={handleLogout}>Logout</button>
            ) : (
              <NavLink className="profile-button" to="/login">Login</NavLink>
            )}
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {loggedIn && <Route path="/maps" element={<ColMap />} />}
            <Route path="/about" element={<About />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
            <Route path="/vog" element={<Vog />} />
            <Route path="/vow" element={<Vow />} />
            <Route path="/wish" element={<Wish />} />
            <Route path="/garden" element={<Garden />} />
            <Route path="/king" element={<King />} />
            <Route path="/dsc" element={<DSC />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer>
          <span className="text-reset">&copy; Joshua Decker 2026</span>
          <a href="https://github.com/unnaturalshadow/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <div className="container-fluid text-center">404: Page not found</div>;
}