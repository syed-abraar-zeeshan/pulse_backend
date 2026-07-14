const express = require("express");

const authMiddleware = require("../../middlewares/auth_middleware");

const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
} = require("./profile.controller");

const upload = require("../../middlewares/upload.middleware");

const router = express.Router();

router.get("/", authMiddleware, getProfile);

router.put("/update", authMiddleware, updateProfile);

router.patch(
  "/picture",
  authMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture,
);

module.exports = router;

// upload.single("profilePicture");
// this means
// single() → only one file can be uploaded.
// "profilePicture" → the key name sent from Flutter or Postman.
