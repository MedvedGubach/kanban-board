import task from "../../models/task";
import { authenticate } from "../../middleware/authMiddleware";
import { Request } from "express";
import { ApolloError } from "apollo-server-express";
import mongoose from "mongoose";

const createTaskResolver = {
    Mutation: {
        createTask: async (_: any, { title, description, board, status }: any, context: { req: Request }) => {
            try {
                const user = authenticate(context.req);
                if (!user) { throw new ApolloError("Unauthorized", "NO_TOKEN"); }
                const newTask = await task.create({ title, description, board, createdBy: new mongoose.Types.ObjectId(user.id), status });
                if (!newTask) { throw new ApolloError("Failed to create task", "FAIL_CREATE") }

                return {
                    title: newTask.title,
                    description: newTask.description,
                    board: newTask.board.toString(),
                    createdBy: newTask.createdBy.toString(),
                    status: newTask.status,
                }

            } catch (error) {
                if (error instanceof ApolloError) throw error;
                throw new ApolloError("Server failed to create task", "SERVER_ERROR");
            }
        }
    }
}


export default createTaskResolver;