const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db/connect");
const socketHandler = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middleware & routes
app.use(express.json());
app.use("/api/messages", require("./routes/messages"));

// DB + Socket.IO
connectDB();
socketHandler(io);

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
