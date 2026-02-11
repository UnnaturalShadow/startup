// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <main className="home">
      <section className="intro">
        <h2>Welcome to RaidBuddy</h2>
        <p>
          RaidBuddy is a companion tool designed to help players
          organize raid encounters, track progress, and collaborate more
          effectively. Features include interactive, collaborative maps, encounter guides,
          and activity analytics from the Bungie API.
        </p>
      </section>

      <section className="raids">
        <h2>Raid List</h2>
        <div className="raid-list">
          <Link to="/vog" className="raid-card">Vault of Glass</Link>
          <Link to="/vow" className="raid-card">Vow of the Disciple</Link>
          <Link to="/kings-fall" className="raid-card">King's Fall</Link>
          <Link to="/last-wish" className="raid-card">Last Wish</Link>
          <Link to="/garden-of-salvation" className="raid-card">Garden of Salvation</Link>
          <Link to="/deep-stone-crypt" className="raid-card">Deep Stone Crypt</Link>
        </div>
      </section>
    </main>
  );
}
