// tests/messages.test.js
import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../index"; // Your Express app
import Chat from "../models/Chat";
import Message from "../models/Message";
import { MongoMemoryServer } from "mongodb-memory-server";

let chatId;          // This will store the test chat's ID
let mongoServer;     // Reference to in-memory MongoDB instance

// Create the in-memory MongoDB and connect to it before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // Start the in-memory server
  const uri = mongoServer.getUri(); // Get connection URI

  await mongoose.connect(uri);
});

// Before each test, clear data and create a new chat
beforeEach(async () => {
  await Chat.deleteMany();    // Remove all previous chats
  await Message.deleteMany(); // Remove all previous messages

  // Create a fresh chat for message testing
  const chat = await Chat.create({ participants: ["u1", "u2"] });
  chatId = chat._id; // Store ID for use in tests
});

// After all tests, disconnect and stop the in-memory MongoDB server
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Message API", () => {
  // Test: Sending a valid message
  it("should send a new message", async () => {
    const res = await request(app)
      .post("/messages/send")
      .send({
        chatId,
        text: "Hello, this is a test message",
        role: "user",
      });

    expect(res.status).toBe(201); // Expect success
    expect(res.body.text).toBe("Hello, this is a test message");
    expect(res.body.role).toBe("user");

    // Ensure the message was saved
    const messages = await Message.find({ chatId });
    expect(messages.length).toBe(1);
  });

  // Test: Missing chatId should result in 400
  it("should fail to send message if missing fields", async () => {
    const res = await request(app)
      .post("/messages/send")
      .send({ text: "Missing chatId", role: "user" });

    expect(res.status).toBe(400);
  });

  // Test: Getting all messages from a chat
  it("should return all messages for a chat", async () => {
    await Message.create([
      { chatId, text: "msg1", role: "user" },
      { chatId, text: "msg2", role: "other" },
    ]);

    const res = await request(app).get(`/messages/${chatId}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].text).toBe("msg1");
    expect(res.body[1].text).toBe("msg2");
  });

  // Test: Chat has no messages
  it("should return empty array for chat with no messages", async () => {
    const res = await request(app).get(`/messages/${chatId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  // Test: Invalid chat ID should return 404
  it("should return 404 for invalid chatId", async () => {
    const res = await request(app).get(`/messages/invalidchatid`);
    expect(res.status).toBe(404);
  });
});
