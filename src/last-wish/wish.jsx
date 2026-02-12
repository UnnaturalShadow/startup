import "../guide.css";
import React from 'react';

export function Wish() {
  return (
    <main className="raid-guide">
    <h1>Last Wish</h1>

    <h2>Divalian Mists</h2>
    <ul>
        <li>Wait for the gates to open</li>
        <li>Enter the Tower of Opened Eyes and listen to Riven</li>
        <li>Enter the pillar on the left side of the room</li>
        <li>Jump through the cavern and find Kalli</li>
    </ul>

    <h2>Kalli, the Corrupted</h2>
    <ul>
        <li>Split fireteam into 3 groups of 2</li>
        <li>Activate 9 plates around the room with 3 pairs of symbols in the middle</li>
        <li>Stay on safe sections of the plates while Taken Blights explode, 3-4 times</li>
        <li>Destroy Taken Knight; completing incorrect plate spawns Taken Ogre</li>
        <li>Assist other Guardians; once all 6 plates are complete, DPS begins</li>
        <li>Kalli will prepare Ontological Weapon; dodge doors, repeat steps, and save Kalli</li>
    </ul>

    <h2>Shuro Chi, the Corrupted</h2>
    <ul>
        <li>Shuro Chi begins to sing; kill Eye of Riven to drop Taken Blight</li>
        <li>Clear ads quickly; pick up 3 crystals to shoot to the person on the right</li>
        <li>After shield is down, begin DPS</li>
        <li>Puzzle Room: 9 Plates in 3x3 grid, complete symbols by starting left then clockwise</li>
        <li>Defeat all threats and repeat steps until final DPS phase</li>
    </ul>

    <h2>Morgeth, the Spirekeeper</h2>
    <ul>
        <li>Pick up Taken Str to begin; each Guardian can hold max 2</li>
        <li>Umbral Enervation randomly debuffs Taken Str holder</li>
        <li>Use Taken Blight ability to free debuffed person</li>
        <li>After 10th Taken Str, DPS begins</li>
        <li>Use Taken Blight Super to stop Morgeth from reaching 100% Str</li>
        <li>Target Orbs on Morgeth’s back to deal DPS</li>
    </ul>

    <h2>The Vault</h2>
    <ul>
        <li>4 Rooms: Middle (Combat), Garden, Temple, Spire</li>
        <li>Step on mid plates to start; match Keys to symbols (Penumbra/Antumbra)</li>
        <li>Callouts between rooms are essential for correct placement</li>
        <li>Kill Eyes of Riven, collect Taken Blights, and manage Might of Riven</li>
        <li>Cycle continues until all 3 Locks (9 Keys) are complete</li>
        <li>Use Supers/Heavies on Might of Riven; proceed to Riven of A Thousand Voices</li>
    </ul>

    <h2>Riven of A Thousand Voices</h2>
    <ul>
        <li>Split Fireteam into Team Blue / Team Yellow</li>
        <li>Stagger Riven by shooting glowing eyes; Team without Riven kills Eye of Riven</li>
        <li>Guide Taken Blights to correct symbols via window to unlock lifts</li>
        <li>Repeat stagger and DPS phases across floors until final stand</li>
        <li>Final Stand: parkour to acquire Taken Str, DPS Riven, destroy heart inside Riven</li>
    </ul>

    <h2>The Queenswalk</h2>
    <ul>
        <li>Heart of Riven chooses random runner</li>
        <li>Runner moves forward, cleanses Creeping Darkness, and counts down timer</li>
        <li>Grab Taken Str to reset timer; guide to Temple Room for final cleanses</li>
        <li>Chests appear on stairs; mission complete</li>
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
