import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import Chat from "../models/Chat.model.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let user1, user2, chat;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create test users
  user1 = await User.create({ username: "user1", displayName: "User One" });
  user2 = await User.create({ username: "user2", displayName: "User Two" });

  // Create chat
  chat = await Chat.create({ participant1: user1._id, participant2: user2._id });
});

beforeEach(async () => {
  await Message.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Message API", () => {
  it("should send a new message", async () => {
    const res = await request(app)
      .post("/api/messages/send") // Match your real route
      .send({
        chatId: chat._id.toString(),
        text: "Hello from test!",
        sender: user1._id.toString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.text).toBe("Hello from test!");
    expect(res.body.sender).toBe(user1._id.toString());

    const messages = await Message.find({ chat: chat._id });
    expect(messages.length).toBe(1);
  });

  it("should fail to send message if missing fields", async () => {
    const res = await request(app)
      .post("/api/messages/send")
      .send({ text: "Missing sender", chatId: chat._id.toString() });

    expect(res.status).toBe(500); // Your route throws 500 on validation error
  });

  it("should return all messages for a chat", async () => {
    await Message.create([
      { chat: chat._id, text: "First", sender: user1._id },
      { chat: chat._id, text: "Second", sender: user2._id },
    ]);

    const res = await request(app).get(`/api/messages/${chat._id}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].text).toBe("First");
    expect(res.body[1].text).toBe("Second");
  });

  it("should return empty array if no messages exist", async () => {
    const newChat = await Chat.create({ participant1: user1._id, participant2: user2._id });

    const res = await request(app).get(`/api/messages/${newChat._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 404 for invalid chatId format", async () => {
    const res = await request(app).get("/api/messages/invalid-id");
    expect(res.status).toBe(404);
  });
});
