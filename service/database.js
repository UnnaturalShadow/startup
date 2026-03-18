const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

const db = client.db('raid');

const userCollection = db.collection('user');
const sessionCollection = db.collection('session');
const mapCollection = db.collection('map');

// =========================
// Test DB connection
// =========================
(async function testConnection() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

// =========================
// User Functions
// =========================
function getUser(email) {
  return userCollection.findOne({ email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne(
    { email: user.email },
    { $set: user }
  );
}

// =========================
// Session Functions
// =========================
async function createSession(session) {
  await sessionCollection.insertOne(session);
}

function getSession(sessionId) {
  return sessionCollection.findOne({ sessionId });
}

async function deleteSession(sessionId) {
  await sessionCollection.deleteOne({ sessionId });
}

// =========================
// Map Functions
// =========================
async function createMap(map) {
  await mapCollection.insertOne(map);
}

function getMap(code) {
  return mapCollection.findOne({ code });
}

async function updateMap(code, lines) {
  await mapCollection.updateOne(
    { code },
    { $set: { lines, updatedAt: new Date() } }
  );
}

// =========================
// Exports
// =========================
module.exports = {
  // users
  getUser,
  getUserByToken,
  addUser,
  updateUser,

  // sessions
  createSession,
  getSession,
  deleteSession,

  // maps
  createMap,
  getMap,
  updateMap,
};