import board from "../../models/board";
import { ApolloError } from "apollo-server-express";
import { authenticate } from "../../middleware/authMiddleware";
import { Request } from "express";
import mongoose from "mongoose";

const deleteBoardResolver = {
    Mutation: {
        deleteBoard: async (_: any, { id }: { id: string }, context: { req: Request }) => {
            try {
                const user = authenticate(context.req);
                if (!user) { throw new ApolloError("Unauthorized", "NO_TOKEN"); }
                if (!mongoose.Types.ObjectId.isValid(id)) { throw new ApolloError("Invalid board ID", "INVALID_ID"); }

                const deleteBoard = await board.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id), createdBy: new mongoose.Types.ObjectId(user.id) });
                if (!deleteBoard) { throw new ApolloError("Failed to find board", "FAILED_TO_DELETE") } else { return true }

            } catch (error) {
                if (error instanceof ApolloError) throw error;
                throw new ApolloError("Server failed to delete board", "SERVER_ERROR");
            }
        }
    }
}

export default deleteBoardResolver;