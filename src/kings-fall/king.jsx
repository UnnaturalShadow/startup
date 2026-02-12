import "../guide.css";
// import './vog.css';
import React from 'react';

export function King() {
  return (
    <main className="raid-guide">
      <h1>King's Fall</h1>

    <h2>Hall of Souls</h2>
    <ul>
        <li>Main Objective: Dunk 2 Orbs into the 6 Statues</li>
        <li>Orbs need to be dunked in a certain time (time limit debuff)</li>
        <li>Team Orb (2 Guardians)</li>
        <li>Team Barrier (4 Guardians; 2 Left/2 Right)</li>
        <li>Orbs spawn on the Left & Right sides</li>
        <li>After every dunk, Orbs spawn further away on the Left & Right</li>
        <li>Team Barrier kills ads and destroys Taken Barriers blocking the path of Team Orb</li>
        <li>Team Orb meets in the Mid Hallway and dunks at the SAME TIME</li>
        <li>Repeat for 6 times, then proceed to the Totems</li>
    </ul>

    <h2>The Totems</h2>
    <ul>
        <li>Main Objective: Deposit Deathsinger Power in the Center Plate</li>
        <li>3 Rooms: Center, Left Totem, Right Totem</li>
        <li>Stand under the Totems to keep them calm</li>
        <li>No one under Totem; Totems will wipe Fireteam</li>
        <li>Brand of the Weaver/Unraveler: protects from Poison Gas and allows buildup of Deathsinger Power</li>
        <li>Red Bar Enemies=1 Stack, Orange Bar Enemies=3 Stack</li>
        <li>Split Fireteam into 2 groups of 3</li>
        <li>Rotation for dunking and building power described in detail (P1, P2, P3 rotations)</li>
        <li>Unstoppable Ogres spawn in Center</li>
        <li>Proceed to the Warpriest</li>
    </ul>

    <h2>The Warpriest</h2>
    <ul>
        <li>Main Objective: Defeat the Warpriest</li>
        <li>3 Plates (Left, Mid, Right), 3 Totems (in front of Plates)</li>
        <li>Plates: Needed to Acquire Damage Aura</li>
        <li>Totems: Shows Order Needed to Activate Plates</li>
        <li>Split Fireteam into 3 groups of 2 for Plates and Totems, 2 Guardians for Blightguard</li>
        <li>“Glyph reading sequence” explained with Guardian rotations and Brand of the Initiate usage</li>
        <li>DPS phase, Blightguard management, and timer countdown instructions</li>
        <li>Defeat Warpriest and survive Oculus attack</li>
        <li>Proceed to Golgoroth</li>
    </ul>

    <h2>Golgoroth</h2>
    <ul>
        <li>Main Objective: Toss Golgoroth Back & Forth to deal DPS in Specific Areas</li>
        <li>Split Fireteam into Team Gaze (2 Guardians) and Team DPS (4 Guardians)</li>
        <li>Team Gaze: take Golgoroth’s Gaze, rotate him for Team DPS</li>
        <li>Team DPS: stand in Pools of Reclaimed Light to deal damage</li>
        <li>Manage Light Orbs, Unstable Light debuffs, and Tablet of Ruin stacks</li>
        <li>Defeat Golgoroth and proceed to the Daughters of Oryx</li>
    </ul>

    <h2>Daughters of Oryx</h2>
    <ul>
        <li>Main Objective: Craft the Blightguard to defeat the Daughters</li>
        <li>Four sections of arena: Front Left, Front Right, Back Left, Back Right</li>
        <li>TBD Guardian collects Blightguard pieces while others create pathways and assist</li>
        <li>Rotation repeated for each piece, then DPS phase on Daughters</li>
        <li>Leave some health if unsure; defeat both Daughters and proceed to Oryx</li>
    </ul>

    <h2>Oryx, The Taken King</h2>
    <ul>
        <li>Main Objective: Craft Blightguard & Set Off Taken Bombs to deal DPS to Oryx</li>
        <li>Split Fireteam: 1 Guardian on each Plate, 2 Guardians Mid for Flex</li>
        <li>Manage Blightguard pieces, Light-Eater Ogres, Taken Bombs, Vessel of Oryx, and Phantom Oryx mechanics</li>
        <li>Fireteam coordination crucial for final stand DPS</li>
        <li>Defeat Oryx, the Taken King</li>
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
