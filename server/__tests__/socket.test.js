import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";

let io, server, clientSocket;

beforeAll(async () => {
  // Wrap everything in a Promise so Vitest knows when setup is done
  await new Promise((resolve) => {
    const httpServer = createServer();
    io = new Server(httpServer, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      socket.on("send-message", ({ chatId, text }) => {
        io.emit("receive-message", { chatId, text });
      });
    });

    httpServer.listen(() => {
      const port = httpServer.address().port;

      // connect the client
      const socket = new Client(`http://localhost:${port}`);
      socket.on("connect", () => {
        clientSocket = socket; // assign here, not earlier
        resolve(); // resolves the outer promise
      });
    });

    server = httpServer;
  });
});

afterAll(() => {
  io?.close();
  clientSocket?.close();
  server?.close();
});

describe("Socket.IO chat server", () => {
  it("broadcasts messages to all clients", (done) => {
    const chatId = 1;
    const text = "Hello world";

    clientSocket.on("receive-message", (data) => {
      expect(data).toEqual({ chatId, text });
      done(); // ✅ test finishes here
    });

    clientSocket.emit("send-message", { chatId, text });
  });
});
