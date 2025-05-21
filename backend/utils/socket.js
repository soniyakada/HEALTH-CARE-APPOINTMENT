// socket.js
export const initSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      socket.join(userId); // Join room using user ID
    });

    socket.on("send_notification", ({ to, message }) => {
      io.to(to).emit("receive_notification", { message });
    });

    socket.on("disconnect", () => {
      // Optional: Handle disconnect
    });
  });
};
