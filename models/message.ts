import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  readBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      readAt: Date,
    },
  ],
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
