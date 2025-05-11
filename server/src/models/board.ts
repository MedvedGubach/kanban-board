import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("board", boardSchema);
