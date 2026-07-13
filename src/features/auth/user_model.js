const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        default: null,
    },
    authProvider: {
        type: String,
        enum: ["email", "google"],
        default: "email",
    },
    age: {
        type: Number,
        min: 18,
        max: 100,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    bio: {
        type: String,
        default: ""
    },

      profilePicture: {
      type: String,
      default: "",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },
},
{
    timestamps: true,
}
);

const User = mongoose.model("User", userSchema);
module.exports = User;