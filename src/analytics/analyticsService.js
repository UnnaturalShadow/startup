// No API key here; frontend calls your backend
const BACKEND = "/api";

export async function fetchPlayerAnalytics(username) {
  // Step 1: Search player
  const resPlayer = await fetch(`${BACKEND}/player/${username}`);
  if (!resPlayer.ok) throw new Error("Player not found");
  const player = await resPlayer.json();

  // Step 2: Fetch recent activities
  const resActivities = await fetch(
    `${BACKEND}/activities/${player.membershipType}/${player.membershipId}`
  );
  if (!resActivities.ok) throw new Error("Failed to fetch activities");
  const activitiesRaw = await resActivities.json();

  const activities = activitiesRaw.map((a, i) => ({
    id: i,
    name: "Activity",
    date: new Date(a.period).toLocaleDateString(),
    duration: a.values.activityDurationSeconds?.basic.displayValue || "0",
    kills: Number(a.values.kills?.basic.value || 0),
    deaths: Number(a.values.deaths?.basic.value || 0),
    score: Number(a.values.score?.basic.value || 0),
    completed: a.values.completed?.basic.value === 1,
  }));

  return {
    profile: {
      name: player.displayName,
      lightLevel: "Unknown",
      class: "Unknown",
      lastLogin: new Date().toLocaleDateString(),
    },
    activities,
  };
}