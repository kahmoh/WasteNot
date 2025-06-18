// REST API to fetch old messages
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Chat = require("../models/Chat");

router.post("/send", async (req, res) => {
  const { chatId, text, role } = req.body;

  // 🔴 Basic validation
  if (!chatId || !text || !role) {
    return res.status(400).json({ error: "chatId, text, and role are required." });
  }

  try {
    const message = new Message({ chatId, text, role });
    await message.save();

    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id },
      $set: { lastUpdated: Date.now() },
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message." });
  }
});

router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    // Check if chatId is a valid ObjectId
    if (!chatId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ error: "Invalid chat ID format." });
    }

    // Sort messages by creation order (by _id or timestamp)
    const messages = await Message.find({ chatId }).sort({ _id: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
});


module.exports = router;
