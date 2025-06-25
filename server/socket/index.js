import Message from "../models/Message.model.js";
import Chat from "../models/Chat.model.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("send-message", async ({ chatId, text }) => {
      try {
        const newMessage = await Message.create({ chat: chatId, text, role: userId });

        await Chat.findByIdAndUpdate(chatId, {
          $push: { messages: newMessage._id },
          $set: { lastUpdated: Date.now() },
        });

        io.emit("receive-message", { chatId, text: newMessage.text });
      } catch (err) {
        console.error("Message handling error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
