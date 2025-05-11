import SubTask from "../../models/subTask";
import { ApolloError } from "apollo-server-errors";
import { authenticate } from "../../middleware/authMiddleware";
import { Request } from "express";
import mongoose from "mongoose";
const getSubTaskResolver = {
    Query: {
        getSubTasks: async (_: any, { taskId }: { taskId: string }, context: { req: Request }) => {
            try {
                const user = authenticate(context.req);
                if (!user) { throw new ApolloError("Unauthorized", "NO_TOKEN"); }

                const getSubTasks = await SubTask.find({
                    createdBy: new mongoose.Types.ObjectId(user.id),
                    taskId: new mongoose.Types.ObjectId(taskId)
                }).lean();
                if (!getSubTasks || getSubTasks.length === 0) { throw new ApolloError("No subtasks found", "NO_SUBTASKS"); }

                return getSubTasks.map(subtask => ({
                    id: subtask._id.toString(),
                    title: subtask.title,
                    subTask: subtask.subTask,
                    taskId: subtask.taskId.toString(),
                    createdBy: subtask.createdBy.toString(),
                    subTaskStatus: subtask.subTaskStatus,
                    priority: subtask.priority,
                    dueDate: subtask.dueDate
                }))
            }

            catch (error) {
                if (error instanceof ApolloError) throw error;
                throw new ApolloError("Server failed to fetch subtasks", "SERVER_ERROR");
            }
        }
    }
}

export default getSubTaskResolver;