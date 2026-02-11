import React from 'react';

export function About() {
  return (
    <main className="about-page">
      <h1>Welcome to RaidBuddy</h1>
      <p>
        RaidBuddy provides guidance for Destiny 2 raids in the form of guides, images, and collaborative, interactive maps.
        This project is made possible with much thanks to{' '}
        <a
          href="https://youtube.com/@soteriaaugur?si=tgIqXwQuYepCH4_5"
          target="_blank"
          rel="noopener noreferrer"
        >
          SoteriaAugur
        </a>{' '}
        who created the maps and provided the vast majority of the written content for the guides as well. I hope this tool helps
        you and your fireteam conquer whatever challenge you take on, happy raiding!
      </p>

      <img src="/raid.svg" alt="Destiny Logo" className="about-logo" />

      <h3>Disclaimer</h3>
      <p>
        Please note that RaidBuddy is an independent project and is not affiliated with Bungie or Destiny 2 in any official capacity. All content provided
        on this site is for educational and informational purposes only. Users are encouraged to support the official game and its developers by purchasing
        Destiny 2 and any associated content through legitimate channels.
      </p>
    </main>
  );
}
