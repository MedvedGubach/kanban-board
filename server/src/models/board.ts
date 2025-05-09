import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" /* Relaciona con el usuario que lo creo || binds with user who created te board */,
      required: true,
    },
  },
  {
    timestamps: true,
  } /* Agrega createdAt y updatedAt automticamente || adds createdAt and updatedAt automatically */
);

export default mongoose.model("board", boardSchema);
