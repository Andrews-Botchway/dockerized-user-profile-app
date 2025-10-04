// server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve images statically

// MongoDB setup
const mongoUrl = process.env.MONGO_URL || `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:27017`;
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const databaseName = process.env.MONGO_DB || "my-db";

let dbClient;
let db;

// Connect to MongoDB
async function connectToMongo() {
  try {
    dbClient = await MongoClient.connect(mongoUrl, mongoClientOptions);
    db = dbClient.db(databaseName);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Redirect to default profile picture
app.get('/profile-picture', (req, res) => {
  res.redirect('/images/profile-1.jpg');
});

// Update profile
app.post('/update-profile', async (req, res) => {
  try {
    const userObj = { ...req.body, userid: 1 }; // Demo: fixed userid
    const result = await db.collection("users").findOneAndUpdate(
      { userid: 1 },
      { $set: userObj },
      { upsert: true, returnDocument: 'after' }
    );
    res.send(result.value);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send({ error: "Failed to update profile" });
  }
});

// Get profile
app.get('/get-profile', async (req, res) => {
  try {
    const result = await db.collection("users").findOne({ userid: 1 });
    res.send(result || {});
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).send({ error: "Failed to fetch profile" });
  }
});

// Start server
app.listen(PORT, async () => {
  await connectToMongo();
  console.log(`App listening on port ${PORT}`);
});

// Graceful shutdown
async function shutdown() {
  console.log("Closing MongoDB connection...");
  if (dbClient) await dbClient.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
module.exports = app; // For testing purposes