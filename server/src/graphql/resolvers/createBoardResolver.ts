import board from "../../models/board";
import { authenticate } from "../../middleware/authMiddleware";
import { Request } from "express";
import { ApolloError } from "apollo-server-express";
import mongoose from "mongoose";

const createBoardResolver = {
    Mutation: {
        createBoard: async (_: any, { title, description }: any, context: { req: Request }) => {
            try {
                const user = authenticate(context.req); /* Gets user from token */
                if (!user) { throw new ApolloError("Unauthorized", "NO_TOKEN"); }
                const newBoard = await board.create({ title, description, createdBy: new mongoose.Types.ObjectId(user.id) });
                if (!newBoard) { throw new ApolloError("Failed to create board", "FAILED_TO_CREATE") }

                return {
                    title: newBoard.title,
                    description: newBoard.description,
                    createdBy: newBoard.createdBy.toString(),
                }
            } catch (error) {
                if (error instanceof ApolloError) throw error;
                throw new ApolloError("Server failed to create task", "SERVER_ERROR");
            }

        }
    }
}


export default createBoardResolver;