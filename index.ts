import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import "./models/user.ts";
import "./services/passport.ts";
import "./services/socket-io.ts";
import authRoutes from "./routes/authRoutes.ts";
import passport from "passport";
import conversationRoutes from "./routes/conversationRoutes.ts";
import messageRoutes from "./routes/messageRoutes.ts";
import { app, io, server } from "./services/socket-io.ts";
import uploadRoutes from "./routes/uploadRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("trust proxy", 1);
app.use(express.json());

await mongoose.connect(process.env.MONGODB_URI || "");
console.log("MongoDB Connected!");

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://chat-app-1-5mmu.onrender.com"
      : "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI!,
    stringify: false, // connect-mongo v6 + passport
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

app.use(sessionMiddleware);

io.engine.use(sessionMiddleware);

const PORT = process.env.PORT || 8000;

app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);
conversationRoutes(app);
messageRoutes(app);
uploadRoutes(app);
userRoutes(app);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timeStamp: new Date() });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running successfully, and listening on port " + PORT);
});
