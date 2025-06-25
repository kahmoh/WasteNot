import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import socketHandler from "./socket/index.js";
import connectDB from "./db/connect.js";

import chatRoutes from "./routes/chats.route.js";
import messageRoutes from "./routes/messages.route.js";
// import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true
  })
);

app.options("*", cors()); // Handle preflight requests
app.use(express.json());

// Mount Routes
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/api/user", userRoutes);

// Create HTTP server & Socket.IO server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true
  },
  connectionStateRecovery: {},
});

// Socket handler
socketHandler(io);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Connect DB and Start Server
connectDB(process.env.MONGODB_URI)
  .then(() => {
    server.listen(3001, () => {
      console.log(`🚀 Server running on http://localhost:3001`);
      console.log(
        `🛡️  CORS-enabled for ${process.env.FRONTEND_URL || "http://localhost:5173"}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});
