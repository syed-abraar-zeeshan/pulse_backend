const express = require("express");

const authMiddleware = require("../../middlewares/auth_middleware");

const {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  getFriends,
  removeFriend,
  searchUsers,
} = require("./friends.controller");

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendFriendRequest);
router.get("/requests", authMiddleware, getFriendRequests);
router.post("/accept/:userId", authMiddleware, acceptFriendRequest);
router.get("/", authMiddleware, getFriends);
router.delete("/:userId", authMiddleware, removeFriend);
router.get("/search", authMiddleware, searchUsers);

module.exports = router;
