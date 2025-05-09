import task from "../../models/task";
import mongoose from "mongoose";
import { ApolloError } from "apollo-server-express";
import { authenticate } from "../../middleware/authMiddleware";
import { Request } from "express";


export const getTasksResolver = {
    Query: {
        getTasks: async (_: any, { board }: { board: string }, context: { req: Request }) => {
            try {
                const user = authenticate(context.req);
                if (!user) { throw new ApolloError("Unauthorized", "NO_TOKEN"); }
                if (!mongoose.Types.ObjectId.isValid(board)) { throw new ApolloError("Invalid board ID", "INVALID_BOARD_ID"); }

                const tasksFind = await task.find({ board: new mongoose.Types.ObjectId(board) }).lean();

                if (!tasksFind || tasksFind.length === 0) { throw new ApolloError("No tasks found", "NO_TASKS"); }
                return tasksFind.map(task => ({
                    id: task._id.toString(),
                    title: task.title,
                    description: task.description,
                    board: task.board.toString(),
                    createdBy: task.createdBy.toString(),
                    status: task.status,
                }));

            } catch (error) {
                if (error instanceof ApolloError) throw error;
                throw new ApolloError("Server failed to fetch tasks", "SERVER_ERROR");
            }
        }
    }
}