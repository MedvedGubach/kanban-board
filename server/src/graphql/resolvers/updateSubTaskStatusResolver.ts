import SubTask from "../../models/subTask";
import { Request } from "express";
import { authenticate } from "../../middleware/authMiddleware";
import { ApolloError } from "apollo-server-express";
import mongoose from "mongoose";
const updateSubTaskStatusResolver = {
    Mutation: {
        updateSubTaskStatus: async (_: any, { id, subTaskStatus }: { id: string, subTaskStatus: string }, context: { req: Request }) => {
            try {
                const user = authenticate(context.req);
                if (!user) { throw new ApolloError("Unauthorized", "NO_TOKEN") };
                const updateSubTaskStatus = await SubTask.findByIdAndUpdate(new mongoose.Types.ObjectId(id), { subTaskStatus: subTaskStatus }).lean();
                if (!updateSubTaskStatus) { throw new ApolloError("Failed to update task status", "FAILED_TO_UPDATE") };

                return {
                    id: updateSubTaskStatus._id.toString(),
                    subTaskStatus: updateSubTaskStatus.subTaskStatus
                }
            } catch (error) {
                if (error instanceof ApolloError) throw error;
                throw new ApolloError("Server failed to create task", "SERVER_ERROR");
            }
        }
    }
}

export default updateSubTaskStatusResolver;