const Message = require("../models/Message.model");
const Chat = require("../models/Chat.model");

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

        io.emit("receive-message", {chatId, text: newMessage.text});
      } catch (err) {
        console.error("Message handling error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
