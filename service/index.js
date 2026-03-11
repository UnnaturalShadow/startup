import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 5000;

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
