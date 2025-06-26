import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import request from "supertest"; // Supertest is used to simulate HTTP requests to your Express app
import mongoose from "mongoose"; // Mongoose is your ODM for MongoDB
import app from "../index"; // your Express app
import Chat from "../models/Chat.model.js";
import User from "../models/User.model.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer; // To store in-memory server instance
let user1, user2;

// Start in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create mock users
  user1 = await User.create({ username: "u1", displayName: "User One" });
  user2 = await User.create({ username: "u2", displayName: "User Two " });
});

// Run this before each test case
// It clears the Chat collection to keep tests isolated
beforeEach(async () => {
  await Chat.deleteMany(); // Clean DB before each test
});

// After all tests are done, close the MongoDB connection
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Chat API", () => {
  it("should create a new chat", async () => {
    const res = (await request(app).post("/api/chats")).send({
      participant1: user1._id.toString(),
      participant2: user2._id.toString(),
    });

    expect(res.status).toBe(201);
    expect(res.body.participant1._id).toBe(user1._id.toString());
    expect(res.body.participant2._id).toBe(user2._id.toString());

    const chatInDb = await Chat.findById(res.body._id);
    expect(chatInDb).not.toBeNull();
  });

  it("should not allow duplicate chats between same users", async () => {
    await Chat.create({
      participant1: user1._id,
      participant2: user2._id,
    });

    const res = await request(app).post("/api/chats").send({
      participant1: user1._id.toString(),
      participant2: user2._id.toString(),
    });

    expect(res.status).toBe(400); // Assuming your route returns 400 on duplicates
  });

  it("should fetch all chats for a user", async () => {
    await Chat.create([
      { participant1: user1._id, participant2: user2._id },
      { participant1: user2._id, participant2: user1._id },
    ]);

    const res = await request(app).get(`/api/chats?userId=${user1._id}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should return 404 for invalid chat ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/chats/${fakeId}`);
    expect([404, 400]).toContain(res.status);
  });
});
