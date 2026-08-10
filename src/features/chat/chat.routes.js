const express = require("express");

const authMiddleware = require("../../middlewares/auth_middleware");

const { sendMessage } = require("./chat.controller");

const router = express.Router();

router.post("/messages", authMiddleware, sendMessage);

module.exports = router;
