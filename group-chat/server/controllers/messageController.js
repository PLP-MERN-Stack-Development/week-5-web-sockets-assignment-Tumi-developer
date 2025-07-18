
import Message from "../models/Message.js";

export const getRoomMessages = async (_req, res) => {
  try {
    const messages = await Message.find({ room: _req.params.roomId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

