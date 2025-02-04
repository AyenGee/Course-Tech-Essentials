const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Fuse = require("fuse.js")
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/course_tech_essentials")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Schema and Model
const gadgetSchema = new mongoose.Schema({
  faculty: String,
  degree: String,
  categories: Object,
});
const Gadget = mongoose.model("Gadget", gadgetSchema);

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to fetch gadgets based on degree
app.get("/gadgets/:degree", async (req, res) => {
  const degree = req.params.degree.toLowerCase().trim();

  try {
    // Fetch all gadgets from the database
    const allGadgets = await Gadget.find();

    // Prepare the data for fuzzy search
    const fuse = new Fuse(allGadgets, {
      keys: ["degree"], // Search in the "degree" field
      threshold: 0.4, // Lower values = stricter matching
    });

    // Perform fuzzy search
    const result = fuse.search(degree);

    if (result.length > 0) {
      // Return the most accurate match
      res.json(result[0].item);
    } else {
      res.status(404).send({ message: "Degree not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching data", error });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
