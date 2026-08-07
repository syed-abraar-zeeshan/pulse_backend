const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageType: {
      type: String,
      enum: [
        "text",
        "image",
        "video",
        "document",
        "audio",
        "location",
        "contact",
        "gif",
        "sticker",
      ],
      default: "text",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Conversation", conversationSchema);
