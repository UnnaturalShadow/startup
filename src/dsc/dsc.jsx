import "../guide.css";
// import './vog.css';
import React from 'react';

export function DSC() {
  return (
    <main className="raid-guide">
     <h1>Deep Stone Crypt</h1>

    <h2>Eventide Ruins</h2>
    <ul>
        <li>Jump from the platform straight ahead</li>
        <li>Defeat the Fallen</li>
        <li>Door to Desolation opens</li>
        <li>Enter Desolation</li>
    </ul>

    <h2>Desolation</h2>
    <ul>
        <li>Summon sparrow/skimmer</li>
        <li>Drive through ice fields, following lights/mines to Heat Bubbles</li>
        <li>Mines will slow/blind</li>
        <li>Kill Fallen at Heat Bubbles to respawn/checkpoint</li>
        <li>At last Heat Bubble, defeat Brigs and Fallen to open way to Restricted</li>
    </ul>

    <h2>Restricted</h2>
    <ul>
        <li>Enter Deep Stone Crypt</li>
        <li>Head through open doors to Crypt Security</li>
    </ul>

    <h2>Crypt Security</h2>
    <ul>
        <li>Assign Operator & 2 Scanners (Light/Dark)</li>
        <li>Operator shoots red glowing panels, Scanner calls yellow panels</li>
        <li>Split: 3 Guardians on Dark, 2 on Light, 1 Operator in Basement</li>
        <li>Kill Servitors to unlock terminals</li>
        <li>Operator dunks buff into terminal, Scanner observes fuses and calls out glowing fuses</li>
        <li>Incorrect fuse order wipes fireteam; destroy Crypt Security, proceed to Clarity Control</li>
    </ul>

    <h2>Clarity Control</h2>
    <ul>
        <li>Drop down elevator shaft, enter Clarity Control via right door</li>
        <li>Observe Pyramid Statue and meet Fallen Exos</li>
    </ul>

    <h2>Atraks-1, Fallen Exo</h2>
    <ul>
        <li>Move up to window; Atraks-1 creates Taniks-1</li>
        <li>Split fireteam: Team Lab (3), Team Space (3)</li>
        <li>Operator spawns in Lab, Scanner spawns in Space</li>
        <li>Kill clones and Servitors, coordinate DPS, pick up Replication Orbs carefully</li>
        <li>Final Stand in Space; destroy Atraks-1, chest appears in middle</li>
    </ul>

    <h2>The Morning Star Space Walk</h2>
    <ul>
        <li>Exit airlock, jump to front of station</li>
        <li>Enter hanger bay, kill Fallen guarding door</li>
        <li>Proceed to stop the Nuclear Contingency Plan</li>
    </ul>

    <h2>Descent</h2>
    <ul>
        <li>Operator, Scanner, Suppressor coordinate to defuse bombs</li>
        <li>Hold bombs carefully, defuse before timer runs out to avoid wipe</li>
        <li>After nukes are defused, floor opens; rush to escape pod</li>
        <li>Escape pod crashes on Europa; find Taniks-1</li>
    </ul>

    <h2>Taniks-1, the Abomination</h2>
    <ul>
        <li>Split fireteam: 3 groups of 2 (Operator, Suppressor, Scanner)</li>
        <li>Bomb Squad shoots bombs off Taniks-1 and deposits them into terminals</li>
        <li>Avoid purple beams, coordinate DPS, follow Operator with Replication Orb</li>
        <li>Final Stand: Taniks-1 teleports randomly, destroy Taniks-1</li>
        <li>Chests appear on left side of wreckage; The End</li>
    </ul>

      <section className="credits">
        <p>
          Guide content courtesy of{" "}
          <a
            href="https://youtube.com/@soteriaaugur?si=tgIqXwQuYepCH4_5"
            target="_blank"
            rel="noopener noreferrer"
          >
            SoteriaAugur
          </a>
        </p>
      </section>
    </main>
  );
}
