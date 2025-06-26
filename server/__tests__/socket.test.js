import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import Message from "../models/Message.model.js";
import Chat from "../models/Chat.model.js";
import User from "../models/User.model.js";

let io, server, clientSocket, mongoServer;
let userA, userB;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create users
  userA = await User.create({ username: "userA", displayName: "User A" });
  userB = await User.create({ username: "userB", displayName: "User B" });

  // Create HTTP + Socket.IO server
  await new Promise((resolve) => {
    const httpServer = createServer();

    io = new Server(httpServer, {
      cors: { origin: "*" },
    });

    // Your socket handler
    io.on("connection", (socket) => {
      socket.on("send-message", async ({ chatId, text, sender }) => {
        try {
          const message = await Message.create({
            chat: chatId,
            text,
            sender,
          });

          await Chat.findByIdAndUpdate(chatId, {
            lastMessage: message._id,
            $set: { updatedAt: new Date() },
          });

          io.emit("receive-message", {
            _id: message._id.toString(),
            chatId,
            text,
            sender,
          });
        } catch (err) {
          console.error("Socket message error:", err);
        }
      });
    });

    httpServer.listen(() => {
      const port = httpServer.address().port;
      const socket = new Client(`http://localhost:${port}`);
      socket.on("connect", () => {
        clientSocket = socket;
        server = httpServer;
        resolve();
      });
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
    const chat = await Chat.create({
      participant1: userA._id,
      participant2: userB._id,
    });

    const promise = new Promise((resolve) => {
      clientSocket.on("receive-message", async (msg) => {
        expect(msg.text).toBe("Hello from socket!");
        expect(msg.chatId).toBe(chat._id.toString());
        expect(msg.sender).toBe(userA._id.toString());

        const saved = await Message.findById(msg._id);
        expect(saved).not.toBeNull();
        expect(saved.text).toBe("Hello from socket!");
        expect(saved.chat.toString()).toBe(chat._id.toString());
        resolve();
      });
    });

    clientSocket.emit("send-message", {
      chatId: chat._id.toString(),
      text: "Hello from socket!",
      sender: userA._id.toString(),
    });

    await promise;
  });
});
