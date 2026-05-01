const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = "./database.json";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function generateKey() {
  return "API_" + Math.random().toString(36).substring(2, 10);
}

/* CREATE API */
app.post("/create-key", (req, res) => {
  const { name, duration } = req.body;

  if (!name) {
    return res.json({ error: "Name wajib diisi" });
  }

  const db = readDB();

  const now = Date.now();
  let expired = null;

  const map = {
    "10 DAY": 10,
    "20 DAY": 20,
    "30 DAY": 30,
    "50 DAY": 50
  };

  if (map[duration]) {
    expired = now + map[duration] * 86400000;
  } else {
    expired = "PERMANENT";
  }

  const newData = {
    name,
    key: generateKey(),
    created: new Date().toLocaleString(),
    expired
  };

  db.push(newData);
  saveDB(db);

  res.json({ apiKey: newData.key });
});

/* GET ALL API */
app.get("/get-keys", (req, res) => {
  const db = readDB();
  res.json(db);
});

/* CHECK API */
app.post("/check-key", (req, res) => {
  const { key } = req.body;

  const db = readDB();

  const found = db.find(item => item.key === key);

  if (!found) {
    return res.json({ valid: false });
  }

  if (found.expired !== "PERMANENT" && Date.now() > found.expired) {
    return res.json({ valid: false, reason: "expired" });
  }

  res.json({ valid: true, data: found });
});

/* ROOT */
app.get("/", (req, res) => {
  res.send("API SERVER RUNNING 🔥");
});

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
