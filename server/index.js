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

app.use(express.json());
app.use("/api/messages", require("./routes/messages")); // Optional

connectDB(); // Your MongoDB connection
socketHandler(io); // Pass Socket.IO instance

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
