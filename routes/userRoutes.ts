import { Request, Response } from "express";
import requireLogin from "../middlewares/requireLogin.js";
import User from "../models/user.js";

export default (app: import("express").Express) => {
  app.put("/api/user", requireLogin, async (req: Request, res: Response) => {
    try {
      const { displayName, status } = req.body;
      const updateFields: { displayName?: String; status?: String } = {};

      if (displayName !== undefined) {
        if (displayName.trim().length < 3) {
          return res
            .status(400)
            .json({ error: "Display name must be at least 3 characters" });
        }

        if (displayName.trim().length > 30) {
          return res
            .status(400)
            .json({ error: "Display name must be less than 30 characters" });
        }

        updateFields.displayName = displayName.trim();
      }

      if (status !== undefined) {
        if (status.trim().length > 100) {
          return res
            .status(400)
            .json({ error: "Status must be less than 100 characters" });
        }
        updateFields.status = status.trim();
      }

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        (req.user as any)._id,
        { $set: updateFields },
        { new: true, runValidators: true },
      ).select("displayName status email username");

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        success: true,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        status: updatedUser.status,
      });
    } catch (err) {
      console.log(err);
    }
  });
};
