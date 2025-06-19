const Message = require("../models/Message");
const Chat = require("../models/Chat");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("send-message", async ({ chatId, text }) => {
      try {
        const newMessage = await Message.create({ chatId, text, role: "user" });

        await Chat.findByIdAndUpdate(chatId, {
          $push: { messages: newMessage._id },
          $set: { lastUpdated: Date.now() },
        });

        io.emit("receive-message", newMessage);
      } catch (err) {
        console.error("Message handling error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
