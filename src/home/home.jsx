// src/pages/Home.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

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
          <NavLink to="/vog" className="raid-card">Vault of Glass</NavLink>
          <NavLink to="/vow" className="raid-card">Vow of the Disciple</NavLink>
          <NavLink to="/king" className="raid-card">King's Fall</NavLink>
          <NavLink to="/wish" className="raid-card">Last Wish</NavLink>
          <NavLink to="/garden" className="raid-card">Garden of Salvation</NavLink>
          <NavLink to="/dsc" className="raid-card">Deep Stone Crypt</NavLink>
        </div>
      </section>
    </main>
  );
}
