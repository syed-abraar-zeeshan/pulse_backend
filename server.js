const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const connectDB = require("./src/config/db");

const authRoutes = require("./src/features/auth/auth.routes");

const profileRoutes = require("./src/features/profile/profile.routes");
const errorMiddleware = require("./src/middlewares/error.middleware");

// Connect to MongoDB
connectDB();

// Create the Express app
const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware)

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

//express.static("uploads") is an Express middleware that makes the files inside the uploads folder accessible from the browser.
