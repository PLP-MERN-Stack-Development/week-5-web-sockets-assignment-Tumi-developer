
import Message from "../models/Message.js";
import User from "../models/User.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("joinRoom", async ({ username, roomId }) => {
      const user = await User.findOneAndUpdate(
        { username },
        { socketId: socket.id, isOnline: true },
        { new: true }
      );

      socket.join(roomId);
      io.to(roomId).emit("userJoined", { user, roomId });

      // Typing
      socket.on("typing", () => {
        socket.to(roomId).emit("Typing", username);
      });

      socket.on("stopTyping", () => {
        socket.to(roomId).emit("stopTyping", username);
      });

      // Send Message
      socket.on("sendMessage", async (data) => {
        const message = await Message.create({
          sender: user._id,
          room: roomId,
          content: data,
        });
        const fullMessage = await message.populate("sender", "username");
        io.to(roomId).emit("newMessage", fullMessage);
      });

      // Disconnect
      socket.on("disconnect", async () => {
        const offlineUser = await User.findOneAndUpdate(
          { socketId: socket.id },
          { isOnline: false }
        );
        if (offlineUser) {
          io.emit("UserOffline", offlineUser.username);
        }
      });
    });
  });
};
