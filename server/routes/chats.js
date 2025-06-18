const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

// POST /chats/create → Create a new chat
router.post("/create", async (req, res) => {
  const { participants } = req.body;

  // Basic validation
  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ error: "Participants are required." });
  }

  try {
    const chat = new Chat({ participants, messages: [] });
    await chat.save();

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chat." });
  }
});

// GET /chats → Get all chats
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find();
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats." });
  }
});

// GET /chats/:id → Get a specific chat by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ error: "Invalid chat ID format." });
  }

  try {
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat." });
  }
});

module.exports = router;
