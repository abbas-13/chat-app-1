import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import "./models/user.js";
import "./services/passport.js";
import "./services/socket-io.js";
import authRoutes from "./routes/authRoutes";
import passport from "passport";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { app, io, server } from "./services/socket-io.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

await mongoose.connect(process.env.MONGODB_URI || "");
console.log("MongoDB Connected!");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const sessionConfig = session({
  secret: process.env.COOKIE_KEY!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    client: mongoose.connection.getClient() as any,
  }),
  cookie: {
    secure: "auto",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    maxAge: 24 * 3600 * 1000,
  },
});

app.use(sessionConfig);

io.engine.use(sessionConfig);

const PORT = process.env.PORT || 8000;

app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);
conversationRoutes(app);
messageRoutes(app);
uploadRoutes(app);
userRoutes(app);

app.get("health", (req, res) => {
  res.status(200).json({ status: "OK", timeStamp: new Date() });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get("/{*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running successfully, and listening on port " + PORT);
});
