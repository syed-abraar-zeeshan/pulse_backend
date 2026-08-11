const Conversation = require("./models/conversation.model");
const Message = require("./models/message.model");

const createMessage = async ({
  senderId,
  receiverId,
  messageType,
  content,
  metadata,
  replyTo,
  forwardedFrom,
}) => {
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

  return message;
};

module.exports = {
  createMessage,
};
