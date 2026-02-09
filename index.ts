import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path, { dirname } from "path";

import "dotenv/config";
import "./models/user.js";
import "./services/passport.js";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

await mongoose.connect(process.env.MONGODB_URI || "");
console.log("MongoDB Connected!");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(
  session({
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
  }),
);

const PORT = process.env.PORT || 8000;

app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);

app.get("health", (req, res) => {
  res.status(200).json({ status: "OK", timeStamp: new Date() });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get("/{*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
  });
}

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server running successfully, and listening on port " + PORT);
  } else {
    console.log("Server did not start. ERROR: ", error);
  }
});
