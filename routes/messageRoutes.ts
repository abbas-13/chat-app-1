import { Request, Response } from "express";
import requireLogin from "../middlewares/requireLogin";
import mongoose from "mongoose";
import Conversation from "../models/conversation";
import Message from "../models/message";

export default (app: import("express").Express) => {
  app.get(
    "/api/messages/:conversationId",
    requireLogin,
    async (req: Request, res: Response) => {
      try {
        const senderId = (req.user as any)._id;
        const recipientId = new mongoose.Types.ObjectId(
          (req.params as any).conversationId,
        );

        const participants = [senderId, recipientId].sort((a, b) =>
          a.toString().localeCompare(b.toString()),
        );

        const conversation = await Conversation.findOne({
          participants: { $all: participants, $size: 2 },
        });

        const messages = await Message.find({
          conversationId: conversation?._id,
        })
          .populate("senderId", "name displayName email")
          .populate("readBy.userId", "name displayName")
          .sort({ createdAt: 1 })
          .lean()
          .exec();

        if (!messages) {
          return res.json("No messages");
        }

        res.status(200).json({ messages });
      } catch (err) {
        res.status(500).json({
          error: err instanceof Error ? err.message : "Server error",
        });
      }
    },
  );

  app.post(
    "/api/messages",
    requireLogin,
    async (req: Request, res: Response) => {
      try {
        const { recipientId, text } = req.body;
        const senderId = (req.user as any)._id;

        const participants = [
          senderId,
          new mongoose.Types.ObjectId(recipientId),
        ].sort((a, b) => a.toString().localeCompare(b.toString()));

        // checking if conversation exists
        let conversation = await Conversation.findOne({
          participants: { $all: participants, $size: 2 },
        });

        // creating a new conversation if conversation doesn't exist
        if (!conversation) {
          conversation = new Conversation({
            participants,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await conversation.save();
        }

        // creating a new message
        const message = new Message({
          senderId,
          conversationId: conversation._id,
          text,
          readBy: [],
        });
        await message.save();

        // updating conversation, last message and date
        conversation.lastMessage = message._id;
        conversation.updatedAt = new Date();
        await conversation.save();

        // populating the conversation with details of the users, and the last message
        await conversation.populate("participants", "name displayName email");
        await conversation.populate("lastMessage", "text createdAt senderId");

        res.status(201).json({
          message,
          conversation: conversation.toObject(),
        });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : "Server error",
        });
      }
    },
  );
};
