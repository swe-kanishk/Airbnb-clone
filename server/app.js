const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  credentials: true,
  origin: "http://localhost:5174", // Replace with your client's origin URL
}));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

  

// Routes
app.use("/api/", userRoutes); // Mount userRoutes at root

// Test route
app.get("/api/test", (req, res) => {
  console.log("GET request received");
  res.send("Server is running...");
});

const PORT = process.env.PORT || 3001; // Use process.env.PORT or default to 3001
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
