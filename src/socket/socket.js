const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../features/auth/user.model");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // server → your HTTP server.
  // io → your Socket.IO server instance.
  // cors → controls which apps are allowed to connect.
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = decoded.userId;

      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  // Listen for new connections
  // This code runs every time a client connects to your backend.
  // Socket.IO gives each connected client a unique ID:
  // Socket connection
  io.on("connection", async (socket) => {
    socket.join(`user:${socket.userId}`);

    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
    });

    console.log(`User ${socket.userId} is online`);

    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
      });

      console.log(`User ${socket.userId} is offline`);
    });
  });

  return io;
};

module.exports = initializeSocket;
