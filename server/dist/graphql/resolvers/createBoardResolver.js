"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = __importDefault(require("../../models/board"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const createBoardResolver = {
    Mutation: {
        createBoard: async (_, { title, description }, context) => {
            try {
                const user = (0, authMiddleware_1.authenticate)(context.req); /* Gets user from token */
                if (!user) {
                    throw new apollo_server_express_1.ApolloError("Unauthorized", "NO_TOKEN");
                }
                const newBoard = await board_1.default.create({ title, description, createdBy: new mongoose_1.default.Types.ObjectId(user.id) });
                if (!newBoard) {
                    throw new apollo_server_express_1.ApolloError("Failed to create board", "FAILED_TO_CREATE");
                }
                return {
                    title: newBoard.title,
                    description: newBoard.description,
                    createdBy: newBoard.createdBy.toString(),
                };
            }
            catch (error) {
                if (error instanceof apollo_server_express_1.ApolloError)
                    throw error;
                throw new apollo_server_express_1.ApolloError("Server failed to create task", "SERVER_ERROR");
            }
        }
    }
};
exports.default = createBoardResolver;
