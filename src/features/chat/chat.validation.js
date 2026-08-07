const { z } = require("zod");
const { MESSAGE_TYPES } = require("./chat.constants");

const sendMessageSchema = z.object({
  receiverId: z.string().trim().min(1, "Receiver ID is required"),

  messageType: z.enum(MESSAGE_TYPES),

  content: z.string().trim().min(1, "Content is required"),

  metadata: z.object({}).passthrough().optional(),

  replyTo: z.string().trim().optional(),

  forwardedFrom: z.string().trim().optional(),
});

module.exports = {
  sendMessageSchema,
};
