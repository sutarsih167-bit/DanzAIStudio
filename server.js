const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get("/", (req, res) => {
  res.send("API SERVER RUNNING 🔥");
});

app.post("/create-key", async (req, res) => {
  try {
    const { name, duration } = req.body;

    if (!name) {
      return res.json({ error: "Name wajib diisi" });
    }

    const apiKey = "KEY-" + Math.random().toString(36).substring(2, 12);

    let expired = null;
    const now = Date.now();

    if (duration === "10 DAY") expired = now + 10 * 86400000;
    if (duration === "20 DAY") expired = now + 20 * 86400000;
    if (duration === "30 DAY") expired = now + 30 * 86400000;
    if (duration === "50 DAY") expired = now + 50 * 86400000;
    if (duration === "PERMANENT") expired = "PERMANENT";

    await db.collection("apiKeys").doc(apiKey).set({
      name,
      apiKey,
      duration,
      created: new Date().toISOString(),
      expired
    });

    res.json({ apiKey });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const checkApiKey = async (req, res, next) => {
  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json({ error: "API key kosong" });
  }

  const doc = await db.collection("apiKeys").doc(key).get();

  if (!doc.exists) {
    return res.status(403).json({ error: "API key tidak valid" });
  }

  const data = doc.data();

  if (data.expired !== "PERMANENT" && Date.now() > data.expired) {
    return res.status(403).json({ error: "API key expired" });
  }

  next();
};

app.get("/protected", checkApiKey, (req, res) => {
  res.json({ message: "Akses berhasil 🔥" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
