// Mongoose model for chat messages

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: Number,
  text: String,
  role: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
