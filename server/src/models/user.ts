import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: [true, "User name is mandatory"], },
    email: { type: String, required: [true, "Email is mandatory"], unique: true, match: [/\S+@\S+\.\S+/, "Email not valid"], },
    password: { type: String, required: [true, "Password is mandatory and at least 6 characters"], minlength: 6, },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
