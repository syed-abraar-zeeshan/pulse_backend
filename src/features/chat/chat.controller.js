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

  const populatedMessage = await Message.findById(message._id).populate(
    "sender",
    "name profilePicture isOnline",
  );

  const data = {
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

  return res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data,
  });
};

const getConversations = async (req, res) => {
  const userId = req.user.userId;

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "name profilePicture isOnline")
    .sort({ lastMessageAt: -1 });

  const data = conversations.map((conversation) => {
    const otherUser = conversation.participants.find(
      (participant) => participant.id !== userId,
    );

    return {
      conversationId: conversation.id,
      user: otherUser,
      lastMessage: {
        content: conversation.lastMessage,
        type: conversation.lastMessageType,
        sentAt: conversation.lastMessageAt,
      },
      unreadCount: conversation.unreadCounts.get(userId) || 0,
    };
  });

  return res.status(200).json({
    success: true,
    data,
  });
};

const getMessages = async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
    100,
  );
  const skip = (page - 1) * limit;

  const userId = req.user.userId;
  const conversationId = req.params.conversationId;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  const totalMessages = await Message.countDocuments({
    conversation: conversationId,
  });

  const totalPages = Math.max(Math.ceil(totalMessages / limit), 1);

  const messages = await Message.find({
    conversation: conversationId,
  })
    .populate("sender", "name profilePicture isOnline")
    .sort({
      createdAt: 1,
      _id: 1,
    })
    .skip(skip)
    .limit(limit);

  const data = messages.map((message) => ({
    id: message.id,
    sender: message.sender,
    type: message.messageType,
    content: message.content,
    replyTo: message.replyTo,
    forwardedFrom: message.forwardedFrom,
    status: {
      deliveredAt: message.deliveredAt,
      readAt: message.readAt,
    },
    isEdited: message.isEdited,
    editedAt: message.editedAt,
    deletedForEveryone: message.deletedForEveryone,
    reactions: message.reactions,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  }));

  return res.status(200).json({
    success: true,
    message: "Messages retrieved successfully",
    data: {
      conversationId: conversation.id,
      messages: data,
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
};

const markConversationAsRead = async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.conversationId;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readAt: null,
    },
    {
      $set: {
        readAt: new Date(),
      },
    },
  );

  conversation.unreadCounts.set(userId, 0);

  await conversation.save();

  return res.status(200).json({
    success: true,
    message: "Messages marked as read",
  });
};

const markMessagesAsDelivered = async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.conversationId;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }

  const deliveredAt = new Date();

  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      deliveredAt: null,
    },
    {
      $set: {
        deliveredAt,
      },
    },
  );

  return res.status(200).json({
    success: true,
    message: "Messages marked as delivered",
  });
};

module.exports = {
  sendMessage,
  getConversations,
  getMessages,
  markConversationAsRead,
  markMessagesAsDelivered,
};
