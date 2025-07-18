

// server.js

import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import { createServer } from "http";
import cors from "cors";
import connectDB from "./config/db.js";
import { Server } from "socket.io";

// ✅ Replace require with import
import socketHandler from "./socket/index.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

// ✅ Use imported socket handler
socketHandler(io);

// middleware
app.use(cors());
app.use(json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

// DB & Start
connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
