const { sendMessageSchema } = require("./chat.validation");
const Conversation = require("./models/conversation.model");
const Message = require("./models/message.model");

const User = require("../auth/user.model");

const sendMessage = async (req, res) => {
  const senderId = req.user.userId;

  const validationResult = sendMessageSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
      errors: validationResult.error.flatten(),
    });
  }

  const { receiverId, messageType, content, metadata, replyTo, forwardedFrom } =
    validationResult.data;

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Receiver not found",
    });
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [senderId, receiverId],
    },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: senderId,
    messageType,
    content,
    metadata,
    replyTo: replyTo || null,
    forwardedFrom: forwardedFrom || null,
  });

  conversation.lastMessage = content;
  conversation.lastMessageType = messageType;
  conversation.lastMessageAt = new Date();

  const currentUnreadCount = conversation.unreadCounts.get(receiverId) || 0;

  conversation.unreadCounts.set(receiverId, currentUnreadCount + 1);

  await conversation.save();

  return res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: message,
  });
};

module.exports = { sendMessage };
