import { ApolloError } from "apollo-server-errors";
import board from "../../models/board";
import { authenticate } from "../../middleware/authMiddleware";
import { Request } from "express";

export const getBoardsResolver = {
    Query: {
        getBoards: async (_: any, __: any, context: { req: Request }) => {
            try {
                const user = authenticate(context.req);
                if (!user) { throw new ApolloError("Unauthorized", "NO_TOKEN"); }

                const boards = await board.find({ createdBy: user.id }).lean();

                if (!boards || boards.length === 0) { throw new ApolloError("No boards found", "NO_BOARDS"); }

                return boards.map(board => ({
                    id: board._id.toString(),
                    title: board.title,
                    description: board.description,
                    createdBy: board.createdBy.toString(),
                }));

            } catch (error) {
                if (error instanceof ApolloError) throw error;
                throw new ApolloError("Server failed to fetch boards", "SERVER_ERROR");
            }
        },
    },
};
