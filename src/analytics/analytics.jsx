import React from "react";
import "./analytics.css";
import { fetchPlayerAnalytics } from "./analyticsService";

export function Analytics() {
  const [username, setUsername] = React.useState("");
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function handleFetch() {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchPlayerAnalytics(username);
      setData(result);
    } catch (err) {
      setError("Failed to fetch player data.");
    } finally {
      setLoading(false);
    }
  }

  // Derived stats
  const totalActivities = data?.activities.length || 0;
  const totalKills =
    data?.activities.reduce((sum, a) => sum + a.kills, 0) || 0;
  const totalDeaths =
    data?.activities.reduce((sum, a) => sum + a.deaths, 0) || 0;
  const averageKills =
    totalActivities > 0 ? (totalKills / totalActivities).toFixed(1) : 0;
  const averageDeaths =
    totalActivities > 0 ? (totalDeaths / totalActivities).toFixed(1) : 0;
  const winRate =
    totalActivities > 0
      ? (
          (data.activities.filter((a) => a.completed).length /
            totalActivities) *
          100
        ).toFixed(1)
      : 0;

  return (
    <main className="guide-page">
      <h1>Player Activity Analytics</h1>

      {/* Username Input */}
      <section>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleFetch();
    }}
  >
    <input
      type="text"
      placeholder="Enter Bungie Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <button
      type="submit"
      disabled={!username || loading}
    >
      {loading ? "Loading..." : "Fetch Stats"}
    </button>
  </form>
</section>

      {data && (
        <>
          {/* Player Profile */}
          <section className="profile">
            <h2>Player Profile</h2>
            <p>Name: {data.profile.name}</p>
            <p>Light Level: {data.profile.lightLevel}</p>
            <p>Class: {data.profile.class}</p>
            <p>Last Login: {data.profile.lastLogin}</p>
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
                  {data.activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.name}</td>
                      <td>{activity.date}</td>
                      <td>{activity.duration}</td>
                      <td>{activity.kills}</td>
                      <td>{activity.deaths}</td>
                      <td>{activity.score}</td>
                      <td>
                        {activity.completed ? "Completed" : "Failed"}
                      </td>
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
              <li>Total Activities: {totalActivities}</li>
              <li>Total Kills: {totalKills}</li>
              <li>Total Deaths: {totalDeaths}</li>
              <li>Average Kills per Activity: {averageKills}</li>
              <li>Average Deaths per Activity: {averageDeaths}</li>
              <li>Win Rate: {winRate}%</li>
            </ul>
          </section>
        </>
      )}

      {!data && !loading && (
        <section className="notes">
          <h2>Notes</h2>
          <p>
            Enter a Bungie username above to load player stats. This
            currently uses mock data and will be connected to the Bungie
            API later.
          </p>
        </section>
      )}
    </main>
  );
}
