
import Room from "../models/Room.js";

export const getRooms = async (_req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

export const createRoom = async (_req, res) => {
  const { name } = _req.body;
  try {
    const room = await Room.create({ name });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};