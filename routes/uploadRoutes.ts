import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { type Request, type Response } from "express";

import User from "../models/user.ts";

cloudinary.config({
  cloud_name: "dvigsh8tl",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(
      file.originalname.toLowerCase().split(".").pop()!,
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export default (app: import("express").Express) => {
  app.post(
    "/api/users/profile-picture",
    upload.single("displayPicture"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const result = await new Promise<{ secure_url: string }>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "profile-pictures",
                public_id: `user_${(req.user as any)._id}`,
                transformation: [
                  {
                    width: 500,
                    height: 500,
                    crop: "fill",
                  },
                  {
                    quality: "auto",
                    fetch_format: "auto",
                  },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result as any);
              },
            );

            uploadStream.end(req.file!.buffer);
          },
        );

        await User.findByIdAndUpdate(
          (req.user as any)._id,
          { displayPicture: result.secure_url },
          { new: true },
        );

        res.json({
          success: true,
          displayPicture: result.secure_url,
        });
      } catch (err) {
        console.error("Upload error: ", err);
        if ((err as Error).message.includes("File too large")) {
          return res.status(400).json({ error: "File too large. Max 5MB" });
        }

        res.status(500).json({
          error: "Upload failed. Please try again.",
        });
      }
    },
  );
};
