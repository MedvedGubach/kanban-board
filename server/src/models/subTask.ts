import mongoose, { Document, Schema } from "mongoose";

interface ISubTask extends Document {
    title: string;
    subTask: string;
    taskId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    subTaskStatus: "Pending" | "Complete";
    priority: string;
    dueDate: string;
}

const subTaskSchema = new Schema<ISubTask>(
    {
        title: { type: String, required: true },
        subTask: { type: String, required: true },
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true, },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        subTaskStatus: { type: String, enum: ["Pending", "Complete"], default: "Pending", },
        priority: { type: String, enum: ["Low", "Medium", "High"], required: true, },
        dueDate: { type: String, required: true, }
    },
    { timestamps: true }
);

export default mongoose.model<ISubTask>("SubTask", subTaskSchema);
