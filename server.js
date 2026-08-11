// const dns = require("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const connectDB = require("./src/config/db");

const authRoutes = require("./src/features/auth/auth.routes");

const profileRoutes = require("./src/features/profile/profile.routes");
const errorMiddleware = require("./src/middlewares/error.middleware");
const friendsRoutes = require("./src/features/friends/friends.routes");
const chatRoutes = require("./src/features/chat/chat.routes");

const http = require("http");
const initializeSocket = require("./src/socket/socket");

// Connect to MongoDB
connectDB();

// Create the Express app
const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/friends", friendsRoutes);

app.use("/api/chat", chatRoutes);

app.use(errorMiddleware);

// Define the port
const PORT = process.env.PORT || 4000;

// Create an API route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pulse Backend is running 🚀",
  });
});

//Create an HTTP server
const server = http.createServer(app);
initializeSocket(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//const io = new Server(server); This creates a new Socket.IO server.
//express.static("uploads") is an Express middleware that makes the files inside the uploads folder accessible from the browser.

// Flutter App
//      │
//      ├── REST API calls
//      │      ├── Login
//      │      ├── Friends
//      │      └── Search
//      │
//      └── Socket.IO connection
//              ├── User connected
//              ├── User disconnected
//              ├── Chat
//              └── Calls

//                  ↓

//             Node.js Backend

// User opens app
//        ↓
// Send JWT token to Socket.IO
//        ↓
// Find user in MongoDB
//        ↓
// Set isOnline = true
//        ↓
// On disconnect:
//        ↓
// Set isOnline = false

//io.use(async (socket, next) => {
// io.use() creates a Socket.IO middleware.
// This middleware runs before a user connects to the socket server.
// socket contains information about the user connection.
// next() is used to allow or reject the connection.
// It is similar to your Express middleware:
// app.use(authMiddleware);
