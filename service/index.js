const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());

// ------------------------------
// In-memory storage
// ------------------------------

const users = [];
const authTokens = {};
const maps = {};

let nextMapId = 1;

// ------------------------------
// Helper functions
// ------------------------------

function generateAuthToken() {
  return uuid.v4();
}

function generateSessionCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// ------------------------------
// Auth Middleware
// ------------------------------

function authCookie(req, res, next) {
  const token = req.cookies.token;

  if (!token || !authTokens[token]) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  req.user = authTokens[token];
  next();
}

// ------------------------------
// Authentication Endpoints
// ------------------------------

// Register
app.post('/api/auth/create', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).send({ error: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email,
    password: passwordHash,
  };

  users.push(user);

  const token = generateAuthToken();
  authTokens[token] = user;

  res.cookie('token', token, { httpOnly: true });
  res.send({ email: user.email });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  const token = generateAuthToken();
  authTokens[token] = user;

  res.cookie('token', token, { httpOnly: true });
  res.send({ email: user.email });
});

// Logout
app.delete('/api/auth/logout', (req, res) => {
  const token = req.cookies.token;

  if (token) {
    delete authTokens[token];
  }

  res.clearCookie('token');
  res.send({ status: 'logged out' });
});

// ------------------------------
// Example Restricted Endpoint
// ------------------------------

app.get('/api/user/me', authCookie, (req, res) => {
  res.send({ email: req.user.email });
});

// ------------------------------
// Map Session Endpoints
// ------------------------------

// Create map session
app.post('/api/maps', authCookie, (req, res) => {
  const { mapName } = req.body;

  const sessionCode = generateSessionCode();
  const mapId = nextMapId++;

  maps[mapId] = {
    mapId,
    mapName,
    sessionCode,
    owner: req.user.email,
    annotations: [],
  };

  res.send({
    mapId,
    sessionCode,
  });
});

// Join map session
app.post('/api/maps/join', authCookie, (req, res) => {
  const { sessionCode } = req.body;

  const map = Object.values(maps).find(m => m.sessionCode === sessionCode);

  if (!map) {
    return res.status(404).send({ error: 'Session not found' });
  }

  res.send({
    mapId: map.mapId,
    mapName: map.mapName,
  });
});

// Save annotation
app.post('/api/maps/:mapId/annotations', authCookie, (req, res) => {
  const map = maps[req.params.mapId];

  if (!map) {
    return res.status(404).send({ error: 'Map not found' });
  }

  const annotation = {
    user: req.user.email,
    ...req.body,
  };

  map.annotations.push(annotation);

  res.send({ status: 'saved' });
});

// Get annotations
app.get('/api/maps/:mapId/annotations', authCookie, (req, res) => {
  const map = maps[req.params.mapId];

  if (!map) {
    return res.status(404).send({ error: 'Map not found' });
  }

  res.send(map.annotations);
});

// ------------------------------
// Serve frontend
// ------------------------------

app.use(express.static('public'));

// ------------------------------
// Start server
// ------------------------------

app.listen(port, () => {
  console.log(`Service running on port ${port}`);
});