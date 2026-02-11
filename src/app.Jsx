import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter } from 'react-router';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Scores } from './scores/scores';
import { About } from './about/about';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header className="banner">
          <div className="left-content">
            <h1>RaidBuddy</h1>
            <nav>
              <ul>
                <li className="nav-item"><NavLink href="/">Home</NavLink></li>
                <li className="nav-item"><NavLink href="col-map">Maps</NavLink></li>
                <li className="nav-item"><NavLink href="analytics">Analytics</NavLink></li>
                <li className="nav-item"><NavLink href="/about">About</NavLink></li>
              </ul>
            </nav>
          </div>
          <div className="right-content">
            <NavLink className="profile-button" href="login">Login</NavLink>
          </div>
        </header>

        <main>App components go here</main>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/play' element={<Play />} />
          <Route path='/scores' element={<Scores />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
          <span className="text-reset">&copy; Joshua Decker 2026</span>
          <a href="https://github.com/unnaturalshadow/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>

  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}