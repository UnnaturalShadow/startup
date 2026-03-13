import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// =========================
// Middleware
// =========================
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://startup.unnaturalshadow.com",
  credentials: true
}));

// Serve static React build
app.use(express.static(path.resolve(__dirname, 'public')));

// =========================
// In-memory stores
// =========================
const users = new Map();
const sessions = new Map();
const maps = {};

// =========================
// Helpers
// =========================
function createSession(email) {
  const sessionId = uuidv4();
  sessions.set(sessionId, email);
  return sessionId;
}

function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;
  if (sessionId && sessions.has(sessionId)) {
    req.userEmail = sessions.get(sessionId);
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// =========================
// API Router
// =========================
const apiRouter = express.Router();
app.use("/api", apiRouter);

// ----- Auth -----
apiRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (users.has(email)) return res.status(400).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash });

  const sessionId = createSession(email);
  res.cookie("sessionId", sessionId, { httpOnly: true, sameSite: "lax" });

  res.json({ message: "Registration successful", email });
});

apiRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const sessionId = createSession(email);
  res.cookie("sessionId", sessionId, { httpOnly: true, sameSite: "lax" });

  res.json({ message: "Login successful", email });
});

apiRouter.post("/logout", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) sessions.delete(sessionId);
  res.clearCookie("sessionId");
  res.json({ message: "Logout successful" });
});

apiRouter.get("/session", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId && sessions.has(sessionId)) {
    return res.json({ loggedIn: true, email: sessions.get(sessionId) });
  }
  res.status(401).json({ loggedIn: false });
});

// ----- Maps (restricted) -----
apiRouter.post("/maps", requireAuth, (req, res) => {
  const { raid, encounter, lines } = req.body;
  if (!raid || !encounter) return res.status(400).json({ error: "Missing raid or encounter" });

  let code;
  do { code = Math.random().toString(36).substring(2, 8).toUpperCase(); } while (maps[code]);

  maps[code] = { raid, encounter, lines: lines || [] };
  res.json({ code });
});

apiRouter.get("/maps/:code", requireAuth, (req, res) => {
  const map = maps[req.params.code];
  if (!map) return res.status(404).json({ error: "Code not found" });
  res.json(map);
});

apiRouter.put("/maps/:code", requireAuth, (req, res) => {
  const map = maps[req.params.code];
  if (!map) return res.status(404).json({ error: "Code not found" });

  map.lines = req.body.lines;
  res.json({ success: true });
});

// =========================
// Bungie Analytics Endpoints (live, your account only)
// =========================
const MY_ACCOUNT = {
  membershipType: 3, // Xbox
  membershipId: "4611686018497927740",
  displayName: "UnnaturalShadow",
};

const BUNGIE_API_KEY = process.env.VITE_BUNGIE_API_KEY;

// Fetch player profile (hard-coded)
apiRouter.get("/player", (_req, res) => {
  res.json(MY_ACCOUNT);
});

// Fetch recent activities for first character
apiRouter.get("/activities/:membershipType/:membershipId", async (_req, res) => {
  try {
    const { membershipType, membershipId } = MY_ACCOUNT;

    // 1. Fetch profile to get character IDs
    const profileUrl = `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=200`;
    const profileRes = await fetch(profileUrl, {
      headers: { "X-API-Key": BUNGIE_API_KEY }
    });
    const profileJson = await profileRes.json();
    const characters = profileJson.Response?.characters?.data;
    if (!characters) return res.json([]);

    // 2. Pick first character
    const firstCharId = Object.keys(characters)[0];

    // 3. Fetch activities for that character
    const activitiesUrl = `https://www.bungie.net/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/${firstCharId}/Stats/Activities/`;
    const activitiesRes = await fetch(activitiesUrl, {
      headers: { "X-API-Key": BUNGIE_API_KEY }
    });
    const activitiesJson = await activitiesRes.json();
    const activitiesRaw = activitiesJson.Response?.activities || [];

    // 4. Map to frontend-friendly format
    const activities = activitiesRaw.map((a, i) => ({
      id: i,
      name: a.activityDetails?.referenceId || "Activity",
      period: a.period,
      duration: a.values.activityDurationSeconds?.basic.displayValue || "0",
      kills: Number(a.values.kills?.basic.value || 0),
      deaths: Number(a.values.deaths?.basic.value || 0),
      score: Number(a.values.score?.basic.value || 0),
      completed: a.values.completed?.basic.value === 1,
    }));

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// =========================
// SPA fallback (non-API routes)
// =========================
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// =========================
// Start server
// =========================
app.listen(port, () => {
  console.log(`Auth + Maps + Analytics service running on http://localhost:${port}`);

  
});

// =========================
// EvilInsult API Endpoint
// =========================

apiRouter.get("/insult", async (_req, res) => {
  try {
    const apiUrl = "https://evilinsult.com/generate_insult.php?lang=en&type=json";

    // Fetch insult via backend to avoid CORS
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("EvilInsult API error");

    const data = await response.json(); // { insult: "..." }
    res.json({ insult: data.insult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ insult: "Unable to insult at this time." });
  }
});