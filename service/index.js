import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import { bungieService } from "./bungie.js";
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
// SPA fallback (non-API routes)
// =========================
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// =========================
// Start server
// =========================
app.listen(port, () => {
  console.log(`Auth + Maps service running on http://localhost:${port}`);
});