//This file defines the API endpoints.
const express = require("express"); // This imports the Express package.
const { signup, login } = require("./auth.controller"); //This imports the signup function from auth.controller.js
const { profile } = require("./auth.profile");

const authMiddleware = require("../../middlewares/auth_middleware");

const router = express.Router(); // Create a router object

router.post("/signup", signup);

router.post("/login", login);

router.get("/profile", authMiddleware, profile);

module.exports = router;
