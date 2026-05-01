const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API SERVER AKTIF 🔥");
});

app.post("/create-key", (req, res) => {
  const key = "API_" + Math.random().toString(36).substring(2, 12);
  res.json({ apiKey: key });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server jalan di http://localhost:" + PORT);
});
