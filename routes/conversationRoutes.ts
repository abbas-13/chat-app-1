import { Request, Response } from "express";
import requireLogin from "../middlewares/requireLogin";
import Conversation from "../models/conversation";
import User from "../models/user";

export default (app: import("express").Express) => {
  app.get(
    "/api/conversations",
    requireLogin,
    async (req: Request, res: Response) => {
      try {
        const conversations = await Conversation.find({
          participants: (req.user as any)._id,
        })
          .populate(
            "participants",
            "name displayName email status displayPicture",
          )
          .populate("lastMessage", "text createdAt senderId")
          .sort({ updatedAt: -1 })
          .lean();

        res.json(conversations);
      } catch (error) {
        res
          .status(500)
          .json({ error: error instanceof Error && error.message });
      }
    },
  );

  app.get(
    "/api/searchUsers",
    requireLogin,
    async (req: Request, res: Response) => {
      try {
        const query = req.query.q as string;
        const recipients = await User.find({
          $or: [
            { email: { $regex: query, $options: "i" } },
            { name: { $regex: query, $options: "i" } },
            { displayName: { $regex: query, $options: "i" } },
          ],
          _id: { $ne: (req.user as any)._id },
        })
          .select("name displayName email status displayPicture")
          .limit(10);

        res.json(recipients);
      } catch (err) {
        res.status(500).json({ error: err instanceof Error && err.message });
      }
    },
  );
};
