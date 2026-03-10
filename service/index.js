import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// In-memory store (replace with DB later)
const users = new Map(); // key=email, value={ email, passwordHash }

// Keep track of logged-in users (for demo, sessionless)
const loggedIn = new Set();

// Register endpoint
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (users.has(email)) return res.status(400).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash });

  res.json({ message: "Registration successful", email });
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);

  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  // Mark user as logged in
  loggedIn.add(email);

  res.json({ message: "Login successful", email });
});

// New logout endpoint
app.post("/logout", (req, res) => {
  const { email } = req.body;

  if (loggedIn.has(email)) {
    loggedIn.delete(email);
    res.json({ message: "Logout successful" });
  } else {
    res.status(400).json({ message: "User was not logged in" });
  }
});

app.listen(port, () => {
  console.log(`Auth service running on http://localhost:${port}`);
});