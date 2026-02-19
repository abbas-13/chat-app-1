import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  githubId: String,
  googleId: String,
  displayName: String,
  username: String,
  local: {
    email: String,
    password: String,
    name: String,
  },
  avatar: String,
  isOnline: { type: Boolean, default: false },
  displayPicture: String,
  status: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
