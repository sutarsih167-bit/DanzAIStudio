const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = "database.json";

/* INIT DB */
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

/* LOAD DB */
function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE));
  } catch {
    return [];
  }
}

/* SAVE DB */
function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Gagal simpan DB:", err);
  }
}

/* ROOT */
app.get("/", (req, res) => {
  res.send("API SERVER AKTIF 🔥");
});

/* CREATE KEY */
app.post("/create-key", (req, res) => {
  try {
    const body = req.body || {};
    const name = body.name || "NoName";
    const duration = body.duration || "PERMANENT";

    const key = "API_" + Math.random().toString(36).substring(2, 12);

    const now = Date.now();
    let expired = null;

    if (duration === "10 DAY") expired = now + 10 * 86400000;
    else if (duration === "20 DAY") expired = now + 20 * 86400000;
    else if (duration === "30 DAY") expired = now + 30 * 86400000;
    else if (duration === "50 DAY") expired = now + 50 * 86400000;
    else expired = "PERMANENT";

    const db = loadDB();

    db.push({
      name,
      key,
      created: now,
      expired
    });

    saveDB(db);

    res.json({ success: true, apiKey: key });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/* CHECK KEY */
app.post("/check-key", (req, res) => {
  try {
    const body = req.body || {};
    const key = body.key;

    if (!key) {
      return res.json({ valid: false, message: "Key kosong" });
    }

    const db = loadDB();
    const found = db.find(k => k.key === key);

    if (!found) {
      return res.json({ valid: false, message: "Key tidak ditemukan" });
    }

    if (found.expired !== "PERMANENT" && Date.now() > found.expired) {
      return res.json({ valid: false, message: "Key expired" });
    }

    res.json({ valid: true, data: found });

  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, error: "Server error" });
  }
});

/* LIST */
app.get("/keys", (req, res) => {
  try {
    const db = loadDB();
    res.json(db);
  } catch {
    res.json([]);
  }
});

/* DELETE KEY */
app.post("/delete-key", (req, res) => {
  try {
    const body = req.body || {};
    const key = body.key;

    if (!key) {
      return res.json({ success: false, message: "Key kosong" });
    }

    let db = loadDB();

    const newDB = db.filter(k => k.key !== key);

    saveDB(newDB);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* GLOBAL ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err);
  res.status(500).json({ error: "Terjadi kesalahan" });
});

/* START */
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server jalan di http://localhost:" + PORT);
});
