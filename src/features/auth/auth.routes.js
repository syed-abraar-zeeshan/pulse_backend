const express = require("express");
const router = express.Router();

router.post("/signup", (req, res) => {
    res.status(200).json({
        success:true,
        message: "Signup route is working",
    });
});

module.exports = router;