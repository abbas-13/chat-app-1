import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";

import { socketAuthMiddleware } from "../middlewares/socketAuthMiddleware.ts";
import Message from "../models/message.ts";

declare module "socket.io" {
  interface Socket {
    userId: string;
  }
}

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://chat-app-1-5mmu.onrender.com"
        : "http://localhost:3000",
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
  socket.join(`user_${userId}`);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("mark-message-read", async ({ messageId }, callback) => {
    try {
      if (!messageId) {
        callback?.({ success: false, error: "messageId is required" });
        return;
      }

      const message = await Message.findById(messageId);
      if (!message) {
        callback?.({ success: false, error: "Message not found" });
        return;
      }

      // Only the recipient of a message may mark it as read.
      if (message.senderId.toString() === socket.userId) {
        callback?.({ success: false, error: "Cannot mark your own message" });
        return;
      }

      const readAt = new Date();

      await Message.updateOne(
        { _id: messageId, "readBy.userId": { $ne: socket.userId } },
        { $push: { readBy: { userId: socket.userId, readAt } } },
      );

      io.to(`user_${message.senderId.toString()}`).emit("messagesRead", {
        conversationId: message.conversationId.toString(),
        readerId: socket.userId,
        messageIds: [messageId],
        readAt: readAt.toISOString(),
      });

      callback?.({ success: true });
    } catch (error) {
      console.error("mark-message-read failed:", error);
      callback?.({ success: false, error: "Failed to mark message as read" });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (userSocketMap[userId] === socket.id) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
