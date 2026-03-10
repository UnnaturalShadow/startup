import express from "express";
import fetch from "node-fetch"; // or global fetch in Node 18+
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 4000;
const API_KEY = process.env.BUNGIE_API_KEY;
const BASE = "https://www.bungie.net/Platform";

app.use(express.json());

// Search player across all platforms
app.get("/api/player/:username", async (req, res) => {
  const { username } = req.params;
  const membershipTypes = [1, 2, 3]; // Xbox, PSN, Steam

  try {
    for (const type of membershipTypes) {
      const response = await fetch(
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

      if (!response.ok) continue;

      const json = await response.json();
      if (json.Response && json.Response.length > 0) {
        const player = json.Response[0];
        return res.json(player);
      }
    }

    res.status(404).json({ error: "Player not found on any platform" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bungie API request failed" });
  }
});

// Fetch activities for a given player
app.get("/api/activities/:membershipType/:membershipId", async (req, res) => {
  const { membershipType, membershipId } = req.params;

  try {
    const response = await fetch(
      `${BASE}/Destiny2/${membershipType}/Account/${membershipId}/Character/0/Stats/Activities/?count=10`,
      {
        headers: {
          "X-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch activities" });
    }

    const json = await response.json();
    const activities = json.Response.activities || [];
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));