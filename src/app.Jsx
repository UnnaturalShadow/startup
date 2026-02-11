import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

// Pages
import { About } from './about/about';
import { Home } from './home/home';
// import { Home } from './home/home';
// import { Maps } from './maps/maps';
// import { Analytics } from './analytics/analytics';
// import { Login } from './login/login';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body text-light">
        {/* Header */}
        <header className="banner">
          <div className="left-content">
            <h1>RaidBuddy</h1>
            <nav>
              <ul>
                <li className="nav-item"><NavLink to="/">Home</NavLink></li>
                <li className="nav-item"><NavLink to="/col-map">Maps</NavLink></li>
                <li className="nav-item"><NavLink to="/analytics">Analytics</NavLink></li>
                <li className="nav-item"><NavLink to="/about">About</NavLink></li>
              </ul>
            </nav>
          </div>
          <div className="right-content">
            <NavLink className="profile-button" to="/login">Login</NavLink>
          </div>
        </header>

        {/* Routes */}
        <main className="flex-grow-1">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/col-map" element={<Maps />} /> */}
            {/* <Route path="/analytics" element={<Analytics />} /> */}
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer>
          <span className="text-reset">&copy; Joshua Decker 2026</span>
          <a href="https://github.com/unnaturalshadow/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

// NotFound Component (inline for simplicity)
function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center p-5">
      <h2>404: Page Not Found</h2>
      <p>Return to sender. Address unknown.</p>
    </main>
  );
}
