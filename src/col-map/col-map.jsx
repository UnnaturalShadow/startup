import React from "react";
import "./map.css";
import vogMap from "/vog_map.png"; // adjust path if needed

export function ColMap() {
  return (
    <main className="col-map-page">

      {/* Selection controls */}
      <section className="map-controls">
        <label>
          Raid:
          <select>
            <option>Vault of Glass</option>
            <option>King's Fall</option>
            <option>Vow of the Disciple</option>
            <option>Crota's End</option>
            <option>Garden of Salvation</option>
            <option>Deep Stone Crypt</option>
          </select>
        </label>

        <label>
          Encounter:
          <select>
            <option>Encounter 1</option>
            <option>Encounter 2</option>
            <option>Encounter 3</option>
            <option>Encounter 4</option>
            <option>Encounter 5</option>
            <option>Encounter 6</option>
          </select>
        </label>

        <button>Load Map</button>
      </section>

      {/* Map display */}
      <section className="map-area">
        <div className="map-placeholder">
          <img src={vogMap} alt="Collaborative Map Placeholder" />
        </div>
      </section>

      {/* Collaboration */}
      <section className="collab">
        <div className="share">
          <h3>Share This Map</h3>
          <button>Generate Code</button>
        </div>

        <div className="join">
          <h3>Join a Map</h3>
          <input type="text" placeholder="Enter code" />
          <button>Join</button>
        </div>
      </section>

    </main>
  );
}
