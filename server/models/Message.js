const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  text: String,
  role: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite
module.exports = mongoose.models.Message || mongoose.model("Message", messageSchema);
