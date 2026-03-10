// /service/index.js
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// In-memory store (replace with DB later)
const users = new Map(); // key=email, value={ email, passwordHash }

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (users.has(email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash });

  res.json({ message: "Registration successful", email });
});

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

  res.json({ message: "Login successful", email });
});

app.listen(port, () => {
  console.log(`Auth service running on http://localhost:${port}`);
});