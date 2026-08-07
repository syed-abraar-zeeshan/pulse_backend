const express = require("express");

const authMiddleware = require("../../middlewares/auth_middleware");

const {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
  searchUsers,
  searchFriends,
} = require("./friends.controller");

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendFriendRequest);
router.get("/requests", authMiddleware, getFriendRequests);
router.post("/accept/:userId", authMiddleware, acceptFriendRequest);
router.post("/reject/:userId", authMiddleware, rejectFriendRequest);
router.get("/", authMiddleware, getFriends);
router.delete("/:userId", authMiddleware, removeFriend);
// router.get("/search", authMiddleware, searchUsers);
router.get("/search", authMiddleware, searchFriends);

module.exports = router;
