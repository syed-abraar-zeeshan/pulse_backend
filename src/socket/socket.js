const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../features/auth/user.model");
const Message = require("../features/chat/models/message.model");
const { createMessage } = require("../features/chat/chat.service");
const { sendMessageSchema } = require("../features/chat/chat.validation");

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

    socket.on("send_message", async (data) => {
      const validationResult = sendMessageSchema.safeParse(data);

      if (!validationResult.success) {
        socket.emit("message_error", {
          message: "Invalid message data",
          errors: validationResult.error.flatten(),
        });

        return;
      }

      const {
        receiverId,
        messageType,
        content,
        metadata,
        replyTo,
        forwardedFrom,
      } = validationResult.data;

      const receiver = await User.findById(receiverId);

      if (!receiver) {
        socket.emit("message_error", {
          message: "Receiver not found",
        });

        return;
      }

      try {
        const message = await createMessage({
          senderId: socket.userId,
          receiverId,
          messageType,
          content,
          metadata,
          replyTo,
          forwardedFrom,
        });

        const populatedMessage = await Message.findById(message._id).populate(
          "sender",
          "name profilePicture isOnline",
        );

        const messageData = {
          id: populatedMessage.id,
          conversationId: populatedMessage.conversation,
          sender: populatedMessage.sender,
          type: populatedMessage.messageType,
          content: populatedMessage.content,
          replyTo: populatedMessage.replyTo,
          forwardedFrom: populatedMessage.forwardedFrom,
          status: {
            deliveredAt: populatedMessage.deliveredAt,
            readAt: populatedMessage.readAt,
          },
          isEdited: populatedMessage.isEdited,
          editedAt: populatedMessage.editedAt,
          deletedForEveryone: populatedMessage.deletedForEveryone,
          reactions: populatedMessage.reactions,
          createdAt: populatedMessage.createdAt,
          updatedAt: populatedMessage.updatedAt,
        };
        console.log("Message created:", message._id);

        io.to(`user:${receiverId}`).emit("new_message", messageData);
      } catch (error) {
        console.error("Error sending message:", error);

        socket.emit("message_error", {
          message: "Failed to send message",
        });
      }
    });

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
