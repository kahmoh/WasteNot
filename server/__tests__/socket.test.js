import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import Message from "../models/Message";
import Chat from "../models/Chat";

let io, server, clientSocket, mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri); // Connect mongoose to in-memory DB

  // Create HTTP + Socket.IO server
  await new Promise((resolve) => {
    const httpServer = createServer();

    io = new Server(httpServer, {
      cors: { origin: "*" },
    });

    // Handle socket logic similar to your actual backend
    io.on("connection", (socket) => {
      socket.on("send-message", async ({ chatId, text }) => {
        try {
          // Save the message to DB
          const message = await Message.create({
            chatId,
            text,
            role: "user",
          });

          // Update chat to include the message
          await Chat.findByIdAndUpdate(chatId, {
            $push: { messages: message._id },
            $set: { lastUpdated: Date.now() },
          });

          // Emit the message back to clients
          io.emit("receive-message", message);
        } catch (err) {
          console.error("Socket message error:", err);
        }
      });
    });

    // Start server and connect test client
    httpServer.listen(() => {
      const port = httpServer.address().port;

      const socket = new Client(`http://localhost:${port}`);
      socket.on("connect", () => {
        clientSocket = socket;
        resolve();
      });

      server = httpServer;
    });
  });
});

afterAll(async () => {
  io?.close();
  clientSocket?.close();
  server?.close();

  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Socket.IO + MongoDB integration", () => {
  it("saves message to DB and emits to clients", async () => {
    // Create a chat to use its ID
    const chat = await Chat.create({ participants: ["userA", "userB"] });

    // Set up listener for emitted message
    const promise = new Promise((resolve) => {
      clientSocket.on("receive-message", async (msg) => {
        // Check message structure
        expect(msg.text).toBe("Hello from socket!");
        expect(msg.chatId).toBe(chat._id.toString());
        expect(msg.role).toBe("user");

        // Check that message is saved in DB
        const saved = await Message.findById(msg._id);
        expect(saved).not.toBeNull();
        expect(saved.text).toBe("Hello from socket!");
        resolve();
      });
    });

    // Emit message via socket
    clientSocket.emit("send-message", {
      chatId: chat._id.toString(),
      text: "Hello from socket!",
    });

    // Wait for test to complete
    await promise;
  });
});
