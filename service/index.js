import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from 'url';
import 'dotenv/config';

import * as DB from './database.js';

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

app.use(express.static(path.resolve(__dirname, 'public')));

// =========================
// Auth Middleware (DB-based)
// =========================
async function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const session = await db.getSession(sessionId);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

  const existingUser = await db.getUser(email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email,
    passwordHash,
    createdAt: new Date(),
  };

  await db.addUser(user);

  const sessionId = uuidv4();
  await db.createSession({ sessionId, email });

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ message: "Registration successful", email });
});

apiRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.getUser(email);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const sessionId = uuidv4();
  await db.createSession({ sessionId, email });

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ message: "Login successful", email });
});

apiRouter.post("/logout", async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    await db.deleteSession(sessionId);
  }

  res.clearCookie("sessionId");
  res.json({ message: "Logout successful" });
});

apiRouter.get("/session", async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ loggedIn: false });
  }

  const session = await db.getSession(sessionId);

  if (!session) {
    return res.status(401).json({ loggedIn: false });
  }

  res.json({ loggedIn: true, email: session.email });
});

// ----- Maps (DB-backed) -----
apiRouter.post("/maps", requireAuth, async (req, res) => {
  const { raid, encounter, lines } = req.body;

  if (!raid || !encounter) {
    return res.status(400).json({ error: "Missing raid or encounter" });
  }

  let code;
  let exists;

  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    exists = await db.getMap(code);
  } while (exists);

  const map = {
    code,
    raid,
    encounter,
    lines: lines || [],
    owner: req.userEmail,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.createMap(map);

  res.json({ code });
});

apiRouter.get("/maps/:code", requireAuth, async (req, res) => {
  const map = await db.getMap(req.params.code);

  if (!map) {
    return res.status(404).json({ error: "Code not found" });
  }

  res.json(map);
});

apiRouter.put("/maps/:code", requireAuth, async (req, res) => {
  const map = await db.getMap(req.params.code);

  if (!map) {
    return res.status(404).json({ error: "Code not found" });
  }

  await db.updateMap(req.params.code, req.body.lines);

  res.json({ success: true });
});