import { Request, Response } from "express";
import requireLogin from "../middlewares/requireLogin.js";
import User from "../models/user.js";
import z from "zod";
import { fromZodError } from "zod-validation-error";

const ProfileUpdateFormSchema = z.object({
  displayName: z
    .string()
    .min(3, "Minimum length of display name is 3 characters")
    .max(30, "Maximum length of display name is 30 characters"),
  status: z.string().max(100, "Maximum of 100 characters for status"),
});

type TProfileUpdateFormSchema = z.infer<typeof ProfileUpdateFormSchema>;

export default (app: import("express").Express) => {
  app.put("/api/user", requireLogin, async (req: Request, res: Response) => {
    try {
      const { displayName, status } = req.body;
      const profileUpdateFields: TProfileUpdateFormSchema = {
        displayName,
        status,
      };
      const updateFields: { displayName?: String; status?: String } = {};
      const result = ProfileUpdateFormSchema.safeParse(profileUpdateFields);

      if (!result.success) {
        const { message } = fromZodError(result.error);
        return res.status(400).json(message);
      }
      updateFields.displayName = displayName.trim();
      updateFields.status = status.trim();

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
