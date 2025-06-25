import express from "express";
import Message from "../models/Message.model.js";
import Chat from "../models/Chat.model.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { chatId, text, sender } = req.body;

  try {
    const message = new Message({ chat: chatId, text, sender });
    await message.save();

    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      $inc: { unreadCount: 1 }
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message." });
  }
});

router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!chatId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ error: "Invalid chat ID format." });
    }

    const messages = await Message.find({ chat: chatId }).sort({ _id: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
});

export default router;
