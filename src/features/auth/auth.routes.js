//This file defines the API endpoints.
const express = require("express"); // This imports the Express package.
const { signup, login } = require("./auth.controller"); //This imports the signup function from auth.controller.js

const router = express.Router(); // Create a router object

router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
