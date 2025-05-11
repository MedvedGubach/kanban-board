import task from "../../models/task";
import { ApolloError } from "apollo-server-express";
import { authenticate } from "../../middleware/authMiddleware";
import { Request } from "express";
import mongoose from "mongoose";

const deleteTaskResolver = {
    Mutation: {
        deleteTask: async (_: any, { taskId }: { taskId: string }, context: { req: Request }) => {
            try {
                const user = authenticate(context.req);
                if (!user) { throw new ApolloError("Unauthorized", "NO_TOKEN"); }
                if (!mongoose.Types.ObjectId.isValid(taskId)) { throw new ApolloError("Invalid task ID", "INVALID_ID"); }

                const deleteTask = await task.findOneAndDelete({ _id: new mongoose.Types.ObjectId(taskId), createdBy: new mongoose.Types.ObjectId(user.id) });
                if (!deleteTask) { throw new ApolloError("Failed to find board", "FAILED_TO_DELETE") } else { return true }

            } catch (error) {
                if (error instanceof ApolloError) throw error;
                throw new ApolloError("Server failed to delete board", "SERVER_ERROR");
            }


        }
    }
}

export default deleteTaskResolver;