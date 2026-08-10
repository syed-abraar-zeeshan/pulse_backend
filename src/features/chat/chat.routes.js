const express = require("express");

const authMiddleware = require("../../middlewares/auth_middleware");

const {
  sendMessage,
  getConversations,
  getMessages,
  markConversationAsRead,
  markMessagesAsDelivered,
} = require("./chat.controller");

const router = express.Router();

router.post("/messages", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getConversations);
router.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  getMessages,
);
router.patch(
  "/conversations/:conversationId/read",
  authMiddleware,
  markConversationAsRead,
);
router.patch(
  "/conversations/:conversationId/delivered",
  authMiddleware,
  markMessagesAsDelivered,
);

module.exports = router;
