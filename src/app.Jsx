import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { About } from './about/about';
import { Home } from './home/home';
import { Analytics } from './analytics/analytics';
import { Login } from './login/login';
import { ColMap } from './col-map/col-map';
import { Vog } from './vog/vog';
// import { Play } from './play/play';
// import { Scores } from './scores/scores';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <header className="banner">
          <div className="left-content">
            <h1>RaidBuddy</h1>
            <nav>
              <ul>
                <li className="nav-item"><NavLink to="/">Home</NavLink></li>
                <li className="nav-item"><NavLink to="/maps">Maps</NavLink></li>
                <li className="nav-item"><NavLink to="/analytics">Analytics</NavLink></li>
                <li className="nav-item"><NavLink to="/about">About</NavLink></li>
              </ul>
            </nav>
          </div>

          <div className="right-content">
            <NavLink className="profile-button" to="/login">Login</NavLink>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/maps" element={<ColMap />} />
            {/* <Route path="/scores" element={<Scores />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/login" element={<Login />} />
            <Route path="/vog" element={<Vog />} />
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
