import express from "express";
import "../models/User.model.js"; // This still runs the model definition
import Chat from "../models/Chat.model.js";

const router = express.Router();

// GET /chats → Get all chats for current user
router.get("/", async (req, res) => {
  try {
    // In a real app, you'd get userId from authentication
    // const userId = req.user._id;

    // Temporary hardcoded user ID - replace with your test user's ID
    const userId = "685c14670546ba0d70532048"; // Hardcoded for testing

    const chats = await Chat.find({
      $or: [{ participant1: userId }, { participant2: userId }],
    })
      .populate("participant1 participant2", "displayName profilePic status")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({
      error: "Failed to fetch chats.",
      details: err.message,
    });
  }
});

// POST /chats → Create new 1:1 chat
// Implement for much later ; after maps page have been implemented
// Functionality: Creates a new chat if user clicks on another user's profile and selects 'contact now' 
router.post("/", async (req, res) => {
  const { participant1, participant2 } = req.body;

  try {
    // Check if chat already exists
    const existingChat = await Chat.findOne({
      $or: [
        { participant1, participant2 },
        { participant1: participant2, participant2: participant1 },
      ],
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const chat = new Chat({ participant1, participant2 });
    await chat.save();

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chat." });
  }
});

export default router;
