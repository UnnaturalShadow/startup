const API_KEY = import.meta.env.VITE_BUNGIE_API_KEY;
const BASE = "https://www.bungie.net/Platform";

// Step 1: find the player by Bungie name
async function searchPlayer(username) {
  const res = await fetch(`${BASE}/User/Search/GlobalName/0/`, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      displayNamePrefix: username,
    }),
  });

  const json = await res.json();

  if (!json.Response || json.Response.searchResults.length === 0) {
    throw new Error("Player not found");
  }

  const player = json.Response.searchResults[0].destinyMemberships[0];

  return {
    membershipId: player.membershipId,
    membershipType: player.membershipType,
    name: player.displayName,
  };
}

// Step 2: fetch recent activities
async function fetchActivities(membershipType, membershipId) {
  const res = await fetch(
    `${BASE}/Destiny2/${membershipType}/Account/${membershipId}/Character/0/Stats/Activities/?count=10`,
    {
      headers: {
        "X-API-Key": API_KEY,
      },
    }
  );

  const json = await res.json();
  return json.Response.activities || [];
}

export async function fetchPlayerAnalytics(username) {
  const player = await searchPlayer(username);

  const activitiesRaw = await fetchActivities(
    player.membershipType,
    player.membershipId
  );

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
      name: player.name,
      lightLevel: "Unknown",
      class: "Unknown",
      lastLogin: new Date().toLocaleDateString(),
    },
    activities,
  };
}