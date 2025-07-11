const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { exec } = require("child_process");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/scrapedb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Data = mongoose.model(
  "data",
  new mongoose.Schema({
    title: String,
    description: String,
    link: String,
  }),
  "data"
);

const path = require("path");
const scriptPath = path.join(__dirname, "../scraper/scrape.py");
app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.delete("/api/data", async (req, res) => {
  try {
    await Data.deleteMany({});
    res.json({ message: "Data cleared" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete data" });
  }
});

app.get("/api/scrape/:source", async (req, res) => {
  const source = req.params.source;
  exec(`python "${scriptPath}" ${source}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Scraper error:", stderr);
      return res.status(500).json({ error: "Scraping failed" });
    }
    console.log("Scraper output:", stdout);
    res.json({ message: "Scraping done" });
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
