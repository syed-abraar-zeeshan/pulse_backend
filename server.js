require("dotenv").config();

const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

// Create the Express app
const express = require("express");
const app = express();

// Define the port
const PORT = process.env.PORT || 4000;

// Create an API route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pulse Backend is running 🚀",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
