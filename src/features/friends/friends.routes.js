const express = require("express");

const authMiddleware = require("../../middlewares/auth_middleware");

const { sendFriendRequest } = require("./friends.controller");

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendFriendRequest);

module.exports = router;
