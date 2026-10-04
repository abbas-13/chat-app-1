import passport from "passport";
import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user.ts";

export default (app: import("express").Express) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/signup" }),
    (req: Request, res: Response) => {
      res.redirect(
        process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000/",
      );
    },
  );

  app.get(
    "/auth/github",
    passport.authenticate("github", {
      scope: ["user:email"],
    }),
  );

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/signup" }),
    (req: Request, res: Response) => {
      res.redirect(
        process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000/",
      );
    },
  );

  app.post("/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, name, password } = req.body;
      const existingUser = await User.findOne({ "local.email": email });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashed = await bcrypt.hash(password, 12);
      const user = new User({
        local: { email, password: hashed },
        email,
        name,
      });

      await user.save();

      req.login(user, (err) => {
        if (err) return res.status(500).json({ errorMessage: err.message });

        const { local, ...userResponse } = user.toObject();
        res.json({
          user: userResponse,
          message: "Sign up successfull",
        });
      });
    } catch (err) {
      res.json(err);
    }
  });

  app.post("/auth/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: any,
        info: { message?: string } | undefined,
      ) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user)
          return res
            .status(400)
            .json({ error: info?.message ?? "Invalid credentials" });

        req.logIn(user, (loginErr) => {
          if (loginErr)
            return res.status(500).json({ error: loginErr.message });
          return res.json({ user });
        });
      },
    )(req, res, next);
  });

  app.get("/api/currentUser", (req: Request, res: Response) => {
    if (req.user) res.status(200).send(req.user);
    else res.status(403).json("User not logged in");
  });

  app.post(
    "/auth/logout",
    (req: Request, res: Response, next: NextFunction) => {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
      });
      res.json("User logged out successfully");
    },
  );
};
