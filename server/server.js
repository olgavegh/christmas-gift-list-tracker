import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pathData = join(dirname(fileURLToPath(import.meta.url)), "", "data.json");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Helper to read data
function readData() {
  return JSON.parse(fs.readFileSync(pathData, "utf8"));
}

// Helper to write data
function writeData(data) {
  fs.writeFileSync(pathData, JSON.stringify(data, null, 2));
}

// GET all gifts
app.get("/api/gifts", (req, res) => {
  const data = readData();
  res.json(data);
});

// GET one gift by id
app.get("/api/gifts/:id", (req, res) => {
  const data = readData();
  const gift = data.find((g) => g.id === Number(req.params.id));
  if (gift) {
    res.json(gift);
  } else {
    res.status(404).json({ error: "Gift not found" });
  }
});

// CREATE a new gift
app.post("/api/gifts", (req, res) => {
  const data = readData();
  const newGift = req.body;
  newGift.id = data.length ? Math.max(...data.map((g) => g.id)) + 1 : 1;
  data.push(newGift);
  writeData(data);
  res.status(201).json(newGift);
});

// UPDATE a gift
app.put("/api/gifts/:id", (req, res) => {
  const data = readData();
  const idx = data.findIndex((g) => g.id === Number(req.params.id));
  if (idx !== -1) {
    data[idx] = { ...data[idx], ...req.body, id: data[idx].id };
    writeData(data);
    res.json(data[idx]);
  } else {
    res.status(404).json({ error: "Gift not found" });
  }
});

// DELETE a gift
app.delete("/api/gifts/:id", (req, res) => {
  let data = readData();
  const idx = data.findIndex((g) => g.id === Number(req.params.id));
  if (idx !== -1) {
    const removed = data.splice(idx, 1);
    writeData(data);
    res.json(removed[0]);
  } else {
    res.status(404).json({ error: "Gift not found" });
  }
});



app.get("/", (req, res) => {
  res.send("User API is running");
});

// Start the server
const PORT = 5011;
app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
});