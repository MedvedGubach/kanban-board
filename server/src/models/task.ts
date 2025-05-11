import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board" /* Relaciona con el board al que pertenece || links to the board the task belongs to */,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" /* El usuario que lo creó || user who created it */,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "In progress",
        "Complete",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("task", taskSchema);
