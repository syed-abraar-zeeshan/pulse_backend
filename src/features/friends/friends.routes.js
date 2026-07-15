const express = require("express");

const authMiddleware = require("../../middlewares/auth_middleware");

const {
  sendFriendRequest,
  getFriendRequests,
} = require("./friends.controller");

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendFriendRequest);
router.get("/requests", authMiddleware, getFriendRequests);

module.exports = router;
