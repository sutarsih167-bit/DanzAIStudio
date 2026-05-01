require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// =======================
// 🔥 FIREBASE INIT
// =======================
let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

  // FIX PRIVATE KEY (WAJIB)
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

} catch (err) {
  console.error("❌ FIREBASE_KEY error:", err.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// =======================
// 🔐 MIDDLEWARE API KEY
// =======================
async function checkApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API key required" });
  }

  try {
    const snapshot = await db.collection("apiKeys").get();

    let valid = false;

    snapshot.forEach(doc => {
      if (doc.data().apiKey === apiKey) {
        valid = true;
      }
    });

    if (!valid) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// =======================
// 🚀 ROUTES
// =======================

// TEST ROOT
app.get("/", (req, res) => {
  res.send("🔥 API DANZAI STUDIO READY");
});

// PROTECTED ROUTE
app.get("/protected", checkApiKey, (req, res) => {
  res.json({
    success: true,
    message: "Akses berhasil pakai API key 🔑"
  });
});

// =======================
// ▶️ START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server jalan di port ${PORT}`);
});
