import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import request from "supertest"; // Supertest is used to simulate HTTP requests to your Express app
import mongoose from "mongoose"; // Mongoose is your ODM for MongoDB
import app from "../index"; // your Express app
import Chat from "../models/Chat";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer; // To store in-memory server instance

// Start in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
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
  // Test creating a new chat
  it("should create a new chat", async () => {
    const res = await request(app)
      .post("/chats/create") // Hit the POST /chats route
      .send({ participants: ["user1", "user2"] }); // Send request body

    expect(res.status).toBe(201); // Expect 201 Created
    expect(res.body.participants).toContain("user1");
    expect(res.body.participants).toContain("user2");

    // Verify the chat was saved in the DB
    const chatInDb = await Chat.findById(res.body._id);
    expect(chatInDb).not.toBeNull();
  });

  // Test invalid chat creation
  it("should not create a chat with no participants", async () => {
    const res = await request(app).post("/chats/create").send({});
    expect(res.status).toBe(400); // Expect 400 Bad Request
  });

  // Test retrieving all chats
  it("should get all chats", async () => {
    // Seed some chats
    await Chat.create([
      { participants: ["a", "b"] },
      { participants: ["c", "d"] },
    ]);

    const res = await request(app).get("/chats");
    expect(res.status).toBe(200); // OK
    expect(res.body.length).toBe(2);
  });

  // Test retrieving a single chat by ID
  it("should return a specific chat by ID", async () => {
    const chat = await Chat.create({ participants: ["u1", "u2"] });

    const res = await request(app).get(`/chats/${chat._id}`);
    expect(res.status).toBe(200);
    expect(res.body.participants).toContain("u1");
  });

  // Test 404 if chat doesn't exist
  it("should return 404 for non-existent chat ID", async () => {
    const id = new mongoose.Types.ObjectId(); // Random valid ObjectId
    const res = await request(app).get(`/chats/${id}`);
    expect(res.status).toBe(404);
  });
});
