const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// file database sederhana
const DB_PATH = path.join(__dirname, "database.json");

// buat file kalau belum ada
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

// ambil data
function getData() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

// simpan data
function saveData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// generate random API key
function generateKey() {
  return "API_" + Math.random().toString(36).substring(2, 12);
}

// ======================
// CREATE API KEY
// ======================
app.post("/create-key", (req, res) => {
  try {
    const { name, duration } = req.body || {};

    if (!name) {
      return res.json({ error: "Name wajib diisi" });
    }

    const key = generateKey();
    const now = Date.now();

    let expired = null;

    if (duration === "10 DAY") expired = now + 10 * 86400000;
    if (duration === "20 DAY") expired = now + 20 * 86400000;
    if (duration === "30 DAY") expired = now + 30 * 86400000;
    if (duration === "50 DAY") expired = now + 50 * 86400000;
    if (duration === "PERMANENT") expired = "PERMANENT";

    const newData = {
      name,
      key,
      created: now,
      expired
    };

    const db = getData();
    db.push(newData);
    saveData(db);

    res.json({ apiKey: key });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ======================
// CHECK API KEY
// ======================
app.post("/check-key", (req, res) => {
  try {
    const { key } = req.body || {};

    if (!key) {
      return res.json({ valid: false });
    }

    const db = getData();

    const found = db.find(item => item.key === key);

    if (!found) {
      return res.json({ valid: false });
    }

    if (found.expired !== "PERMANENT") {
      if (Date.now() > found.expired) {
        return res.json({ valid: false, reason: "expired" });
      }
    }

    res.json({
      valid: true,
      data: found
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ======================
// ROOT TEST
// ======================
app.get("/", (req, res) => {
  res.send("API SERVER RUNNING 🔥");
});

// ======================
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
