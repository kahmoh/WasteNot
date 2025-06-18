const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: String, // can be user IDs or names, depending on your user model
      required: true,
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite in watch mode or multiple test files
module.exports = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
