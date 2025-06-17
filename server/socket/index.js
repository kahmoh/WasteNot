// Socket.IO logic handler

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("send-message", ({ chatId, text }) => {
      console.log(`Received from client: ${text}`);
      // Optionally save to DB here

      // Emit to everyone (or just the intended chat room)
      io.emit("receive-message", {
        chatId,
        text,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
