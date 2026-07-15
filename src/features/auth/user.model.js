const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
      required: true,
      select: false,
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
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId, // we store only the ID instead of storing complete user object
        ref: "User", //This ID belongs to the User collection.
      },
    ],

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId, // we store only the ID instead of storing complete user object
        ref: "User", //This ID belongs to the User collection.
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = User;
