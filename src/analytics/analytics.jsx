import React from "react";
import "./analytics.css";

export function Analytics() {
  return (
    <main className="guide-page">
      <h1>Player Activity Analytics</h1>
      <p>This page will display player stats fetched from the Bungie API.</p>

      {/* Player Profile */}
      <section className="profile">
        <h2>Player Profile</h2>
        <p>Name: <span className="placeholder">--</span></p>
        <p>Light Level: <span className="placeholder">--</span></p>
        <p>Class: <span className="placeholder">--</span></p>
        <p>Last Login: <span className="placeholder">--</span></p>
      </section>

      {/* Recent Activities */}
      <section className="recent-activities">
        <h2>Recent Activities</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Activity Name</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Kills</th>
                <th>Deaths</th>
                <th>Score</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {Array(3).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(7).fill("--").map((val, j) => <td key={j}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Overall Stats */}
      <section className="overall-stats">
        <h2>Overall Stats</h2>
        <ul>
          <li>Total Activities: <span className="placeholder">--</span></li>
          <li>Total Kills: <span className="placeholder">--</span></li>
          <li>Total Deaths: <span className="placeholder">--</span></li>
          <li>Average Kills per Activity: <span className="placeholder">--</span></li>
          <li>Average Deaths per Activity: <span className="placeholder">--</span></li>
          <li>Win Rate: <span className="placeholder">--%</span></li>
        </ul>
      </section>

      {/* Notes */}
      <section className="notes">
        <h2>Notes</h2>
        <p>All stats are placeholders. Once connected to the Bungie API, this page will dynamically display real-time player activity and performance data.</p>
      </section>
    </main>
  );
}
