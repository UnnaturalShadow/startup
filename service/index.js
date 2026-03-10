import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Temporary in-memory user store (replace with DB later)
const users = new Map(); // key=email, value={ email, passwordHash }

// ===================== REGISTER =====================
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    if (users.has(email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    users.set(email, { email, passwordHash });

    return res.json({ message: "Registration successful", email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ===================== LOGIN =====================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = users.get(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password with hash
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Successful login
    return res.json({ message: "Login successful", email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ===================== START SERVER =====================
app.listen(port, () => {
  console.log(`Auth service running on http://localhost:${port}`);
});