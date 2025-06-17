const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(express.json());

// Mount the socket event logic from the handler module
socketHandler(io); 

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
