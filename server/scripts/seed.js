import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await User.deleteMany();
    await Chat.deleteMany();
    await Message.deleteMany();

    // Create test users
    const users = await User.insertMany([
      {
        username: "john_doe",
        displayName: "John Doe",
        profilePic: "/john.jpg",
        status: "online"
      },
      {
        username: "sarah_smith",
        displayName: "Sarah Smith",
        profilePic: "/sarah.jpg",
        status: "offline"
      },
      {
        username: "alice_wonder",
        displayName: "Alice Wonder",
        profilePic: "/alice.jpg",
        status: "online"
      }
    ]);

    // Create test chats
    const chat1 = await Chat.create({
      participant1: users[0]._id,  // John
      participant2: users[1]._id,  // Sarah
      unreadCount: 2
    });

    const chat2 = await Chat.create({
      participant1: users[0]._id,  // John
      participant2: users[2]._id,  // Alice
      unreadCount: 0
    });

    // Create test messages
    const messages = await Message.insertMany([
      {
        chat: chat1._id,
        sender: users[0]._id,
        text: "Hey Sarah, how are you?",
        read: false,
        createdAt: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        chat: chat1._id,
        sender: users[1]._id,
        text: "I'm good John! How about you?",
        read: false,
        createdAt: new Date(Date.now() - 1800000) // 30 mins ago
      },
      {
        chat: chat2._id,
        sender: users[0]._id,
        text: "Alice, let's meet tomorrow",
        read: true,
        createdAt: new Date(Date.now() - 86400000) // 1 day ago
      }
    ]);

    // Update chats with last messages
    await Chat.findByIdAndUpdate(chat1._id, { 
      lastMessage: messages[1]._id 
    });
    await Chat.findByIdAndUpdate(chat2._id, { 
      lastMessage: messages[2]._id 
    });

    console.log("✅ Database seeded successfully!");
    console.log(`👥 Users created: ${users.length}`);
    console.log(`💬 Chats created: 2`);
    console.log(`✉️ Messages created: ${messages.length}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();
