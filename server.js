const express = require("express");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./database.json";

/* ===== util db ===== */
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE));
  } catch {
    return [];
  }
}
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* ===== generate key ===== */
function generateKey() {
  return "API_" + crypto.randomBytes(16).toString("hex");
}

/* ===== CREATE KEY ===== */
app.post("/create-key", (req, res) => {
  const { name, duration } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name wajib diisi" });
  }

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

  const db = readDB();

  const newKey = {
    name,
    key: generateKey(),
    created: new Date().toLocaleString(),
    expired
  };

  db.push(newKey);
  saveDB(db);

  res.json({ apiKey: newKey.key });
});

/* ===== VALIDATE MIDDLEWARE ===== */
function validateApiKey(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json({ error: "API Key diperlukan" });
  }

  const db = readDB();
  const found = db.find(item => item.key === key);

  if (!found) {
    return res.status(403).json({ error: "API Key tidak valid" });
  }

  if (found.expired !== "PERMANENT") {
    if (Date.now() > found.expired) {
      return res.status(403).json({ error: "API Key expired" });
    }
  }

  next();
}

/* ===== PROTECTED ROUTE ===== */
app.get("/protected", validateApiKey, (req, res) => {
  res.json({ message: "Akses berhasil 🔥" });
});

/* ===== GET ALL KEYS  ===== */
app.get("/get-keys", (req, res) => {
  res.json(readDB());
});

/* ===== ROOT ===== */
app.get("/", (req, res) => {
  res.send("API SERVER RUNNING 🔥");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
