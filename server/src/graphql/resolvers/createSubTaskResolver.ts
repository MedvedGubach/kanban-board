import SubTask from "../../models/subTask";
import { authenticate } from "../../middleware/authMiddleware";
import { Request } from "express";
import { ApolloError } from "apollo-server-express";
import mongoose from "mongoose";

const createSubTaskResolver = {
    Mutation: {
        createSubTask: async (_: any, { title, subTask, taskId, subTaskStatus, priority, dueDate }:
            { title: string, subTask: string, taskId: string, subTaskStatus: string, priority: string, dueDate: string },
            context: { req: Request }) => {
            try {
                const user = authenticate(context.req);
                if (!user) { throw new ApolloError("Unauthorized", "NO_TOKEN"); }
                
                const newSubTask = await SubTask.create
                    ({
                        title: title,
                        subTask: subTask,
                        taskId: new mongoose.Types.ObjectId(taskId),
                        createdBy: new mongoose.Types.ObjectId(user.id),
                        subTaskStatus: subTaskStatus,
                        priority: priority,
                        dueDate: dueDate
                    });
                if (!newSubTask) { throw new ApolloError("Failed to create sub-task", "FAIL_CREATE") }
                return {
                    title: newSubTask.title,
                    subTask: newSubTask.subTask,
                    taskId: newSubTask.taskId.toString(),
                    createdBy: newSubTask.createdBy.toString(),
                    subTaskStatus: newSubTask.subTaskStatus,
                    priority: newSubTask.priority,
                    dueDate: newSubTask.dueDate,
                }
            } catch (error) {
                if (error instanceof ApolloError) {
                    console.error('ApolloError:', error);
                    throw error;
                }
                console.error('Server Error:', error);
                throw new ApolloError("Server failed to create task", "SERVER_ERROR");
            }
        }
    }
}
export default createSubTaskResolver;
