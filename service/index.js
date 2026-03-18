const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config();

const DB = require("./database.js");

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

app.use(express.static("public"));

// =========================
// Auth Middleware
// =========================
async function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

  const session = await DB.getSession(sessionId);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  req.userEmail = session.email;
  next();
}

// =========================
// API Router
// =========================
const apiRouter = express.Router();
app.use("/api", apiRouter);

// ----- Auth -----
apiRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await DB.getUser(email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await DB.addUser({
    email,
    passwordHash,
    createdAt: new Date(),
  });

  const sessionId = uuidv4();
  await DB.createSession({ sessionId, email });

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ message: "Registration successful", email });
});

apiRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await DB.getUser(email);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const sessionId = uuidv4();
  await DB.createSession({ sessionId, email });

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ message: "Login successful", email });
});

apiRouter.post("/logout", async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    await DB.deleteSession(sessionId);
  }

  res.clearCookie("sessionId");
  res.json({ message: "Logout successful" });
});

apiRouter.get("/session", async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) return res.status(401).json({ loggedIn: false });

  const session = await DB.getSession(sessionId);
  if (!session) return res.status(401).json({ loggedIn: false });

  res.json({ loggedIn: true, email: session.email });
});

// ----- Maps -----
apiRouter.post("/maps", requireAuth, async (req, res) => {
  const { raid, encounter, lines } = req.body;

  if (!raid || !encounter) {
    return res.status(400).json({ error: "Missing raid or encounter" });
  }

  let code;
  let exists;

  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    exists = await DB.getMap(code);
  } while (exists);

  await DB.createMap({
    code,
    raid,
    encounter,
    lines: lines || [],
    owner: req.userEmail,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  res.json({ code });
});

apiRouter.get("/maps/:code", requireAuth, async (req, res) => {
  const map = await DB.getMap(req.params.code);
  if (!map) return res.status(404).json({ error: "Code not found" });
  res.json(map);
});

apiRouter.put("/maps/:code", requireAuth, async (req, res) => {
  const map = await DB.getMap(req.params.code);
  if (!map) return res.status(404).json({ error: "Code not found" });

  await DB.updateMap(req.params.code, req.body.lines);
  res.json({ success: true });
});

// ----- Bungie -----
const MY_ACCOUNT = {
  membershipType: 3,
  membershipId: "4611686018497927740",
};

const BUNGIE_API_KEY = process.env.VITE_BUNGIE_API_KEY;

apiRouter.get("/player", (_req, res) => {
  res.json(MY_ACCOUNT);
});

// ----- Insult -----
apiRouter.get("/insult", async (_req, res) => {
  try {
    const response = await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json");
    const data = await response.json();
    res.json({ insult: data.insult });
  } catch {
    res.status(500).json({ insult: "Unable to insult at this time." });
  }
});

// =========================
// Fallback
// =========================
app.use((_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// =========================
// Start
// =========================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});