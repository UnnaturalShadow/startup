const API_KEY = import.meta.env.VITE_BUNGIE_API_KEY;

console.log("Bungie API Key:", API_KEY);

const BASE = "https://www.bungie.net/Platform";

// Step 1: try to find the player by username across platforms
async function searchPlayer(username) {
  const membershipTypes = [1, 2, 3]; // Xbox, PSN, Steam

  for (const type of membershipTypes) {
    const res = await fetch(
      `${BASE}/Destiny2/SearchDestinyPlayerByBungieName/${type}/`,
      {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName: username }),
      }
    );

    if (!res.ok) continue; // skip if endpoint fails

    const json = await res.json();
    if (json.Response && json.Response.length > 0) {
      const player = json.Response[0];
      return {
        membershipId: player.membershipId,
        membershipType: player.membershipType,
        name: player.displayName,
      };
    }
  }

  throw new Error("Player not found on any platform");
}

// Step 2: fetch profile info
async function fetchProfile(membershipType, membershipId) {
  const res = await fetch(
    `${BASE}/Destiny2/${membershipType}/Profile/${membershipId}/`,
    {
      headers: {
        "X-API-Key": API_KEY,
      },
    }
  );

  const json = await res.json();
  if (!json.Response) throw new Error("Failed to fetch profile");

  // grab first character as example
  const characterId = Object.keys(json.Response.characters.data)[0];
  const character = json.Response.characters.data[characterId];

  return {
    characterId,
    lightLevel: character.light,
    class: character.classType,
    lastLogin: new Date(character.dateLastPlayed).toLocaleDateString(),
  };
}

// Step 3: fetch recent activities for character
async function fetchActivities(membershipType, membershipId, characterId) {
  const res = await fetch(
    `${BASE}/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/`,
    {
      headers: {
        "X-API-Key": API_KEY,
      },
    }
  );

  const json = await res.json();
  return json.Response.activities || [];
}

// Main function
export async function fetchPlayerAnalytics(username) {
  const player = await searchPlayer(username);
  const profileData = await fetchProfile(player.membershipType, player.membershipId);
  const activitiesRaw = await fetchActivities(
    player.membershipType,
    player.membershipId,
    profileData.characterId
  );

  const activities = activitiesRaw.map((a, i) => ({
    id: i,
    name: a.activityDetails?.referenceId || `Activity ${i + 1}`,
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
      lightLevel: profileData.lightLevel,
      class: profileData.class,
      lastLogin: profileData.lastLogin,
    },
    activities,
  };
}