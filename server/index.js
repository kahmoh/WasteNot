// index.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket");

const app = express();
app.use(express.json());

// Register the route files
const chatRoutes = require("./routes/chats");
const messageRoutes = require("./routes/messages");

app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);

// Export the app for testing
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
  });

  // Set up socket logic only when running the app
  socketHandler(io);

  server.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
  });
}
