const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const app = express();

// Use built-in body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images, CSS, JS)
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(__dirname)); // serves index.html and any other static files

// MongoDB setup
const mongoUrlLocal = "mongodb://admin:password@localhost:27017";
const mongoUrlDocker = "mongodb://admin:password@mongodb";
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const databaseName = "my-db";

let db; // will hold our DB connection

// Connect to MongoDB once
MongoClient.connect(mongoUrlLocal, mongoClientOptions)
  .then(client => {
    db = client.db(databaseName);
    console.log("Connected to MongoDB");

    // Start server only after DB connection
    app.listen(3000, () => console.log("App listening on port 3000!"));
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Routes

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get profile picture (served via static route now, optional)
app.get('/profile-picture', (req, res) => {
  res.sendFile(path.join(__dirname, 'images/profile-1.jpg'));
});

// Update profile
app.post('/update-profile', async (req, res) => {
  try {
    let userObj = req.body;
    userObj.userid = 1; // hardcoded example

    const myquery = { userid: 1 };
    const newvalues = { $set: userObj };

    await db.collection("users").updateOne(myquery, newvalues, { upsert: true });
    res.json(userObj);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Database error' });
  }
});

// Get profile
app.get('/get-profile', async (req, res) => {
  try {
    const myquery = { userid: 1 };
    const result = await db.collection("users").findOne(myquery);
    res.json(result || {});
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Database error' });
  }
});
