import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// In-memory stores
const users = new Map(); // key=email, value={ email, passwordHash }
const sessions = new Map(); // key=sessionId, value=email

// Helper to create a new session
function createSession(email) {
  const sessionId = uuidv4();
  sessions.set(sessionId, email);
  return sessionId;
}

// Helper to get user email from sessionId
function getEmailFromSession(sessionId) {
  return sessions.get(sessionId);
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

  res.json({ message: "Registration successful", email, sessionId });
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

  res.json({ message: "Login successful", email, sessionId });
});

// Logout endpoint
app.post("/logout", (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(400).json({ message: "Not logged in" });
  }

  sessions.delete(sessionId);
  res.json({ message: "Logout successful" });
});

// Optional: session check
app.post("/session", (req, res) => {
  const { sessionId } = req.body;

  if (sessionId && sessions.has(sessionId)) {
    return res.json({ loggedIn: true, email: sessions.get(sessionId) });
  }

  res.json({ loggedIn: false });
});

app.listen(port, () => {
  console.log(`Auth service running on http://localhost:${port}`);
});