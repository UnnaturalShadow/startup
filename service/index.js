import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import { bungieService } from "./bungie.js";
import 'dotenv/config';

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));

app.use(cors({
origin: "http://localhost:5173",
credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// In-memory stores
const users = new Map();      // key=email, value={ email, passwordHash }
const sessions = new Map();   // key=sessionId, value=email

// Helper to create a new session
function createSession(email) {
const sessionId = uuidv4();
sessions.set(sessionId, email);
return sessionId;
}

// Register endpoint
app.post("/register", async (req, res) => {
const { email, password } = req.body;

if (users.has(email)) {
return res.status(400).json({ message: "User already exists" });
}

const passwordHash = await bcrypt.hash(password, 10);
users.set(email, { email, passwordHash });

const sessionId = createSession(email);

res.cookie("sessionId", sessionId, {
httpOnly: true,
sameSite: "lax"
});

res.json({
message: "Registration successful",
email
});
});

// Login endpoint
app.post("/login", async (req, res) => {
const { email, password } = req.body;

const user = users.get(email);
if (!user) {
return res.status(400).json({ message: "User not found" });
}

const valid = await bcrypt.compare(password, user.passwordHash);
if (!valid) {
return res.status(401).json({ message: "Invalid password" });
}

const sessionId = createSession(email);

res.cookie("sessionId", sessionId, {
httpOnly: true,
sameSite: "lax"
});

res.json({
message: "Login successful",
email
});
});

// Logout endpoint
app.post("/logout", (req, res) => {
const sessionId = req.cookies.sessionId;

if (!sessionId || !sessions.has(sessionId)) {
return res.status(400).json({ message: "Not logged in" });
}

sessions.delete(sessionId);

res.clearCookie("sessionId");

res.json({ message: "Logout successful" });
});

// Session check endpoint
app.get("/session", (req, res) => {
const sessionId = req.cookies.sessionId;

if (sessionId && sessions.has(sessionId)) {
return res.json({
loggedIn: true,
email: sessions.get(sessionId)
});
}

res.status(401).json({
loggedIn: false
});
});

app.listen(port, () => {
console.log(`Auth service running on http://localhost:${port}`);
});


// --- Auth routes (register/login/logout/session) omitted for brevity ---


// --- Bungie API Routes ---

// GET /api/manifest
app.get("/api/manifest", async (req, res) => {
  try {
    const manifest = await bungieService.getManifest();
    res.json(manifest);
  } catch (err) {
    console.error("Error fetching manifest:", err);
    res.status(500).json({ error: "Failed to fetch manifest" });
  }
});

// GET /auth/callback?code=XXXX
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    const tokenData = await bungieService.exchangeCodeForToken(code);
    res.json(tokenData);
  } catch (err) {
    console.error("Error exchanging code:", err);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
});

// GET /api/player/:username using SearchDestinyPlayerByBungieName
app.get("/api/player/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Split displayName#code
    const [displayName, displayNameCode] = username.split("#");
    if (!displayName || !displayNameCode) {
      return res.status(400).json({ error: "Username must include #1234" });
    }

    const response = await fetch(
      `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayerByBungieName/-1/`,
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.BUNGIE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          displayNameCode: Number(displayNameCode),
        }),
      }
    );

    const data = await response.json();

    if (!data.Response || data.Response.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const player = data.Response[0];
    res.json({
      displayName: player.displayName,
      membershipType: player.membershipType,
      membershipId: player.membershipId,
    });
  } catch (err) {
    console.error("Error fetching player:", err);
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

// GET /api/activities/:membershipType/:membershipId
app.get("/api/activities/:membershipType/:membershipId", async (req, res) => {
  const { membershipType, membershipId } = req.params;
  const accessToken = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!accessToken) {
    return res.status(401).json({ error: "Missing access token" });
  }

  try {
    // Fetch profile to get character IDs
    const profileRes = await fetch(
      `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=200`,
      {
        headers: {
          "X-API-Key": process.env.BUNGIE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const profileData = await profileRes.json();
    if (!profileData.Response || !profileData.Response.characters) {
      return res.status(404).json({ error: "No characters found" });
    }

    const characterIds = Object.keys(profileData.Response.characters.data);

    let activities = [];
    for (const charId of characterIds) {
      const activitiesRes = await fetch(
        `https://www.bungie.net/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/${charId}/Stats/Activities/?count=10`,
        {
          headers: {
            "X-API-Key": process.env.BUNGIE_API_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const activitiesData = await activitiesRes.json();
      if (activitiesData.Response?.activities) {
        activities = activities.concat(activitiesData.Response.activities);
      }
    }

    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

app.listen(port, () => {
  console.log(`Auth + Bungie service running on http://localhost:${port}`);
});