import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participant1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  participant2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  unreadCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Ensure one chat per pair of users
chatSchema.index(
  { participant1: 1, participant2: 1 },
  { unique: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);