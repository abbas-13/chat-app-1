import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";

import { socketAuthMiddleware } from "../middlewares/socketAuthMiddleware.ts";

declare module "socket.io" {
  interface Socket {
    userId: string;
  }
}

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://chat-app-1-5mmu.onrender.com"],
    credentials: true,
    optionsSuccessStatus: 200,
  },
});

io.use(socketAuthMiddleware);

const userSocketMap: Record<string, string> = {};

export const getReceiverSocketId = (userId: string) => {
  return userSocketMap[userId];
};

io.engine.on("connection_error", (err) => {
  console.log("Connection error:", err);
});

io.on("connection", (socket) => {
  console.log("User is connected to socket");

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
