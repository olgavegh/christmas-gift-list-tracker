import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pathData = join(dirname(fileURLToPath(import.meta.url)), "", "data.json");

const app = express();
app.use(express.json());

// Start the server
const PORT = 5011;
app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("User API is running");
});
