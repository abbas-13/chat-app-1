import passport, { type Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const User = mongoose.model("User");

interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  googleId?: string;
  githubId?: string;
  displayName?: string;
  name?: string;
  email?: string;
  local?: {
    email: string;
    password: string;
  };
  displayPicture?: string;
}

interface VerifyCallback {
  (error: any, user?: IUser | false | null): void;
}

passport.serializeUser((user: any, done: (err: any, id: string) => void) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: VerifyCallback) => {
  const user = await User.findById(id);

  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done,
    ) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          name: profile.name?.givenName,
          email: profile.emails && profile.emails[0].value,
        });

        await user.save();
        done(null, user);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err : "Unkown error occurred";
        console.log(errorMessage);
        done(err, false);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "/auth/github/callback",
      proxy: true,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const existingUser = await User.findOne({ githubId: profile.id });

        if (existingUser) {
          done(null, existingUser);
        }

        const user = new User({
          githubId: profile.id,
          name: profile.displayName,
          username: profile.username,
        });

        await user.save();
        done(null, user);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err : "Unkown error occurred";
        console.log(errorMessage);
        done(err, null);
      }
    },
  ),
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ "local.email": email });

        if (!user || !user.local.password) return done(null, false);

        const valid = await bcrypt.compare(password, user.local.password);
        valid ? done(null, user) : done(null, false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err : "Unkown error occurred";
        console.log(errorMessage);
        done(err, undefined);
      }
    },
  ),
);
