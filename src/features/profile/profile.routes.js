const express = require("express");

const authMiddleware = require("../../middlewares/auth_middleware");

const { getProfile, updateProfile } = require("./profile.controller");

const router = express.Router();

router.get("/", authMiddleware, getProfile);

router.put("/update", authMiddleware, updateProfile);

module.exports = router;
