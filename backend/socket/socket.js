let io;

const initializeSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins or set specific frontend URL
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    socket.on("join-room", (userId) => {
      socket.join(userId);
      console.log(`📦 User joined room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};
