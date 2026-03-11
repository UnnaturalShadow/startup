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

// =========================
// In-memory stores
// =========================
const users = new Map();      // key=email, value={ email, passwordHash }
const sessions = new Map();   // key=sessionId, value=email
const maps = {};              // key=code, value={ raid, encounter, lines }

// =========================
// Helper: Session
// =========================
function createSession(email) {
  const sessionId = uuidv4();
  sessions.set(sessionId, email);
  return sessionId;
}

// =========================
// Auth endpoints
// =========================

// Register
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

  res.json({ message: "Registration successful", email });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.get(email);
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const sessionId = createSession(email);

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({ message: "Login successful", email });
});

// Logout
app.post("/logout", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(400).json({ message: "Not logged in" });
  }

  sessions.delete(sessionId);
  res.clearCookie("sessionId");
  res.json({ message: "Logout successful" });
});

// Session check
app.get("/session", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId && sessions.has(sessionId)) {
    return res.json({ loggedIn: true, email: sessions.get(sessionId) });
  }
  res.status(401).json({ loggedIn: false });
});

// =========================
// Map code / rooms endpoints
// =========================

// Create a new map code
app.post("/maps", (req, res) => {
  const { raid, encounter, lines } = req.body;
  if (!raid || !encounter) return res.status(400).json({ error: "Missing raid or encounter" });

  // Generate unique code
  let code;
  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
  } while (maps[code]);

  maps[code] = { raid, encounter, lines: lines || [] };
  res.json({ code });
});

// Get map by code
app.get("/maps/:code", (req, res) => {
  const { code } = req.params;
  const map = maps[code];
  if (!map) return res.status(404).json({ error: "Code not found" });

  res.json(map);
});

// Update map lines (for collaborative drawing)
app.put("/maps/:code", (req, res) => {
  const { code } = req.params;
  const { lines } = req.body;
  if (!maps[code]) return res.status(404).json({ error: "Code not found" });

  maps[code].lines = lines;
  res.json({ success: true });
});

// =========================
// Start server
// =========================
app.listen(port, () => {
  console.log(`Auth + Maps service running on http://localhost:${port}`);
});